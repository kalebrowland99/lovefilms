export interface ContactFormData {
  name?: string;
  email?: string;
  phone?: string;
  fianceName?: string;
  weddingDate?: string;
  venue?: string;
  referralSource?: string;
  companyWebsite?: string; // honeypot
  [key: string]: unknown;
}

const SPAM_KEYWORDS =
  /\b(casino|viagra|crypto|bitcoin|seo services|video editing services|eternaedits|click here|buy now|free money)\b/i;
const URL_PATTERN = /https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ru|xyz|info|biz)\b/i;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function countCaseTransitions(value: string): number {
  let transitions = 0;
  for (let i = 1; i < value.length; i++) {
    const prevUpper = value[i - 1] === value[i - 1].toUpperCase() && value[i - 1] !== value[i - 1].toLowerCase();
    const currUpper = value[i] === value[i].toUpperCase() && value[i] !== value[i].toLowerCase();
    if (prevUpper !== currUpper) transitions++;
  }
  return transitions;
}

function isGibberishToken(token: string): boolean {
  const word = token.replace(/[^a-zA-Z]/g, '');
  if (word.length < 14) return false;

  const transitions = countCaseTransitions(word);
  const vowels = (word.match(/[aeiouAEIOU]/g) || []).length;
  const vowelRatio = vowels / word.length;
  const consonantRun = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{6,}/.test(word);

  if (transitions >= 3) return true;
  if (consonantRun) return true;
  if (word.length >= 16 && vowelRatio < 0.2) return true;

  return false;
}

function isGibberishText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  const tokens = trimmed.split(/\s+/);
  if (tokens.some(isGibberishToken)) return true;

  // Single long token with alternating case (common bot pattern)
  if (tokens.length === 1 && trimmed.length >= 15 && countCaseTransitions(trimmed) >= 2) {
    return true;
  }

  return false;
}

function isDotStuffedEmail(email: string): boolean {
  const local = email.split('@')[0] || '';
  return (local.match(/\./g) || []).length >= 3;
}

function isSpamEmail(email: string): boolean {
  if (!email || !EMAIL_PATTERN.test(email)) return true;
  if (isDotStuffedEmail(email)) return true;
  return false;
}

export function getSpamReasons(data: ContactFormData): string[] {
  const reasons: string[] = [];

  if (data.companyWebsite?.trim()) {
    reasons.push('honeypot');
  }

  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const venue = String(data.venue || '').trim();
  const fianceName = String(data.fianceName || '').trim();
  const combined = `${name} ${email} ${venue} ${fianceName}`;

  if (!name || name.length > 60) reasons.push('invalid-name');
  if (isGibberishText(name)) reasons.push('gibberish-name');
  if (isSpamEmail(email)) reasons.push('invalid-email');
  if (!venue || venue.length > 120) reasons.push('invalid-venue');
  if (isGibberishText(venue)) reasons.push('gibberish-venue');
  if (fianceName && (fianceName.length > 60 || isGibberishText(fianceName))) {
    reasons.push('gibberish-fiance');
  }
  if (URL_PATTERN.test(`${name} ${venue} ${fianceName}`)) reasons.push('url-in-field');
  if (SPAM_KEYWORDS.test(combined)) reasons.push('spam-keywords');

  return reasons;
}

export function isSpamSubmission(data: ContactFormData): boolean {
  return getSpamReasons(data).length > 0;
}

export const SPAM_SUCCESS_RESPONSE = {
  success: true,
  message: "Thank you! We'll be in touch within 30 minutes!",
};
