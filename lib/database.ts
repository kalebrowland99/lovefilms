import fs from 'fs';
import path from 'path';
import { db, COLLECTIONS, AUTOMATION_SETTINGS_DOC_ID } from './firebase';

// Fallback: Use /tmp directory on Vercel (serverless), or local data directory in development
const IS_VERCEL = process.env.VERCEL === '1';
const DATA_DIR = IS_VERCEL ? '/tmp/data' : path.join(process.cwd(), 'data');
const INQUIRIES_PATH = path.join(DATA_DIR, 'inquiries.json');
const EMAIL_LOGS_PATH = path.join(DATA_DIR, 'email-logs.json');

// Check if Firebase is available
const USE_FIREBASE = db !== null;

// Ensure data directory exists (for fallback)
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
  referralSource?: string; // Where they found us (FB/IG or TikTok)
  videographer?: string; // Optional - removed from forms
  status: 'new' | 'contacted' | 'booked' | 'paid' | 'dead';
  createdAt: string;
  isManualEnrollment?: boolean; // Track if this was manually enrolled
  followUpSentAt?: {
    day1?: string;
    day3?: string;
    day4?: string;
    day6?: string;
    day10?: string;
    day14?: string;
  };
  manualFollowUpSentAt?: {
    day1?: string;
    day3?: string;
    day4?: string;
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
  templateType: 'availabilityday0' | 'inquiry' | 'followup-day1' | 'followup-day3' | 'followup-day4' | 'followup-day6' | 'followup-day10' | 'followup-day14' | 'manual-welcome' | 'manual-admin' | 'manual-followup-day1' | 'manual-followup-day3' | 'manual-followup-day4' | 'manual-followup-day6' | 'manual-followup-day10' | 'manual-followup-day14' | 'sms';
  subject: string;
  sentAt: string;
  status: 'sent' | 'failed';
  error?: string;
  messageType?: 'email' | 'sms';
}

export interface ScheduledEmail {
  id: string;
  inquiryId: string;
  recipientEmail: string;
  recipientName: string;
  templateKey: string;
  sendAt: string; // ISO timestamp when email should be sent
  emailData: any; // Data for template rendering
  attachmentUrl?: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
  error?: string;
}

export interface AutomationSettings {
  followUpDelays: {
    [key: string]: {
      enabled: boolean;
      delayInDays: number;
      name: string;
      description: string;
    };
  };
  sms: {
    enabled: boolean;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioPhoneNumber?: string;
    templates: {
      [key: string]: {
        enabled: boolean;
        delayInSeconds?: number;
        delayInDays?: number;
        name: string;
        message: string;
      };
    };
  };
  testMode: boolean;
}

export interface EmailTemplate {
    name: string;
    subject: string;
    enabled: boolean;
    sendTo: string;
    timing: string;
  content: string; // Single text field instead of multiple paragraphs
  callToAction?: string;
  callToActionUrl?: string;
  attachmentUrl?: string;
  showDetails?: boolean;
}

export interface EmailTemplates {
  [key: string]: EmailTemplate;
}

// ============================================================================
// FIREBASE IMPLEMENTATIONS
// ============================================================================

async function getInquiriesFromFirebase(): Promise<Inquiry[]> {
  if (!db) return [];
  try {
    const snapshot = await db.collection(COLLECTIONS.INQUIRIES).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
  } catch (error) {
    console.error('Error fetching inquiries from Firebase:', error);
    return [];
  }
}

async function saveInquiryToFirebase(inquiry: Inquiry): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');
  try {
    await db.collection(COLLECTIONS.INQUIRIES).doc(inquiry.id).set(inquiry);
  } catch (error) {
    console.error('Error saving inquiry to Firebase:', error);
    throw error;
  }
}

async function updateInquiryInFirebase(id: string, updates: Partial<Inquiry>): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');
  try {
    await db.collection(COLLECTIONS.INQUIRIES).doc(id).update(updates);
  } catch (error) {
    console.error('Error updating inquiry in Firebase:', error);
    throw error;
  }
}

