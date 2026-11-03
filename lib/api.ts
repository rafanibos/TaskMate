import axios from 'axios';
import type {
  ApiResponse,
  AuthSession,
  Account,
  CreateTaskDTO,
  LoginDTO,
  RegisterDTO,
  Task,
  UpdateTaskDTO,
  User,
} from '@/types';
import {
  getAccounts,
  getStoredTasks,
  saveAccounts,
  saveStoredTasks,
} from '@/lib/storage';
import {
  generateId,
  generateToken,
  hashPassword,
  verifyPassword,
} from '@/lib/crypto';

// Karena tidak ada backend nyata, kita membuat mock API service
// yang berperilaku seperti REST API berbasis axios. Service ini
// mensimulasikan latensi jaringan, kode status HTTP, timeout, dan
// autentikasi bearer token — sesuai modul 3, 4, 5, dan 6.

const api = axios.create({
  baseURL: 'https://mock.taskmate.local/api',
  timeout: 8000,
});

// Helper: jeda untuk mensimulasikan waktu respons jaringan.
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ok<T>(data: T, statusCode = 200): ApiResponse<T> {
  return { success: true, data, statusCode };
}

function fail(error: string, statusCode: number): ApiResponse<never> {
  return { success: false, error, statusCode };
}

function toPublicUser(account: Account): User {
  return { id: account.id, name: account.name, email: account.email };
}

// ===== Auth =====

export async function registerUser(
  dto: RegisterDTO,
): Promise<ApiResponse<AuthSession>> {
  try {
    await delay(400);
    const accounts = await getAccounts();
    const exists = accounts.some(
      (a) => a.email.toLowerCase() === dto.email.toLowerCase(),
    );
    if (exists) {
      return fail('Email sudah terdaftar', 409);
    }
    const account: Account = {
      id: generateId(),
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      passwordHash: hashPassword(dto.password),
    };
    accounts.push(account);
    await saveAccounts(accounts);
    const session: AuthSession = {
      token: generateToken(),
      user: toPublicUser(account),
    };
    return ok(session, 201);
  } catch (err) {
    return fail('Gagal mendaftar. Periksa koneksi Anda.', 500);
  }
}

export async function loginUser(
  dto: LoginDTO,
): Promise<ApiResponse<AuthSession>> {
  try {
    await delay(400);
    const accounts = await getAccounts();
    const account = accounts.find(
      (a) => a.email.toLowerCase() === dto.email.trim().toLowerCase(),
    );
    if (!account || !verifyPassword(dto.password, account.passwordHash)) {
      return fail('Email atau kata sandi salah', 401);
    }
    const session: AuthSession = {
      token: generateToken(),
      user: toPublicUser(account),
    };
    return ok(session, 200);
  } catch (err) {
    return fail('Gagal masuk. Periksa koneksi Anda.', 500);
  }
}

// ===== Tasks (memerlukan token) =====

export async function fetchTasks(
  token: string,
): Promise<ApiResponse<Task[]>> {
  try {
    await delay(300);
    // Validasi token (di sini token selalu valid karena dihasilkan lokal)
    if (!token) return fail('Tidak terautentikasi', 401);
    const tasks = await getStoredTasks();
    return ok(tasks, 200);
  } catch {
    return fail('Gagal memuat tugas', 500);
  }
}

export async function createTask(
  token: string,
  userId: string,
  dto: CreateTaskDTO,
): Promise<ApiResponse<Task>> {
  try {
    await delay(300);
    if (!token) return fail('Tidak terautentikasi', 401);
    const tasks = await getStoredTasks();
    const task: Task = {
      id: generateId(),
      userId,
      title: dto.title.trim(),
      description: dto.description.trim(),
      deadline: dto.deadline,
      priority: dto.priority,
      status: 'belum',
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    await saveStoredTasks(tasks);
    return ok(task, 201);
  } catch {
    return fail('Gagal membuat tugas', 500);
  }
}

export async function updateTask(
  token: string,
  dto: UpdateTaskDTO,
): Promise<ApiResponse<Task>> {
  try {
    await delay(300);
    if (!token) return fail('Tidak terautentikasi', 401);
    const tasks = await getStoredTasks();
    const idx = tasks.findIndex((t) => t.id === dto.id);
    if (idx === -1) return fail('Tugas tidak ditemukan', 404);
    tasks[idx] = {
      ...tasks[idx],
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
      ...(dto.deadline !== undefined ? { deadline: dto.deadline } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    };
    await saveStoredTasks(tasks);
    return ok(tasks[idx], 200);
  } catch {
    return fail('Gagal memperbarui tugas', 500);
  }
}

export async function deleteTask(
  token: string,
  taskId: string,
): Promise<ApiResponse<{ id: string }>> {
  try {
    await delay(300);
    if (!token) return fail('Tidak terautentikasi', 401);
    const tasks = await getStoredTasks();
    const filtered = tasks.filter((t) => t.id !== taskId);
    await saveStoredTasks(filtered);
    return ok({ id: taskId }, 200);
  } catch {
    return fail('Gagal menghapus tugas', 500);
  }
}

// Helper untuk komponen UI: retry dengan exponential backoff sederhana.
export async function withRetry<T>(
  fn: () => Promise<ApiResponse<T>>,
  retries = 2,
): Promise<ApiResponse<T>> {
  let last: ApiResponse<T>;
  for (let attempt = 0; attempt <= retries; attempt++) {
    last = await fn();
    if (last.success) return last;
    // Hanya retry untuk error server/transient (5xx), bukan error klien (4xx).
    if (last.statusCode < 500) return last;
    if (attempt < retries) {
      await delay(500 * Math.pow(2, attempt));
    }
  }
  return last!;
}

export { api };
