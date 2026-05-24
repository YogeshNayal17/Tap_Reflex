import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useReactionGame from '../hooks/useReactionGame';
import ResultBadge from '../components/ResultBadge';
import { THEME } from '../constants/colors';

const STATE_COPY = {
  idle:    { title: 'Tap to Start',   sub: '' },
  waiting: { title: 'Get Ready…', sub: 'Wait for the color flash!' },
  early:   { title: 'Too Early!',     sub: 'Resetting…' },
  result:  { title: '',               sub: 'Tap anywhere to play again' },
};

export default function GameScreen({ navigation }) {
  const { gameState, flashColor, reactionTime, handleTap, resetGame } =
    useReactionGame();

  const isFlash = gameState === 'flash';
  const bgColor = isFlash ? flashColor : THEME.background;

  function handleBack() {
    resetGame();
    navigation.goBack();
  }

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={[styles.fullScreen, { backgroundColor: bgColor }]}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor={bgColor} />

          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} hitSlop={styles.hitSlop}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isFlash && (
              <Text style={styles.tapLabel}>TAP!</Text>
            )}

            {!isFlash && gameState !== 'result' && (
              <>
                <Text style={styles.stateTitle}>
                  {STATE_COPY[gameState]?.title}
                </Text>
                {STATE_COPY[gameState]?.sub ? (
                  <Text style={styles.subText}>{STATE_COPY[gameState].sub}</Text>
                ) : null}
              </>
            )}

            {gameState === 'result' && (
              <>
                <Text style={styles.resultTime}>{reactionTime}</Text>
                <Text style={styles.resultUnit}>ms</Text>
                <ResultBadge ms={reactionTime} />
                <Text style={styles.subText}>{STATE_COPY.result.sub}</Text>
              </>
            )}
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backText: {
    color: THEME.textSecondary,
    fontSize: 16,
  },
  hitSlop: {
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  tapLabel: {
    color: '#000000',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 6,
  },
  stateTitle: {
    color: THEME.textPrimary,
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
  },
  subText: {
    color: THEME.textSecondary,
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  resultTime: {
    color: THEME.textPrimary,
    fontSize: 72,
    fontWeight: '900',
    lineHeight: 80,
  },
  resultUnit: {
    color: THEME.textSecondary,
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 12,
  },
});