async function deleteInquiryFromFirebase(id: string): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');
  try {
    await db.collection(COLLECTIONS.INQUIRIES).doc(id).delete();
    console.log(`🗑️ Deleted inquiry: ${id}`);
  } catch (error) {
    console.error('Error deleting inquiry from Firebase:', error);
    throw error;
  }
}

async function getInquiryByIdFromFirebase(id: string): Promise<Inquiry | undefined> {
  if (!db) return undefined;
  try {
    const doc = await db.collection(COLLECTIONS.INQUIRIES).doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as Inquiry;
  } catch (error) {
    console.error('Error fetching inquiry from Firebase:', error);
    return undefined;
  }
}

async function getEmailLogsFromFirebase(): Promise<EmailLog[]> {
  if (!db) return [];
  try {
    const snapshot = await db.collection(COLLECTIONS.EMAIL_LOGS)
      .orderBy('sentAt', 'desc')
      .limit(1000)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailLog));
  } catch (error) {
    console.error('Error fetching email logs from Firebase:', error);
    return [];
  }
}

async function saveEmailLogToFirebase(log: EmailLog): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');
  try {
    // Remove undefined values - Firestore doesn't allow them
    const cleanLog: any = {
      id: log.id,
      inquiryId: log.inquiryId,
      recipientEmail: log.recipientEmail,
      recipientName: log.recipientName,
      templateType: log.templateType,
      subject: log.subject,
      sentAt: log.sentAt,
      status: log.status
    };
    
    // Only add optional fields if they have values
    if (log.error !== undefined) cleanLog.error = log.error;
    if (log.messageType !== undefined) cleanLog.messageType = log.messageType;
    
    await db.collection(COLLECTIONS.EMAIL_LOGS).doc(log.id).set(cleanLog);
  } catch (error) {
    console.error('Error saving email log to Firebase:', error);
    throw error;
  }
}

async function getEmailLogByIdFromFirebase(id: string): Promise<EmailLog | undefined> {
  if (!db) return undefined;
  try {
    const doc = await db.collection(COLLECTIONS.EMAIL_LOGS).doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as EmailLog;
  } catch (error) {
    console.error('Error fetching email log from Firebase:', error);
    return undefined;
  }
}

async function getLogsForInquiryFromFirebase(inquiryId: string): Promise<EmailLog[]> {
  if (!db) return [];
  try {
    const snapshot = await db.collection(COLLECTIONS.EMAIL_LOGS)
      .where('inquiryId', '==', inquiryId)
      .orderBy('sentAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailLog));
  } catch (error) {
    console.error('Error fetching logs for inquiry from Firebase:', error);
    return [];
  }
}

// ============================================================================
// JSON FILE FALLBACK IMPLEMENTATIONS
// ============================================================================

function getInquiriesFromFile(): Inquiry[] {
  ensureDataDir();
  if (!fs.existsSync(INQUIRIES_PATH)) {
    fs.writeFileSync(INQUIRIES_PATH, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(INQUIRIES_PATH, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading inquiries:', error);
    return [];
  }
}

function saveInquiryToFile(inquiry: Inquiry): void {
  ensureDataDir();
  const inquiries = getInquiriesFromFile();
  inquiries.push(inquiry);
  try {
    const tempPath = INQUIRIES_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(inquiries, null, 2));
    fs.renameSync(tempPath, INQUIRIES_PATH);
  } catch (error) {
    console.error('Error saving inquiry:', error);
    throw error;
  }
}

function updateInquiryInFile(id: string, updates: Partial<Inquiry>): void {
  ensureDataDir();
  const inquiries = getInquiriesFromFile();
  const index = inquiries.findIndex(i => i.id === id);
  if (index !== -1) {
    inquiries[index] = { ...inquiries[index], ...updates };
    try {
      const tempPath = INQUIRIES_PATH + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(inquiries, null, 2));
      fs.renameSync(tempPath, INQUIRIES_PATH);
    } catch (error) {
      console.error('Error updating inquiry:', error);
      throw error;
    }
  }
}

function deleteInquiryFromFile(id: string): void {
  ensureDataDir();
  const inquiries = getInquiriesFromFile();
  const filtered = inquiries.filter(i => i.id !== id);
  try {
    const tempPath = INQUIRIES_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(filtered, null, 2));
    fs.renameSync(tempPath, INQUIRIES_PATH);
    console.log(`🗑️ Deleted inquiry: ${id}`);
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    throw error;
  }
}

