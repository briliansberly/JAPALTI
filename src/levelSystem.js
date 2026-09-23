const QUIZ_SCORES_KEY = 'japalti_quiz_scores';

function getQuizScores() {
  const saved = localStorage.getItem(QUIZ_SCORES_KEY);

  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
}

export function getQuizBestScore(quizName) {
  const scores = getQuizScores();
  return scores[quizName] || 0;
}

export function saveQuizScore(quizName, score) {
  const scores = getQuizScores();

  const currentBest = scores[quizName] || 0;

  if (score > currentBest) {
    scores[quizName] = score;

    localStorage.setItem(QUIZ_SCORES_KEY, JSON.stringify(scores));
  }

  return Math.max(score, currentBest);
}

export function isQuizPassed(quizName) {
  return getQuizBestScore(quizName) >= 100;
}

export function getLevel1Progress() {
  const quizzes = ['hiragana', 'katakana', 'vocabulary', 'grammar', 'kanji'];

  const completed = quizzes.filter((quiz) => isQuizPassed(quiz)).length;

  return {
    completed,
    total: quizzes.length,
    percentage: Math.round((completed / quizzes.length) * 100),
  };
}

export function isLevel2Unlocked() {
  const progress = getLevel1Progress();

  return progress.completed === progress.total;
}
