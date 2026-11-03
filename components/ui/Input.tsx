import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { useState } from 'react';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string | null;
  helper?: string;
}

export function Input({
  label,
  error,
  helper,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused, error && styles.inputError, style]}
        placeholderTextColor={Colors.neutral[400]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : helper ? (
        <Text style={styles.helperText}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.neutral[900],
    minHeight: 48,
  },
  inputFocused: {
    borderColor: Colors.primary[500],
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: Colors.error[500],
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.error[600],
  },
  helperText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.neutral[500],
  },
});
