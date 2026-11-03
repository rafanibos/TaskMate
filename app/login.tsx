import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { CheckCircle2, GraduationCap } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { validateEmail, validatePassword } from '@/lib/validation';
import type { LoginDTO } from '@/types';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setFormError(null);
    const newErrors: Record<string, string> = {};
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    const passErr = validatePassword(password);
    if (passErr) newErrors.password = passErr;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const dto: LoginDTO = { email, password };
    const err = await login(dto);
    setLoading(false);
    if (err) {
      setFormError(err);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <View style={styles.logo}>
            <GraduationCap size={36} color="#fff" strokeWidth={2} />
          </View>
          <Text style={styles.heroTitle}>TaskMate</Text>
          <Text style={styles.heroSubtitle}>Kelola tugas kuliahmu dengan mudah</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Masuk</Text>
          <Text style={styles.formDesc}>Selamat datang kembali! Silakan masuk.</Text>

          {formError ? (
            <View style={styles.formErrorBox}>
              <Text style={styles.formErrorText}>{formError}</Text>
            </View>
          ) : null}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="nama@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />
          <Input
            label="Kata Sandi"
            value={password}
            onChangeText={setPassword}
            placeholder="Minimal 6 karakter"
            secureTextEntry
            autoComplete="password"
            error={errors.password}
          />

          <Button label="Masuk" loading={loading} onPress={handleLogin} />
        </View>

        <Text style={styles.footer}>
          Belum punya akun?{'  '}
          <Text
            style={styles.footerLink}
            onPress={() => router.push('/register')}
          >
            Daftar di sini
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.neutral[50] },
  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary[600],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  formDesc: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  formErrorBox: {
    backgroundColor: Colors.error[50],
    borderWidth: 1,
    borderColor: Colors.error[200],
    borderRadius: Radius.md,
    padding: Spacing.sm + 2,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  formErrorText: {
    color: Colors.error[600],
    fontSize: 13,
    flex: 1,
  },
  footer: {
    textAlign: 'center',
    marginTop: Spacing.lg,
    fontSize: 14,
    color: Colors.neutral[600],
  },
  footerLink: {
    color: Colors.primary[600],
    fontWeight: '600',
  },
});
