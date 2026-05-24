import { useState, useRef, useCallback } from 'react';
import { FLASH_COLORS } from '../constants/colors';
import { saveScore } from '../storage/scores';

const MIN_DELAY = 1500;
const MAX_DELAY = 4000;

export default function useReactionGame() {
  const [gameState, setGameState] = useState('idle');
  const [flashColor, setFlashColor] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);

  // Refs for values needed synchronously inside callbacks
  const stateRef = useRef('idle');
  const waitTimerRef = useRef(null);
  const earlyTimerRef = useRef(null);
  const flashTimeRef = useRef(null);
  const flashColorRef = useRef(null);

  const setState = useCallback((next) => {
    stateRef.current = next;
    setGameState(next);
  }, []);

  const clearTimers = useCallback(() => {
    clearTimeout(waitTimerRef.current);
    clearTimeout(earlyTimerRef.current);
    waitTimerRef.current = null;
    earlyTimerRef.current = null;
  }, []);

  const startWaiting = useCallback(() => {
    setReactionTime(null);
    setState('waiting');
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
    waitTimerRef.current = setTimeout(() => {
      const color = FLASH_COLORS[Math.floor(Math.random() * FLASH_COLORS.length)];
      flashColorRef.current = color;
      flashTimeRef.current = Date.now();
      setFlashColor(color);
      setState('flash');
    }, delay);
  }, [setState]);

  const handleTap = useCallback(() => {
    const current = stateRef.current;

    if (current === 'idle') {
      startWaiting();
      return;
    }

    if (current === 'waiting') {
      clearTimers();
      setState('early');
      earlyTimerRef.current = setTimeout(startWaiting, 1000);
      return;
    }

    if (current === 'flash') {
      const ms = Date.now() - flashTimeRef.current;
      setReactionTime(ms);
      setState('result');
      saveScore({
        id: String(Date.now()),
        time_ms: ms,
        timestamp: new Date().toISOString(),
        color: flashColorRef.current,
      });
      return;
    }

    if (current === 'result') {
      startWaiting();
    }
  }, [startWaiting, clearTimers, setState]);

  const resetGame = useCallback(() => {
    clearTimers();
    setState('idle');
    setFlashColor(null);
    setReactionTime(null);
    flashTimeRef.current = null;
    flashColorRef.current = null;
  }, [clearTimers, setState]);

  return { gameState, flashColor, reactionTime, handleTap, resetGame };
}
