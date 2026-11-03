import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  CalendarClock,
  ClipboardList,
  CheckCircle2,
  Plus,
  ChevronRight,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TasksContext';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import {
  EmptyState,
  LoadingOverlay,
} from '@/components/ui/index';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { CreateTaskDTO, Task } from '@/types';
import { daysUntil } from '@/components/ui/TaskBadges';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { tasks, loading, reload, addTask, toggleComplete } = useTasks();
  const [refreshing, setRefreshing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const stats = useMemo(() => {
    const pending = tasks.filter((t) => t.status === 'belum');
    const completed = tasks.filter((t) => t.status === 'selesai');
    const overdue = pending.filter((t) => daysUntil(t.deadline) < 0);
    return { pending, completed, overdue };
  }, [tasks]);

  const upcoming = useMemo(() => {
    return [...stats.pending]
      .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
      .slice(0, 4);
  }, [stats.pending]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  const firstName = user?.name.split(' ')[0] ?? 'Pengguna';

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary[600]]}
            tintColor={Colors.primary[600]}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingLabel}>Selamat datang,</Text>
            <Text style={styles.greetingName}>{firstName}!</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon={<ClipboardList size={20} color={Colors.primary[600]} />}
            value={stats.pending.length}
            label="Tertunda"
            bg={Colors.primary[50]}
          />
          <StatCard
            icon={<CalendarClock size={20} color={Colors.warning[600]} />}
            value={stats.overdue.length}
            label="Terlambat"
            bg={Colors.warning[50]}
          />
          <StatCard
            icon={<CheckCircle2 size={20} color={Colors.success[500]} />}
            value={stats.completed.length}
            label="Selesai"
            bg="#F0FDF4"
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tenggat Terdekat</Text>
          <Text
            style={styles.seeAll}
            onPress={() => router.push('/(tabs)/tasks')}
          >
            Lihat semua
          </Text>
        </View>

        {upcoming.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={40} color={Colors.neutral[300]} />}
            title="Belum ada tugas"
            subtitle="Tambahkan tugas untuk mulai mengelola tugas kuliahmu."
          />
        ) : (
          upcoming.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => toggleComplete(task)}
              onEdit={() => router.push('/(tabs)/tasks')}
              onDelete={() => router.push('/(tabs)/tasks')}
            />
          ))
        )}

        <View style={styles.historyLink}>
          <Text
            style={styles.historyLinkText}
            onPress={() => router.push('/(tabs)/tasks')}
          >
            Lihat Riwayat Tugas
          </Text>
          <ChevronRight size={18} color={Colors.primary[600]} />
        </View>
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => {
          setEditingTask(null);
          setFormVisible(true);
        }}
      >
        <Plus size={26} color="#fff" strokeWidth={2.5} />
      </Pressable>

      <TaskForm
        visible={formVisible}
        initialTask={editingTask}
        onClose={() => setFormVisible(false)}
        onSubmit={async (dto: CreateTaskDTO) => addTask(dto)}
      />
      <LoadingOverlay visible={loading && tasks.length === 0} message="Memuat..." />
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  bg: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.neutral[50] },
  container: {
    padding: Spacing.lg,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greetingLabel: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  greetingName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral[600],
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  seeAll: {
    fontSize: 13,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.primary[50],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.primary[100],
  },
  historyLinkText: {
    color: Colors.primary[700],
    fontWeight: '600',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg + 70,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
