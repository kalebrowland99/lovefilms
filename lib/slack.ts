import type { Inquiry } from './database';

export function isSlackConfigured(): boolean {
  return !!process.env.SLACK_BOT_TOKEN;
}

function buildMentionText(): string {
  const userIds = [
    process.env.SLACK_MENTION_ELI,
    process.env.SLACK_MENTION_BREE,
  ].filter(Boolean);

  if (userIds.length) {
    return userIds.map((id) => `<@${id}>`).join(' ');
  }

  const fromList = process.env.SLACK_MENTION_USER_IDS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromList?.length) {
    return fromList.map((id) => `<@${id}>`).join(' ');
  }

  return '@eli @bree';
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

  const channel = process.env.SLACK_SALES_CHANNEL || '#sales';
  const mentionText = buildMentionText();
  const blocks = buildInquiryBlocks(inquiry, mentionText);
  const fallbackText = `${mentionText} — New wedding inquiry from ${inquiry.name} — ${inquiry.weddingDate || 'date TBD'} at ${inquiry.venue || 'venue TBD'}`;
  const useLinkNames = !process.env.SLACK_MENTION_ELI && !process.env.SLACK_MENTION_BREE && !process.env.SLACK_MENTION_USER_IDS;

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
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
