import * as SecureStore from 'expo-secure-store';

// Token autentikasi disimpan di Expo SecureStore (penyimpanan aman perangkat).
// Token sensitif tidak boleh disimpan di AsyncStorage biasa.
const TOKEN_KEY = 'taskmate_token';

export async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  } catch {
    // fallback ke keyring tidak aman? Tetap pertahankan token di SecureStore.
  }
}

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // diabaikan
  }
}
