import { Modal, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { ReactNode } from 'react';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface CardProps {
  children: ReactNode;
  style?: object;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function EmptyState({ title, subtitle, icon }: EmptyStateProps) {
  return (
    <View style={styles.empty}>
      {icon}
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={styles.overlayBox}>
          <ActivityIndicator size="large" color={Colors.primary[600]} />
          {message ? <Text style={styles.overlayText}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialogBox} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.dialogMessage}>{message}</Text>
          <View style={styles.dialogActions}>
            <Pressable
              style={[styles.dialogBtn, styles.dialogCancel]}
              onPress={onCancel}
            >
              <Text style={styles.dialogCancelLabel}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              style={[
                styles.dialogBtn,
                danger ? styles.dialogDanger : styles.dialogConfirm,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.dialogConfirmLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[600],
    marginTop: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.neutral[500],
    marginTop: 4,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBox: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    minWidth: 140,
  },
  overlayText: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  dialogBox: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    width: '85%',
    maxWidth: 340,
  },
  dialogTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 6,
  },
  dialogMessage: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 21,
    marginBottom: Spacing.md,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
  },
  dialogBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  dialogCancel: {
    backgroundColor: Colors.neutral[100],
  },
  dialogConfirm: {
    backgroundColor: Colors.primary[600],
  },
  dialogDanger: {
    backgroundColor: Colors.error[500],
  },
  dialogCancelLabel: {
    color: Colors.neutral[700],
    fontWeight: '600',
    fontSize: 14,
  },
  dialogConfirmLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