function getInquiryByIdFromFile(id: string): Inquiry | undefined {
  const inquiries = getInquiriesFromFile();
  return inquiries.find(i => i.id === id);
}

function getEmailLogsFromFile(): EmailLog[] {
  ensureDataDir();
  if (!fs.existsSync(EMAIL_LOGS_PATH)) {
    fs.writeFileSync(EMAIL_LOGS_PATH, JSON.stringify([], null, 2));
    return [];
  }
  const data = fs.readFileSync(EMAIL_LOGS_PATH, 'utf8');
  return JSON.parse(data);
}

function saveEmailLogToFile(log: EmailLog): void {
  ensureDataDir();
  const logs = getEmailLogsFromFile();
  logs.push(log);
  const trimmedLogs = logs.slice(-1000);
  fs.writeFileSync(EMAIL_LOGS_PATH, JSON.stringify(trimmedLogs, null, 2));
}

function getLogsForInquiryFromFile(inquiryId: string): EmailLog[] {
  const logs = getEmailLogsFromFile();
  return logs.filter(log => log.inquiryId === inquiryId);
}

function getEmailLogByIdFromFile(id: string): EmailLog | undefined {
  const logs = getEmailLogsFromFile();
  return logs.find(log => log.id === id);
}

// ============================================================================
// FIREBASE - AUTOMATION SETTINGS
// ============================================================================

async function getAutomationSettingsFromFirebase(): Promise<AutomationSettings | null> {
  if (!db) return null;
  try {
    const doc = await db.collection(COLLECTIONS.AUTOMATION_SETTINGS).doc(AUTOMATION_SETTINGS_DOC_ID).get();
    if (!doc.exists) return null;
    return doc.data() as AutomationSettings;
  } catch (error) {
    console.error('Error fetching automation settings from Firebase:', error);
    return null;
  }
}

async function saveAutomationSettingsToFirebase(settings: AutomationSettings): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');
  try {
    await db.collection(COLLECTIONS.AUTOMATION_SETTINGS).doc(AUTOMATION_SETTINGS_DOC_ID).set(settings);
  } catch (error) {
    console.error('Error saving automation settings to Firebase:', error);
    throw error;
  }
}

// ============================================================================
// FIREBASE - EMAIL TEMPLATES
// ============================================================================

