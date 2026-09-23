const XP_KEY = 'japalti_xp';

const QUIZ_KEY = 'japalti_quiz_completed';

export const getXP = () => {
  const savedXP = localStorage.getItem(XP_KEY);
  return savedXP ? Number(savedXP) : 0;
};

export const addXP = (amount) => {
  const currentXP = getXP();
  const newXP = currentXP + amount;
  localStorage.setItem(XP_KEY, newXP);
  return newXP;
};

export const completeQuizQuest = () => {
  const today = new Date().toDateString();
  localStorage.setItem(QUIZ_KEY, today);
};

export const isQuizQuestCompleted = () => {
  const today = new Date().toDateString();
  const completedDate = localStorage.getItem(QUIZ_KEY);
  return completedDate === today;
};

const KATAKANA_KEY = 'japalti_katakana_progress';

export const getKatakanaProgress = () => {
  const saved = localStorage.getItem(KATAKANA_KEY);
  return saved ? Number(saved) : 0;
};

export const addKatakanaProgress = () => {
  const current = getKatakanaProgress();
  const newProgress = Math.min(current + 20, 100);
  localStorage.setItem(KATAKANA_KEY, newProgress);
  return newProgress;
};

const HIRAGANA_KEY = 'japalti_hiragana_progress';

export const getHiraganaProgress = () => {
  const saved = localStorage.getItem(HIRAGANA_KEY);
  return saved ? Number(saved) : 0;
};

export const addHiraganaProgress = () => {
  const current = getHiraganaProgress();
  const newProgress = Math.min(current + 20, 100);
  localStorage.setItem(HIRAGANA_KEY, newProgress);
  return newProgress;
};

const VOCABULARY_KEY = 'japalti_vocabulary_progress';

export const getVocabularyProgress = () => {
  const saved = localStorage.getItem(VOCABULARY_KEY);
  return saved ? Number(saved) : 0;
};

export const addVocabularyProgress = () => {
  const current = getVocabularyProgress();
  const newProgress = Math.min(current + 20, 100);
  localStorage.setItem(VOCABULARY_KEY, newProgress);
  return newProgress;
};

const GRAMMAR_KEY = 'japalti_grammar_progress';

export const getGrammarProgress = () => {
  const saved = localStorage.getItem(GRAMMAR_KEY);
  return saved ? Number(saved) : 0;
};

export const addGrammarProgress = () => {
  const current = getGrammarProgress();
  const newProgress = Math.min(current + 10, 100);
  localStorage.setItem(GRAMMAR_KEY, newProgress);
  return newProgress;
};

export const getKanjiProgress = () => {
  const saved = localStorage.getItem('japalti_kanji_progress');
  return saved ? Number(saved) : 0;
};

export const addKanjiProgress = () => {
  const current = getKanjiProgress();
  const newProgress = Math.min(current + 20, 100);
  localStorage.setItem('japalti_kanji_progress', newProgress);
  return newProgress;
};
