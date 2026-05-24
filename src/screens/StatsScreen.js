import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllScores, clearScores } from '../storage/scores';
import StatCard from '../components/StatCard';
import { THEME } from '../constants/colors';

function computeStats(scores) {
  if (!scores.length) return { best: null, avg: null, worst: null };
  const times = scores.map((s) => s.time_ms);
  return {
    best: Math.min(...times),
    worst: Math.max(...times),
    avg: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
  };
}

export default function StatsScreen() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    getAllScores().then(setScores);
  }, []);

  function handleClear() {
    Alert.alert('Clear History', 'Delete all scores? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await clearScores();
          setScores([]);
        },
      },
    ]);
  }

  const { best, avg, worst } = computeStats(scores);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.heading}>Statistics</Text>

      <View style={styles.cardRow}>
        <StatCard label="Best" value={best} />
        <StatCard label="Avg" value={avg} />
        <StatCard label="Worst" value={worst} />
      </View>

      <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No scores yet.{'\n'}Play a round to see your stats!
          </Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.timeText}>{item.time_ms} ms</Text>
            <Text style={styles.dateText}>
              {new Date(item.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
        )}
      />

      {scores.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          activeOpacity={0.7}
        >
          <Text style={styles.clearText}>Clear History</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  heading: {
    color: THEME.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    color: THEME.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 60,
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  rank: {
    color: THEME.textSecondary,
    fontSize: 13,
    width: 36,
  },
  timeText: {
    color: THEME.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  dateText: {
    color: THEME.textSecondary,
    fontSize: 13,
  },
  clearButton: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FF6B6B',
    alignItems: 'center',
  },
  clearText: {
    color: '#FF6B6B',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
});
