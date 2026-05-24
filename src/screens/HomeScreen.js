import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getAllScores } from '../storage/scores';
import { THEME } from '../constants/colors';

export default function HomeScreen({ navigation }) {
  const [bestScore, setBestScore] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAllScores().then((scores) => {
        if (!active || scores.length === 0) return;
        const best = Math.min(...scores.map((s) => s.time_ms));
        setBestScore(best);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>TapReflex</Text>
        <Text style={styles.subtitle}>How fast are you?</Text>

        <View style={styles.bestCard}>
          <Text style={styles.bestLabel}>BEST</Text>
          <Text style={styles.bestValue}>
            {bestScore !== null ? `${bestScore}` : '—'}
          </Text>
          {bestScore !== null && <Text style={styles.bestUnit}>ms</Text>}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Game')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>PLAY</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Stats')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>STATS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: THEME.textPrimary,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    color: THEME.textSecondary,
    fontSize: 16,
    marginBottom: 48,
  },
  bestCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
  },
  bestLabel: {
    color: THEME.textSecondary,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  bestValue: {
    color: THEME.textPrimary,
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
  },
  bestUnit: {
    color: THEME.textSecondary,
    fontSize: 16,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: THEME.buttonPrimary,
    paddingVertical: 18,
    borderRadius: 14,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 3,
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: THEME.textSecondary,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: THEME.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 3,
  },
});
