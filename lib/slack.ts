import type { Inquiry } from './database';

const DEFAULT_ELI_USERNAME = 'eli.isla';
const DEFAULT_BREE_USERNAME = 'bree.bryce';

export function isSlackConfigured(): boolean {
  return !!process.env.SLACK_BOT_TOKEN;
}

type SlackMember = {
  id: string;
  deleted?: boolean;
  is_bot?: boolean;
  name?: string;
  real_name?: string;
  profile?: { real_name?: string; display_name?: string };
};

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function memberMatchesFullName(member: SlackMember, first: string, last: string): boolean {
  const target = normalizeName(`${first} ${last}`);
  const candidates = [
    member.real_name,
    member.profile?.real_name,
    member.profile?.display_name,
    member.name?.replace(/[._-]/g, ' '),
  ].filter(Boolean) as string[];

  return candidates.some((name) => normalizeName(name) === target);
}

async function fetchSlackMembers(token: string): Promise<SlackMember[] | null> {
  const members: SlackMember[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({ limit: '200' });
    if (cursor) params.set('cursor', cursor);

    const response = await fetch(`https://slack.com/api/users.list?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!data.ok) {
      if (data.error === 'missing_scope') return null;
      console.error('Slack users.list error:', data.error);
      return null;
    }

    members.push(...(data.members || []));
    cursor = data.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return members;
}

async function resolveUserIdByFullName(
  token: string,
  first: string,
  last: string,
  members?: SlackMember[] | null
): Promise<string | null> {
  const list = members ?? (await fetchSlackMembers(token));
  if (!list) return null;

  const match = list.find(
    (member) => !member.deleted && !member.is_bot && memberMatchesFullName(member, first, last)
  );

  return match?.id ?? null;
}

async function buildMentionText(token: string): Promise<{ text: string; useLinkNames: boolean }> {
  const configuredIds = [
    process.env.SLACK_MENTION_ELI,
    process.env.SLACK_MENTION_BREE,
  ].filter(Boolean) as string[];

  if (configuredIds.length === 2) {
    return {
      text: configuredIds.map((id) => `<@${id}>`).join(' '),
      useLinkNames: false,
    };
  }

  const fromList = process.env.SLACK_MENTION_USER_IDS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromList?.length) {
    return {
      text: fromList.map((id) => `<@${id}>`).join(' '),
      useLinkNames: false,
    };
  }

  const members = await fetchSlackMembers(token);
  const eliId = await resolveUserIdByFullName(token, 'Eli', 'Isla', members);
  const breeId = await resolveUserIdByFullName(token, 'Bree', 'Bryce', members);

  if (eliId && breeId) {
    return {
      text: `<@${eliId}> <@${breeId}>`,
      useLinkNames: false,
    };
  }

  const eliUsername = process.env.SLACK_MENTION_ELI_USERNAME || DEFAULT_ELI_USERNAME;
  const breeUsername = process.env.SLACK_MENTION_BREE_USERNAME || DEFAULT_BREE_USERNAME;

  return {
    text: `@${eliUsername} @${breeUsername}`,
    useLinkNames: true,
  };
}

function buildInquiryBlocks(inquiry: Inquiry, mentionText: string) {
  const fields = [
    { type: 'mrkdwn', text: `*Name:*\n${inquiry.name}` },
    { type: 'mrkdwn', text: `*Email:*\n${inquiry.email}` },
    { type: 'mrkdwn', text: `*Phone:*\n${inquiry.phone || 'Not provided'}` },
    { type: 'mrkdwn', text: `*Wedding Date:*\n${inquiry.weddingDate || 'Not provided'}` },
    { type: 'mrkdwn', text: `*Venue:*\n${inquiry.venue || 'Not provided'}` },
    { type: 'mrkdwn', text: `*Referral:*\n${inquiry.referralSource || 'Not provided'}` },
  ];

  if (inquiry.fianceName) {
    fields.push({ type: 'mrkdwn', text: `*Partner/Instagram:*\n${inquiry.fianceName}` });
  }

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${mentionText} — *new wedding inquiry*`,
      },
    },
    {
      type: 'header',
      text: { type: 'plain_text', text: '🚨 New Wedding Inquiry', emoji: true },
    },
    {
      type: 'section',
      fields: fields.slice(0, 4),
    },
    {
      type: 'section',
      fields: fields.slice(4),
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Respond within 5–15 minutes · <https://yourlovefilms.com/crm|Open CRM>`,
        },
      ],
    },
  ];
}

export async function notifyNewInquiry(
  inquiry: Inquiry
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.SLACK_BOT_TOKEN) {
    return { success: false, error: 'SLACK_BOT_TOKEN not configured' };
  }

  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_SALES_CHANNEL || '#sales';
  const { text: mentionText, useLinkNames } = await buildMentionText(token);
  const blocks = buildInquiryBlocks(inquiry, mentionText);
  const fallbackText = `${mentionText} — New wedding inquiry from ${inquiry.name} — ${inquiry.weddingDate || 'date TBD'} at ${inquiry.venue || 'venue TBD'}`;

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel,
        text: fallbackText,
        blocks,
        link_names: useLinkNames,
      }),
    });
    const data = await response.json();
    if (data.ok) {
      console.log('Slack notification sent to', channel);
      return { success: true };
    }
    console.error('Slack API error:', data.error);
    return { success: false, error: data.error || 'Slack API request failed' };
  } catch (error) {
    console.error('Slack bot error:', error);
    return { success: false, error: String(error) };
  }
}
