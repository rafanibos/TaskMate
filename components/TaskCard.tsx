import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Check, Pencil, Trash2 } from 'lucide-react-native';
import type { Task } from '@/types';
import { Colors, Radius, Spacing } from '@/constants/theme';
import {
  DeadlineText,
  PriorityBadge,
  isOverdue,
} from '@/components/ui/TaskBadges';

interface TaskCardProps {
  task: Task;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const done = task.status === 'selesai';
  const overdue = isOverdue(task);

  return (
    <View style={[styles.card, done && styles.cardDone]}>
      <View style={styles.row}>
        <Pressable
          onPress={onComplete}
          style={[styles.checkbox, done && styles.checkboxDone]}
          accessibilityLabel={
            done ? 'Tandai belum selesai' : 'Tandai selesai'
          }
          hitSlop={8}
        >
          {done ? <Check size={18} color="#fff" strokeWidth={3} /> : null}
        </Pressable>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.title, done && styles.titleDone]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            {overdue ? (
              <View style={styles.overdueTag}>
                <Text style={styles.overdueText}>Terlambat</Text>
              </View>
            ) : null}
          </View>
          {task.description ? (
            <Text style={styles.desc} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            <PriorityBadge priority={task.priority} />
            <DeadlineText deadline={task.deadline} status={task.status} />
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={onEdit} hitSlop={10}>
          <Pencil size={16} color={Colors.primary[600]} />
          <Text style={styles.actionEdit}>Ubah</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={onDelete} hitSlop={10}>
          <Trash2 size={16} color={Colors.error[500]} />
          <Text style={styles.actionDelete}>Hapus</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardDone: {
    opacity: 0.65,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxDone: {
    backgroundColor: Colors.success[500],
    borderColor: Colors.success[500],
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.neutral[900],
    lineHeight: 21,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: Colors.neutral[500],
  },
  desc: {
    fontSize: 13,
    color: Colors.neutral[500],
    marginTop: 3,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  overdueTag: {
    backgroundColor: Colors.error[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  overdueText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.error[600],
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionEdit: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  actionDelete: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.error[500],
  },
});
