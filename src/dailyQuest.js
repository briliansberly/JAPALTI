const VOCAB_QUEST_COUNT_KEY = 'japalti_vocab_quest_count';
const VOCAB_QUEST_DATE_KEY = 'japalti_vocab_quest_date';
const VOCAB_QUEST_COMPLETED_KEY = 'japalti_vocab_quest_completed';
const VOCAB_QUEST_REWARD_KEY = 'japalti_vocab_quest_reward_date';

const VOCAB_QUEST_TARGET = 5;

function getToday() {
  return new Date().toDateString();
}

function resetIfNewDay() {
  const today = getToday();
  const savedDate = localStorage.getItem(VOCAB_QUEST_DATE_KEY);

  if (savedDate !== today) {
    localStorage.setItem(VOCAB_QUEST_DATE_KEY, today);
    localStorage.setItem(VOCAB_QUEST_COUNT_KEY, '0');
    localStorage.setItem(VOCAB_QUEST_COMPLETED_KEY, 'false');
  }
}

export function getVocabularyQuestCount() {
  resetIfNewDay();

  const saved = localStorage.getItem(VOCAB_QUEST_COUNT_KEY);

  return saved ? Number(saved) : 0;
}

export function isVocabularyQuestCompleted() {
  resetIfNewDay();

  return localStorage.getItem(VOCAB_QUEST_COMPLETED_KEY) === 'true';
}

export function addVocabularyQuestProgress() {
  resetIfNewDay();

  if (isVocabularyQuestCompleted()) {
    return getVocabularyQuestCount();
  }

  const current = getVocabularyQuestCount();

  const newCount = Math.min(current + 1, VOCAB_QUEST_TARGET);

  localStorage.setItem(VOCAB_QUEST_COUNT_KEY, newCount);

  if (newCount >= VOCAB_QUEST_TARGET) {
    localStorage.setItem(VOCAB_QUEST_COMPLETED_KEY, 'true');
  }

  return newCount;
}

export function claimVocabularyQuestReward() {
  resetIfNewDay();

  if (!isVocabularyQuestCompleted()) {
    return false;
  }

  const today = getToday();

  const rewardDate = localStorage.getItem(VOCAB_QUEST_REWARD_KEY);

  if (rewardDate === today) {
    return false;
  }

  localStorage.setItem(VOCAB_QUEST_REWARD_KEY, today);

  return true;
}
