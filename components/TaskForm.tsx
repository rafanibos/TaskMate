import { Modal, ScrollView, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react-native';
import type { CreateTaskDTO, Priority, Task } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors, Radius, Spacing } from '@/constants/theme';
import {
  validateDeadline,
  validateTaskTitle,
} from '@/lib/validation';

interface TaskFormProps {
  visible: boolean;
  initialTask?: Task | null;
  onClose: () => void;
  onSubmit: (data: CreateTaskDTO) => Promise<string | null>;
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'rendah', label: 'Rendah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'tinggi', label: 'Tinggi' },
];

function toDateInputValue(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  if (isNaN(d.getTime())) d.setTime(Date.now());
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function TaskForm({
  visible,
  initialTask,
  onClose,
  onSubmit,
}: TaskFormProps) {
  const editing = !!initialTask;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(toDateInputValue());
  const [priority, setPriority] = useState<Priority>('sedang');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(initialTask?.title ?? '');
      setDescription(initialTask?.description ?? '');
      setDeadline(toDateInputValue(initialTask?.deadline));
      setPriority(initialTask?.priority ?? 'sedang');
      setErrors({});
    }
  }, [visible, initialTask]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    const titleErr = validateTaskTitle(title);
    if (titleErr) newErrors.title = titleErr;
    const deadlineErr = validateDeadline(deadline);
    if (deadlineErr) newErrors.deadline = deadlineErr;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    const err = await onSubmit({
      title,
      description,
      deadline: new Date(deadline).toISOString(),
      priority,
    });
    setSubmitting(false);
    if (!err) onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {editing ? 'Ubah Tugas' : 'Tambah Tugas'}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <X size={22} color={Colors.neutral[600]} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
            <Input
              label="Judul Tugas"
              value={title}
              onChangeText={setTitle}
              placeholder="Contoh: Tugas Matematika Bab 5"
              error={errors.title}
            />

            <Input
              label="Deskripsi"
              value={description}
              onChangeText={setDescription}
              placeholder="Detail tugas..."
              multiline
              numberOfLines={3}
              style={styles.textarea}
            />

            <Text style={styles.label}>Tenggat Waktu</Text>
            <View style={styles.dateRow}>
              <TextInput
                style={styles.dateInput}
                value={deadline}
                onChangeText={setDeadline}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <Text style={styles.helperText}>Format: YYYY-MM-DD</Text>
            {errors.deadline ? (
              <Text style={styles.errorText}>{errors.deadline}</Text>
            ) : null}

            <Text style={styles.label}>Prioritas</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => (
                <Pressable
                  key={p.value}
                  onPress={() => setPriority(p.value)}
                  style={[
                    styles.priorityBtn,
                    priority === p.value && styles.priorityBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityLabel,
                      priority === p.value && styles.priorityLabelActive,
                    ]}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.actions}>
              <Button label="Batal" variant="ghost" onPress={onClose} style={styles.flex1} />
              <Button
                label={editing ? 'Simpan' : 'Tambah'}
                loading={submitting}
                onPress={handleSubmit}
                style={styles.flex1}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: Spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: 6,
    marginTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.neutral[900],
    backgroundColor: '#fff',
    minHeight: 48,
  },
  helperText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.neutral[500],
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.error[600],
  },
  priorityRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  priorityBtnActive: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[600],
  },
  priorityLabelActive: {
    color: Colors.primary[700],
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  flex1: {
    flex: 1,
  },
});
