import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthSession, LoginDTO, RegisterDTO, User } from '@/types';
import { loginUser, registerUser, withRetry } from '@/lib/api';
import { clearSession, getSession, saveSession } from '@/lib/storage';
import { clearToken, getToken, saveToken } from '@/lib/secureToken';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  initializing: boolean;
  login: (dto: LoginDTO) => Promise<string | null>;
  register: (dto: RegisterDTO) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Muat sesi tersimpan saat aplikasi dimulai.
  useEffect(() => {
    (async () => {
      const stored = await getSession();
      const storedToken = await getToken();
      if (stored && storedToken) {
        setUser(stored.user);
        setToken(storedToken);
      } else {
        // Pastikan tidak ada sisa data lama.
        await clearSession();
        await clearToken();
      }
      setInitializing(false);
    })();
  }, []);

  const login = useCallback(async (dto: LoginDTO): Promise<string | null> => {
    const res = await withRetry(() => loginUser(dto));
    if (res.success && res.data) {
      setUser(res.data.user);
      setToken(res.data.token);
      await saveSession(res.data);
      await saveToken(res.data.token);
      return null;
    }
    return res.error ?? 'Gagal masuk';
  }, []);

  const register = useCallback(
    async (dto: RegisterDTO): Promise<string | null> => {
      const res = await withRetry(() => registerUser(dto));
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        await saveSession(res.data);
        await saveToken(res.data.token);
        return null;
      }
      return res.error ?? 'Gagal mendaftar';
    },
    [],
  );

  const logout = useCallback(async () => {
    await clearSession();
    await clearToken();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, initializing, login, register, logout }),
    [user, token, initializing, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
