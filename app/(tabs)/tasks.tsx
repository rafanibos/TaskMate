import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { Plus } from 'lucide-react-native';
import { useTasks } from '@/contexts/TasksContext';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import {
  ConfirmDialog,
  EmptyState,
  LoadingOverlay,
} from '@/components/ui/index';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { CreateTaskDTO, Task, TaskFilter } from '@/types';

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'semua', label: 'Semua' },
  { value: 'belum', label: 'Belum' },
  { value: 'selesai', label: 'Riwayat' },
];

export default function TasksScreen() {
  const { tasks, loading, reload, addTask, editTask, removeTask, toggleComplete } =
    useTasks();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>('semua');
  const [formVisible, setFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    const list =
      filter === 'semua'
        ? tasks
        : filter === 'belum'
          ? tasks.filter((t) => t.status === 'belum')
          : tasks.filter((t) => t.status === 'selesai');
    return [...list].sort((a, b) => {
      // Tugas tertunda diurutkan berdasarkan tenggat, riwayat berdasarkan judul.
      if (filter === 'selesai') return a.title.localeCompare(b.title);
      const aDays = new Date(a.deadline).getTime();
      const bDays = new Date(b.deadline).getTime();
      return aDays - bDays;
    });
  }, [tasks, filter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormVisible(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setFormVisible(true);
  };

  const handleSubmit = async (dto: CreateTaskDTO) => {
    if (editingTask) {
      return editTask({
        id: editingTask.id,
        title: dto.title,
        description: dto.description,
        deadline: dto.deadline,
        priority: dto.priority,
      });
    }
    return addTask(dto);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      const err = await removeTask(deleteTarget.id);
      if (err) {
        Alert.alert('Gagal', err);
      }
    }
    setDeleteTarget(null);
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.title}>Tugas Saya</Text>
        <Text style={styles.subtitle}>
          {tasks.length} tugas • {tasks.filter((t) => t.status === 'belum').length} tertunda
        </Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => setFilter(f.value)}
            style={[styles.filterChip, filter === f.value && styles.filterChipActive]}
          >
            <Text
              style={[
                styles.filterLabel,
                filter === f.value && styles.filterLabelActive,
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary[600]]}
            tintColor={Colors.primary[600]}
          />
        }
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              icon={
                <View style={[styles.emptyIcon, { backgroundColor: Colors.primary[50] }]}>
                  <Plus size={32} color={Colors.primary[400]} />
                </View>
              }
              title={
                filter === 'selesai'
                  ? 'Belum ada riwayat'
                  : 'Belum ada tugas'
              }
              subtitle={
                filter === 'selesai'
                  ? 'Tugas yang selesai akan muncul di sini.'
                  : 'Ketuk tombol tambah untuk membuat tugas baru.'
              }
            />
          )
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onComplete={() => toggleComplete(item)}
            onEdit={() => handleEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Pressable style={styles.fab} onPress={handleAdd}>
        <Plus size={26} color="#fff" strokeWidth={2.5} />
      </Pressable>

      <TaskForm
        visible={formVisible}
        initialTask={editingTask}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Hapus Tugas"
        message={`Yakin ingin menghapus "${deleteTarget?.title}"? Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <LoadingOverlay visible={loading && tasks.length === 0} message="Memuat..." />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.neutral[50] },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg + 6,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  subtitle: {
    fontSize: 13,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.pill,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  filterChipActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.neutral[600],
  },
  filterLabelActive: {
    color: '#fff',
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 110,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
