import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCOUNTS_KEY = 'taskmate:accounts';
const TASKS_KEY = 'taskmate:tasks';
const SESSION_KEY = 'taskmate:session';

// Wrapper tipis di sekitar AsyncStorage dengan error handling
// sehingga pemanggil tidak perlu try/catch di setiap tempat.

export async function loadJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function saveJSON(key: string, value: unknown): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // diabaikan
  }
}

export const StorageKeys = {
  ACCOUNTS_KEY,
  TASKS_KEY,
  SESSION_KEY,
} as const;

// ===== Accounts =====

import type { Account } from '@/types';

export async function getAccounts(): Promise<Account[]> {
  return (await loadJSON<Account[]>(ACCOUNTS_KEY)) ?? [];
}

export async function saveAccounts(accounts: Account[]): Promise<boolean> {
  return saveJSON(ACCOUNTS_KEY, accounts);
}

// ===== Tasks =====

import type { Task } from '@/types';

export async function getStoredTasks(): Promise<Task[]> {
  return (await loadJSON<Task[]>(TASKS_KEY)) ?? [];
}

export async function saveStoredTasks(tasks: Task[]): Promise<boolean> {
  return saveJSON(TASKS_KEY, tasks);
}

// ===== Session =====

import type { AuthSession } from '@/types';

export async function getSession(): Promise<AuthSession | null> {
  return await loadJSON<AuthSession>(SESSION_KEY);
}

export async function saveSession(session: AuthSession): Promise<boolean> {
  return saveJSON(SESSION_KEY, session);
}

export async function clearSession(): Promise<void> {
  await removeKey(SESSION_KEY);
}
