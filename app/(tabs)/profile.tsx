import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Mail,
  LogOut,
  CheckCircle2,
  ClipboardList,
  Camera,
  ShieldCheck,
  Info,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TasksContext';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/index';
import { useState } from 'react';
import { Colors, Radius, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const pending = tasks.filter((t) => t.status === 'belum').length;
  const completed = tasks.filter((t) => t.status === 'selesai').length;

  const handleLogout = async () => {
    setConfirmLogout(false);
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ringkasan</Text>
        <SummaryRow
          icon={<ClipboardList size={18} color={Colors.primary[600]} />}
          label="Tugas Tertunda"
          value={`${pending}`}
        />
        <SummaryRow
          icon={<CheckCircle2 size={18} color={Colors.success[500]} />}
          label="Tugas Selesai"
          value={`${completed}`}
        />
        <SummaryRow
          icon={<Camera size={18} color={Colors.accent[500]} />}
          label="Sensor Digunakan"
          value="Kamera"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Keamanan</Text>
        <InfoRow
          icon={<ShieldCheck size={18} color={Colors.success[500]} />}
          label="Token Aman"
          value="SecureStore"
        />
        <InfoRow
          icon={<Info size={18} color={Colors.neutral[400]} />}
          label="Penyimpanan Lokal"
          value="AsyncStorage"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tentang</Text>
        <InfoRow
          icon={<Info size={18} color={Colors.neutral[400]} />}
          label="Aplikasi"
          value="TaskMate"
        />
        <InfoRow
          icon={<Info size={18} color={Colors.neutral[400]} />}
          label="Versi"
          value="1.0.0"
        />
      </View>

      <Button
        label="Keluar"
        variant="danger"
        onPress={() => setConfirmLogout(true)}
        icon={<LogOut size={18} color={Colors.error[600]} />}
        style={styles.logoutBtn}
      />

      <ConfirmDialog
        visible={confirmLogout}
        title="Keluar dari Akun"
        message="Sesi akan diakhiri dan Anda kembali ke layar masuk. Lanjutkan?"
        confirmLabel="Keluar"
        cancelLabel="Batal"
        danger
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </ScrollView>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.neutral[50] },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.lg + 80,
    gap: Spacing.md,
  },
  profileCard: {
    backgroundColor: Colors.primary[600],
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 4,
    shadowColor: Colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.neutral[500],
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rowLabel: {
    fontSize: 15,
    color: Colors.neutral[800],
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[500],
  },
  logoutBtn: {
    marginTop: Spacing.sm,
  },
});
