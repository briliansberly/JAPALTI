import { addXP } from './progress';

const STUDY_SECONDS_KEY = 'japalti_study_seconds';
const STUDY_DATE_KEY = 'japalti_study_date';
const STUDY_QUEST_KEY = 'japalti_study_quest_completed';

const TARGET_SECONDS = 10;
const STUDY_REWARD_XP = 50;

function getToday() {
  return new Date().toDateString();
}

function resetIfNewDay() {
  const today = getToday();
  const savedDate = localStorage.getItem(STUDY_DATE_KEY);

  if (savedDate !== today) {
    localStorage.setItem(STUDY_DATE_KEY, today);
    localStorage.setItem(STUDY_SECONDS_KEY, '0');
    localStorage.setItem(STUDY_QUEST_KEY, 'false');
  }
}

export function getStudySeconds() {
  resetIfNewDay();

  const saved = localStorage.getItem(STUDY_SECONDS_KEY);

  return saved ? Number(saved) : 0;
}

export function isStudyQuestCompleted() {
  resetIfNewDay();

  return localStorage.getItem(STUDY_QUEST_KEY) === 'true';
}

export function startStudyTimer(onTick, onComplete) {
  resetIfNewDay();

  if (isStudyQuestCompleted()) {
    onTick?.(TARGET_SECONDS);
    return () => {};
  }

  let lastTime = Date.now();

  onTick?.(getStudySeconds());

  const interval = setInterval(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - lastTime) / 1000);

    if (elapsed <= 0) {
      return;
    }

    lastTime = now;

    const currentSeconds = getStudySeconds();

    const newSeconds = Math.min(currentSeconds + elapsed, TARGET_SECONDS);

    localStorage.setItem(STUDY_SECONDS_KEY, newSeconds);

    onTick?.(newSeconds);

    if (newSeconds >= TARGET_SECONDS) {
      localStorage.setItem(STUDY_QUEST_KEY, 'true');

      addXP(STUDY_REWARD_XP);

      clearInterval(interval);

      onComplete?.();
    }
  }, 1000);

  return () => {
    clearInterval(interval);
  };
}
