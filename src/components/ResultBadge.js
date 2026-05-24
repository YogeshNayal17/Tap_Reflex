import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RESULT_THRESHOLDS } from '../constants/thresholds';

export default function ResultBadge({ ms }) {
  const tier =
    RESULT_THRESHOLDS.find((t) => ms < t.maxMs) ||
    RESULT_THRESHOLDS[RESULT_THRESHOLDS.length - 1];

  return (
    <View style={[styles.badge, { backgroundColor: tier.color }]}>
      <Text style={styles.label}>{tier.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    alignSelf: 'center',
  },
  label: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1.5,
  },
});
