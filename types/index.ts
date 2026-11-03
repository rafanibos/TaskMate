// ===== Data Transfer Objects (DTOs) =====

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
}

export interface UpdateTaskDTO {
  id: string;
  title?: string;
  description?: string;
  deadline?: string;
  priority?: Priority;
  status?: TaskStatus;
}

// ===== Domain Models =====

export type Priority = 'rendah' | 'sedang' | 'tinggi';

export type TaskStatus = 'belum' | 'selesai';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Account extends User {
  // Password disimpan dalam bentuk hash sederhana, bukan plain text.
  passwordHash: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  deadline: string; // ISO string
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export type TaskFilter = 'semua' | 'belum' | 'selesai';

// ===== API Response Wrappers =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}