async function getEmailTemplatesFromFirebase(): Promise<EmailTemplates | null> {
  if (!db) return null;
  try {
    const snapshot = await db.collection(COLLECTIONS.EMAIL_TEMPLATES).get();
    
    // Check if global_templates document exists (old format)
    const hasGlobalTemplates = snapshot.docs.some(doc => doc.id === 'global_templates');
    
    if (hasGlobalTemplates) {
      console.log('🔄 Found global_templates document, migrating to individual documents...');
      const globalDoc = snapshot.docs.find(doc => doc.id === 'global_templates');
      if (globalDoc) {
        const oldData = globalDoc.data();
        console.log('📄 Templates in global_templates:', Object.keys(oldData || {}));
        
        if (oldData && Object.keys(oldData).length > 0) {
          // The old format had templates as nested objects
          // Save them as individual documents
          const batch = db.batch();
          for (const [templateId, templateData] of Object.entries(oldData)) {
            console.log(`  → Migrating template: ${templateId}`);
            const templateRef = db.collection(COLLECTIONS.EMAIL_TEMPLATES).doc(templateId);
            batch.set(templateRef, templateData as any);
          }
          // Delete the old global_templates document
          batch.delete(globalDoc.ref);
          await batch.commit();
          console.log(`✅ Migration complete! Migrated ${Object.keys(oldData).length} templates`);
          
          // Now fetch the newly migrated templates (excluding global_templates)
          const newSnapshot = await db.collection(COLLECTIONS.EMAIL_TEMPLATES).get();
          const templates: EmailTemplates = {};
          newSnapshot.docs.forEach(doc => {
            if (doc.id !== 'global_templates') {
              templates[doc.id] = doc.data() as EmailTemplate;
            }
          });
          console.log('📥 Loaded migrated templates:', Object.keys(templates));
          return templates;
        }
      }
    }
    
    // Regular loading - exclude global_templates if it somehow still exists
    const templates: EmailTemplates = {};
    snapshot.docs.forEach(doc => {
      if (doc.id !== 'global_templates') {
        templates[doc.id] = doc.data() as EmailTemplate;
      }
    });
    
    if (Object.keys(templates).length > 0) {
      console.log(`📥 Loaded ${Object.keys(templates).length} templates:`, Object.keys(templates));
      return templates;
    }
    
    console.log('📦 No templates found in collection');
    return null;
  } catch (error) {
    console.error('Error fetching email templates from Firebase:', error);
    return null;
  }
}

async function saveEmailTemplatesToFirebase(templates: EmailTemplates): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');
  try {
    // Validate templates structure
    if (!templates || typeof templates !== 'object') {
      throw new Error('Invalid templates structure: must be an object');
    }
    
    const batch = db.batch();
    let hasOperations = false;
    
    // Get existing templates to delete ones that are no longer in the new templates
    const existingSnapshot = await db.collection(COLLECTIONS.EMAIL_TEMPLATES).get();
    const existingIds = new Set(existingSnapshot.docs.map(doc => doc.id));
    const newIds = new Set(Object.keys(templates));
    
    // Delete templates that were removed
    existingSnapshot.docs.forEach(doc => {
      if (!newIds.has(doc.id)) {
        batch.delete(doc.ref);
        hasOperations = true;
      }
    });
    
    // Helper function to remove undefined values from an object
    // Firestore doesn't allow undefined values, so we must remove them
    const removeUndefined = (obj: any): any => {
      // Handle primitives and null
      if (obj === null || obj === undefined || typeof obj !== 'object') {
        return obj === undefined ? null : obj;
      }
      
      // Handle arrays
      if (Array.isArray(obj)) {
        return obj.map(item => removeUndefined(item)).filter(item => item !== undefined);
      }
      
      // Handle objects - create a new object without undefined values
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          const cleanedValue = removeUndefined(value);
          // Only add if the cleaned value is not undefined
          if (cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
          }
        }
      }
      return cleaned;
    };
    
    // Update or create each template as its own document
    for (const [templateId, template] of Object.entries(templates)) {
      if (!db) {
        throw new Error('db became null during template save');
      }
      
      // Validate template structure
      if (!template || typeof template !== 'object') {
        console.warn(`Skipping invalid template: ${templateId}`);
        continue;
      }
      
      // Ensure content is a string
      if (typeof template.content !== 'string') {
        console.warn(`Template ${templateId} has invalid content type, converting...`);
        template.content = String(template.content || '');
      }
      
      // Remove undefined values (Firestore doesn't allow undefined)
      // Create a clean object with only defined properties
      const cleanedTemplate: any = {
        name: template.name || '',
        subject: template.subject || '',
        enabled: template.enabled ?? true,
        sendTo: template.sendTo || 'inquirer',
        timing: template.timing || '',
        content: typeof template.content === 'string' ? template.content : '',
      };
      
      // Add optional fields - use empty string for call to action fields to allow clearing them
      cleanedTemplate.callToAction = template.callToAction || '';
      cleanedTemplate.callToActionUrl = template.callToActionUrl || '';
      if (template.attachmentUrl) cleanedTemplate.attachmentUrl = template.attachmentUrl;
      if (template.showDetails !== undefined) cleanedTemplate.showDetails = template.showDetails;
      
      const templateRef = db.collection(COLLECTIONS.EMAIL_TEMPLATES).doc(templateId);
      batch.set(templateRef, cleanedTemplate, { merge: true });
      hasOperations = true;
    }
    
    if (hasOperations) {
      await batch.commit();
      console.log(`Successfully saved ${Object.keys(templates).length} templates to Firebase`);
    } else {
      console.log('No operations to commit');
    }
  } catch (error: any) {
    console.error('Error saving email templates to Firebase:', error);
    console.error('Error details:', error?.message, error?.code, error?.stack);
    throw error;
  }
}

