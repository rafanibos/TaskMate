import { StyleSheet, Text, View } from 'react-native';
import type { Priority, Task, TaskStatus } from '@/types';
import { Colors, Radius, Spacing } from '@/constants/theme';

// Helper tanggal mengembalikan string sederhana dan juga info "terlambat".

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function daysUntil(iso: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(task: Task): boolean {
  if (task.status === 'selesai') return false;
  return daysUntil(task.deadline) < 0;
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  rendah: 'Rendah',
  sedang: 'Sedang',
  tinggi: 'Tinggi',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  rendah: Colors.neutral[400],
  sedang: Colors.warning[500],
  tinggi: Colors.error[500],
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  belum: 'Belum Selesai',
  selesai: 'Selesai',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const color = PRIORITY_COLORS[priority];
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.badgeText, { color }]}>{PRIORITY_LABELS[priority]}</Text>
    </View>
  );
}

export function DeadlineText({ deadline, status }: { deadline: string; status: TaskStatus }) {
  if (status === 'selesai') {
    return <Text style={styles.deadlineDone}>Selesai</Text>;
  }
  const d = daysUntil(deadline);
  let label: string;
  let color: string;
  if (d < 0) {
    label = `Terlambat ${Math.abs(d)} hari`;
    color = Colors.error[600];
  } else if (d === 0) {
    label = 'Hari ini';
    color = Colors.warning[600];
  } else if (d === 1) {
    label = 'Besok';
    color = Colors.warning[600];
  } else {
    label = `${d} hari lagi`;
    color = Colors.neutral[600];
  }
  return (
    <Text style={[styles.deadlineText, { color }]}>
      {label} • {formatDate(deadline)}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    gap: 5,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deadlineDone: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success[600],
  },
});
