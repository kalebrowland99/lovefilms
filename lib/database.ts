import fs from 'fs';
import path from 'path';

// Use /tmp directory on Vercel (serverless), or local data directory in development
const IS_VERCEL = process.env.VERCEL === '1';
const DATA_DIR = IS_VERCEL ? '/tmp/data' : path.join(process.cwd(), 'data');
const INQUIRIES_PATH = path.join(DATA_DIR, 'inquiries.json');
const EMAIL_LOGS_PATH = path.join(DATA_DIR, 'email-logs.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Inquiry Types
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  fianceName: string;
  weddingDate: string;
  venue: string;
  videographer?: string; // Optional - removed from forms
  status: 'new' | 'contacted' | 'booked' | 'dead';
  createdAt: string;
  followUpSentAt?: {
    day1?: string;
    day3?: string;
    day6?: string;
    day10?: string;
    day14?: string;
  };
  smsSentAt?: {
    day0?: string;
    day2?: string;
    day4?: string;
  };
}

export interface EmailLog {
  id: string;
  inquiryId: string;
  recipientEmail: string;
  recipientName: string;
  templateType: 'welcome' | 'prices' | 'notification' | 'followup-day1' | 'followup-day3' | 'followup-day6' | 'followup-day10' | 'followup-day14' | 'sms';
  subject: string;
  sentAt: string;
  status: 'sent' | 'failed';
  error?: string;
  messageType?: 'email' | 'sms';
}

// Read inquiries
export function getInquiries(): Inquiry[] {
  ensureDataDir();
  if (!fs.existsSync(INQUIRIES_PATH)) {
    fs.writeFileSync(INQUIRIES_PATH, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(INQUIRIES_PATH, 'utf8');
    const parsed = JSON.parse(data);
    // Ensure we always return a valid array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading inquiries:', error);
    return [];
  }
}

// Save inquiry
export function saveInquiry(inquiry: Inquiry): void {
  ensureDataDir();
  const inquiries = getInquiries();
  inquiries.push(inquiry);
  try {
    // Write to temp file first, then rename (atomic operation)
    const tempPath = INQUIRIES_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(inquiries, null, 2));
    fs.renameSync(tempPath, INQUIRIES_PATH);
  } catch (error) {
    console.error('Error saving inquiry:', error);
    throw error;
  }
}

// Update inquiry
export function updateInquiry(id: string, updates: Partial<Inquiry>): void {
  ensureDataDir();
  const inquiries = getInquiries();
  const index = inquiries.findIndex(i => i.id === id);
  if (index !== -1) {
    inquiries[index] = { ...inquiries[index], ...updates };
    try {
      // Write to temp file first, then rename (atomic operation)
      const tempPath = INQUIRIES_PATH + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(inquiries, null, 2));
      fs.renameSync(tempPath, INQUIRIES_PATH);
    } catch (error) {
      console.error('Error updating inquiry:', error);
      throw error;
    }
  }
}

// Get inquiry by ID
export function getInquiryById(id: string): Inquiry | undefined {
  const inquiries = getInquiries();
  return inquiries.find(i => i.id === id);
}

// Read email logs
export function getEmailLogs(): EmailLog[] {
  ensureDataDir();
  if (!fs.existsSync(EMAIL_LOGS_PATH)) {
    fs.writeFileSync(EMAIL_LOGS_PATH, JSON.stringify([], null, 2));
    return [];
  }
  const data = fs.readFileSync(EMAIL_LOGS_PATH, 'utf8');
  return JSON.parse(data);
}

// Save email log
export function saveEmailLog(log: EmailLog): void {
  ensureDataDir();
  const logs = getEmailLogs();
  logs.push(log);
  // Keep only last 1000 logs to prevent file from getting too large
  const trimmedLogs = logs.slice(-1000);
  fs.writeFileSync(EMAIL_LOGS_PATH, JSON.stringify(trimmedLogs, null, 2));
}

// Get logs for specific inquiry
export function getLogsForInquiry(inquiryId: string): EmailLog[] {
  const logs = getEmailLogs();
  return logs.filter(log => log.inquiryId === inquiryId);
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

