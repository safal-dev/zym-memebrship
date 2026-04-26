import fs from 'fs/promises';
import path from 'path';
import { Member, Payment, Settings } from '@/types';

// Use /tmp on Vercel, else local data directory
const isVercel = process.env.VERCEL === '1';
const BUNDLED_DATA_DIR = path.join(process.cwd(), 'data');
const DATA_DIR = isVercel ? '/tmp/data' : BUNDLED_DATA_DIR;

const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

const DEFAULT_SETTINGS: Settings = {
  gymName: 'FitZone Gym',
  gymLogo: '',
  currency: 'NPR',
  defaultPlans: [
    { name: 'Monthly', months: 1, price: 3000 },
    { name: '3 Months', months: 3, price: 8000 },
    { name: '6 Months', months: 6, price: 15000 },
    { name: 'Yearly', months: 12, price: 28000 },
  ],
};

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore error if directory already exists
  }
}

async function getInitialData<T>(fileName: string, defaultData: T): Promise<T> {
  if (!isVercel) return defaultData;

  // On Vercel, try to read from the bundled data directory first
  try {
    const bundledPath = path.join(BUNDLED_DATA_DIR, fileName);
    const data = await fs.readFile(bundledPath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    return defaultData;
  }
}

export async function readJson<T>(filePath: string, fileName: string, defaultData: T): Promise<T> {
  await ensureDir();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const initialData = await getInitialData(fileName, defaultData);
      await writeJson(filePath, initialData);
      return initialData;
    }
    throw error;
  }
}

export async function writeJson(filePath: string, data: any): Promise<void> {
  await ensureDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getMembers(): Promise<Member[]> {
  return readJson<Member[]>(MEMBERS_FILE, 'members.json', []);
}

export async function saveMembers(members: Member[]): Promise<void> {
  await writeJson(MEMBERS_FILE, members);
}

export async function getPayments(): Promise<Payment[]> {
  return readJson<Payment[]>(PAYMENTS_FILE, 'payments.json', []);
}

export async function savePayments(payments: Promise<Payment[]> | Payment[]): Promise<void> {
  await writeJson(PAYMENTS_FILE, payments);
}

export async function getSettings(): Promise<Settings> {
  return readJson<Settings>(SETTINGS_FILE, 'settings.json', DEFAULT_SETTINGS);
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJson(SETTINGS_FILE, settings);
}

export async function generateMemberId(): Promise<string> {
  const members = await getMembers();
  if (members.length === 0) return 'MB001';
  
  // Extract number from highest ID
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