// ============================================================================
// FILE FALLBACK - AUTOMATION SETTINGS
// ============================================================================

const AUTOMATION_SETTINGS_PATH = path.join(DATA_DIR, 'automation-settings.json');

function getAutomationSettingsFromFile(): AutomationSettings | null {
  ensureDataDir();
  if (!fs.existsSync(AUTOMATION_SETTINGS_PATH)) {
    return null;
  }
  try {
    const data = fs.readFileSync(AUTOMATION_SETTINGS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading automation settings:', error);
    return null;
  }
}

function saveAutomationSettingsToFile(settings: AutomationSettings): void {
  ensureDataDir();
  try {
    const tempPath = AUTOMATION_SETTINGS_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(settings, null, 2));
    fs.renameSync(tempPath, AUTOMATION_SETTINGS_PATH);
  } catch (error) {
    console.error('Error saving automation settings:', error);
    throw error;
  }
}

// ============================================================================
// FILE FALLBACK - EMAIL TEMPLATES
// ============================================================================

const EMAIL_TEMPLATES_PATH = path.join(process.cwd(), 'data', 'email-templates.json');

function getEmailTemplatesFromFile(): EmailTemplates | null {
  if (!fs.existsSync(EMAIL_TEMPLATES_PATH)) {
    return null;
  }
  try {
    const data = fs.readFileSync(EMAIL_TEMPLATES_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading email templates:', error);
    return null;
  }
}

function saveEmailTemplatesToFile(templates: EmailTemplates): void {
  try {
    const tempPath = EMAIL_TEMPLATES_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(templates, null, 2));
    fs.renameSync(tempPath, EMAIL_TEMPLATES_PATH);
  } catch (error) {
    console.error('Error saving email templates:', error);
    throw error;
  }
}

// ============================================================================
// PUBLIC API - Routes to Firebase or File based on configuration
// ============================================================================

export function getInquiries(): Inquiry[] | Promise<Inquiry[]> {
  if (USE_FIREBASE) {
    return getInquiriesFromFirebase();
  }
  return getInquiriesFromFile();
}

export function saveInquiry(inquiry: Inquiry): void | Promise<void> {
  if (USE_FIREBASE) {
    return saveInquiryToFirebase(inquiry);
  }
  return saveInquiryToFile(inquiry);
}

export function updateInquiry(id: string, updates: Partial<Inquiry>): void | Promise<void> {
  if (USE_FIREBASE) {
    return updateInquiryInFirebase(id, updates);
  }
  return updateInquiryInFile(id, updates);
}

export function deleteInquiry(id: string): void | Promise<void> {
  if (USE_FIREBASE) {
    return deleteInquiryFromFirebase(id);
  }
  return deleteInquiryFromFile(id);
}

export function getInquiryById(id: string): Inquiry | undefined | Promise<Inquiry | undefined> {
  if (USE_FIREBASE) {
    return getInquiryByIdFromFirebase(id);
  }
  return getInquiryByIdFromFile(id);
}

