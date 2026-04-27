import fs from 'fs/promises';
import path from 'path';
import { Member, Payment, Settings } from '@/types';
import { INITIAL_MEMBERS, INITIAL_PAYMENTS, INITIAL_SETTINGS } from './initial-data';

// Use /tmp on Vercel, else local data directory
const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel ? '/tmp/data' : path.join(process.cwd(), 'data');

const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore error if directory already exists
  }
}

export async function readJson<T>(filePath: string, defaultData: T): Promise<T> {
  await ensureDir();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await writeJson(filePath, defaultData);
      return defaultData;
    }
    throw error;
  }
}

export async function writeJson(filePath: string, data: any): Promise<void> {
  await ensureDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getMembers(): Promise<Member[]> {
  return readJson<Member[]>(MEMBERS_FILE, INITIAL_MEMBERS);
}

export async function saveMembers(members: Member[]): Promise<void> {
  await writeJson(MEMBERS_FILE, members);
}

export async function getPayments(): Promise<Payment[]> {
  return readJson<Payment[]>(PAYMENTS_FILE, INITIAL_PAYMENTS);
}

export async function savePayments(payments: Promise<Payment[]> | Payment[]): Promise<void> {
  await writeJson(PAYMENTS_FILE, payments);
}

export async function getSettings(): Promise<Settings> {
  return readJson<Settings>(SETTINGS_FILE, INITIAL_SETTINGS);
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJson(SETTINGS_FILE, settings);
}

export async function generateMemberId(): Promise<string> {
  const members = await getMembers();
  if (members.length === 0) return 'MB001';
  
  const ids = members.map(m => parseInt(m.id.replace('MB', ''))).filter(n => !isNaN(n));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  
  return `MB${String(maxId + 1).padStart(3, '0')}`;
}

export async function generatePaymentId(): Promise<string> {
  const payments = await getPayments();
  if (payments.length === 0) return 'PAY001';
  
  const ids = payments.map(p => parseInt(p.id.replace('PAY', ''))).filter(n => !isNaN(n));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  
  return `PAY${String(maxId + 1).padStart(3, '0')}`;
}
