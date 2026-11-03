import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CreateTaskDTO, Task, UpdateTaskDTO } from '@/types';
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  withRetry,
} from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  addTask: (dto: CreateTaskDTO) => Promise<string | null>;
  editTask: (dto: UpdateTaskDTO) => Promise<string | null>;
  removeTask: (id: string) => Promise<string | null>;
  toggleComplete: (task: Task) => Promise<string | null>;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!token || !user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const res = await withRetry(() => fetchTasks(token));
    if (res.success && res.data) {
      // Hanya tampilkan tugas milik user yang sedang login.
      setTasks(res.data.filter((t) => t.userId === user.id));
    } else {
      setError(res.error ?? 'Gagal memuat tugas');
    }
    setLoading(false);
  }, [token, user]);

  useEffect(() => {
    if (token && user) {
      void reload();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [token, user, reload]);

  const addTask = useCallback(
    async (dto: CreateTaskDTO): Promise<string | null> => {
      if (!token || !user) return 'Belum masuk';
      const res = await withRetry(() => createTask(token, user.id, dto));
      if (res.success && res.data) {
        setTasks((prev) => [...prev, res.data!]);
        return null;
      }
      return res.error ?? 'Gagal membuat tugas';
    },
    [token, user],
  );

  const editTask = useCallback(
    async (dto: UpdateTaskDTO): Promise<string | null> => {
      if (!token) return 'Belum masuk';
      const res = await withRetry(() => updateTask(token, dto));
      if (res.success && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === res.data!.id ? res.data! : t)),
        );
        return null;
      }
      return res.error ?? 'Gagal memperbarui tugas';
    },
    [token],
  );

  const removeTask = useCallback(
    async (id: string): Promise<string | null> => {
      if (!token) return 'Belum masuk';
      const res = await withRetry(() => deleteTask(token, id));
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        return null;
      }
      return res.error ?? 'Gagal menghapus tugas';
    },
    [token],
  );

  const toggleComplete = useCallback(
    async (task: Task): Promise<string | null> => {
      const newStatus = task.status === 'selesai' ? 'belum' : 'selesai';
      return editTask({ id: task.id, status: newStatus });
    },
    [editTask],
  );

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      loading,
      error,
      reload,
      addTask,
      editTask,
      removeTask,
      toggleComplete,
    }),
    [tasks, loading, error, reload, addTask, editTask, removeTask, toggleComplete],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks harus dipakai di dalam TasksProvider');
  return ctx;
}