export async function getInquiryByEmail(email: string): Promise<Inquiry | undefined> {
  if (USE_FIREBASE) {
    if (!db) return undefined;
    try {
      const snapshot = await db.collection(COLLECTIONS.INQUIRIES)
        .where('email', '==', email)
        .limit(1)
        .get();
      if (snapshot.empty) return undefined;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Inquiry;
    } catch (error) {
      console.error('Error finding inquiry by email:', error);
      return undefined;
    }
  } else {
    const inquiries = getInquiriesFromFile();
    return inquiries.find(inq => inq.email.toLowerCase() === email.toLowerCase());
  }
}

export function getEmailLogs(): EmailLog[] | Promise<EmailLog[]> {
  if (USE_FIREBASE) {
    return getEmailLogsFromFirebase();
  }
  return getEmailLogsFromFile();
}

export function saveEmailLog(log: EmailLog): void | Promise<void> {
  if (USE_FIREBASE) {
    return saveEmailLogToFirebase(log);
  }
  return saveEmailLogToFile(log);
}

export function getLogsForInquiry(inquiryId: string): EmailLog[] | Promise<EmailLog[]> {
  if (USE_FIREBASE) {
    return getLogsForInquiryFromFirebase(inquiryId);
  }
  return getLogsForInquiryFromFile(inquiryId);
}

export function getEmailLog(id: string): EmailLog | undefined | Promise<EmailLog | undefined> {
  if (USE_FIREBASE) {
    return getEmailLogByIdFromFirebase(id);
  }
  return getEmailLogByIdFromFile(id);
}

export function getInquiry(id: string): Inquiry | undefined | Promise<Inquiry | undefined> {
  return getInquiryById(id);
}

export function getAutomationSettings(): AutomationSettings | null | Promise<AutomationSettings | null> {
  if (USE_FIREBASE) {
    return getAutomationSettingsFromFirebase();
  }
  return getAutomationSettingsFromFile();
}

export function saveAutomationSettings(settings: AutomationSettings): void | Promise<void> {
  if (USE_FIREBASE) {
    return saveAutomationSettingsToFirebase(settings);
  }
  return saveAutomationSettingsToFile(settings);
}

export function getEmailTemplates(): EmailTemplates | null | Promise<EmailTemplates | null> {
  if (USE_FIREBASE) {
    return getEmailTemplatesFromFirebase();
  }
  return getEmailTemplatesFromFile();
}

export function saveEmailTemplates(templates: EmailTemplates): void | Promise<void> {
  if (USE_FIREBASE) {
    return saveEmailTemplatesToFirebase(templates);
  }
  return saveEmailTemplatesToFile(templates);
}

// ============================================================================
// Scheduled Emails (Firebase only - for delayed email sending)
// ============================================================================

async function saveScheduledEmailToFirebase(email: ScheduledEmail): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');
  try {
    console.log(`💾 Saving scheduled email to Firebase:`, {
      id: email.id,
      recipient: email.recipientEmail,
      template: email.templateKey,
      sendAt: email.sendAt,
      status: email.status,
      collection: COLLECTIONS.SCHEDULED_EMAILS
    });
    
    // Remove undefined values - Firestore doesn't allow them
    const cleanEmail: any = {
      id: email.id,
      inquiryId: email.inquiryId,
      recipientEmail: email.recipientEmail,
      recipientName: email.recipientName,
      templateKey: email.templateKey,
      sendAt: email.sendAt,
      emailData: email.emailData,
      status: email.status,
      createdAt: email.createdAt
    };
    
    // Only add optional fields if they have values
    if (email.attachmentUrl !== undefined) cleanEmail.attachmentUrl = email.attachmentUrl;
    if (email.sentAt !== undefined) cleanEmail.sentAt = email.sentAt;
    if (email.error !== undefined) cleanEmail.error = email.error;
    
    await db.collection(COLLECTIONS.SCHEDULED_EMAILS).doc(email.id).set(cleanEmail);
    console.log(`✅ Successfully saved scheduled email ${email.id} to collection '${COLLECTIONS.SCHEDULED_EMAILS}'`);
    console.log(`   Will send at: ${email.sendAt}`);
  } catch (error) {
    console.error('❌ Error saving scheduled email to Firebase:', error);
    throw error;
  }
}

