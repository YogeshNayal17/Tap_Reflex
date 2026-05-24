import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/colors';

export default function StatCard({ label, value }) {
  const hasValue = value !== null && value !== undefined;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{hasValue ? value : '—'}</Text>
      {hasValue && <Text style={styles.unit}>ms</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  label: {
    color: THEME.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  value: {
    color: THEME.textPrimary,
    fontSize: 26,
    fontWeight: '700',
  },
  unit: {
    color: THEME.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
