import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tapreflexscores';

export async function saveScore(score) {
  try {
    const existing = await getAllScores();
    const updated = [score, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('saveScore error', e);
  }
}

export async function getAllScores() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('getAllScores error', e);
    return [];
  }
}

export async function clearScores() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('clearScores error', e);
  }
}