async function getPendingScheduledEmailsFromFirebase(): Promise<ScheduledEmail[]> {
  if (!db) {
    console.error('❌ Firebase db not initialized');
    return [];
  }
  try {
    const now = new Date().toISOString();
    console.log(`🔍 Querying scheduled emails from collection: ${COLLECTIONS.SCHEDULED_EMAILS}`);
    console.log(`🔍 Query: status='pending'`);
    console.log(`⏰ Current time: ${now}`);
    
    // Query ONLY by status to avoid Firestore composite index requirement
    // Then filter by sendAt in JavaScript
    const snapshot = await db.collection(COLLECTIONS.SCHEDULED_EMAILS)
      .where('status', '==', 'pending')
      .get();
    
    console.log(`📋 Found ${snapshot.docs.length} pending emails total`);
    
    // Log all pending emails for debugging
    if (snapshot.docs.length > 0) {
      console.log('📋 All pending emails:', snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          recipient: data.recipientEmail,
          sendAt: data.sendAt,
          status: data.status,
          template: data.templateKey
        };
      }));
    }
    
    // Filter by sendAt in code (avoids Firestore index requirement)
    const readyEmails = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data 
        } as ScheduledEmail;
      })
      .filter(email => {
        const isReady = email.sendAt <= now;
        if (!isReady) {
          console.log(`⏳ Email ${email.id} not ready yet. sendAt: ${email.sendAt}, now: ${now}`);
        }
        return isReady;
      });
    
    console.log(`✅ Found ${readyEmails.length} emails ready to send (sendAt <= now)`);
    
    if (readyEmails.length > 0) {
      console.log('📧 Ready emails:', readyEmails.map(e => ({
        id: e.id,
        recipient: e.recipientEmail,
        sendAt: e.sendAt,
        template: e.templateKey
      })));
    }
    
    return readyEmails;
  } catch (error: any) {
    console.error('❌ Error fetching scheduled emails from Firebase:', error);
    // If it's an index error, provide helpful message
    if (error.code === 9 && error.details?.includes('index')) {
      console.error('💡 Firestore index error - make sure query only uses status field');
    }
    return [];
  }
}

async function updateScheduledEmailStatusInFirebase(id: string, status: 'sent' | 'failed', error?: string): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');
  try {
    const updates: any = {
      status,
      sentAt: new Date().toISOString()
    };
    if (error) updates.error = error;
    await db.collection(COLLECTIONS.SCHEDULED_EMAILS).doc(id).update(updates);
  } catch (error) {
    console.error('Error updating scheduled email status:', error);
    throw error;
  }
}

export function saveScheduledEmail(email: ScheduledEmail): Promise<void> | void {
  if (USE_FIREBASE) {
    return saveScheduledEmailToFirebase(email);
  }
  // No fallback for scheduled emails - they require Firebase
  console.warn('Scheduled emails require Firebase - email will not be queued');
}

export function getPendingScheduledEmails(): Promise<ScheduledEmail[]> | ScheduledEmail[] {
  if (USE_FIREBASE) {
    return getPendingScheduledEmailsFromFirebase();
  }
  return [];
}

export function updateScheduledEmailStatus(id: string, status: 'sent' | 'failed', error?: string): Promise<void> | void {
  if (USE_FIREBASE) {
    return updateScheduledEmailStatusInFirebase(id, status, error);
  }
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Log which storage method is being used
if (USE_FIREBASE) {
  console.log('✅ Using Firebase Firestore for data storage');
} else {
  console.log('⚠️ Firebase not configured - using local JSON files (data will be lost on deployment)');
}
