import { useState } from 'react';
import './VocabularyQuiz.css';

import { addXP, addVocabularyProgress, completeQuizQuest } from '../progress';

import { addVocabularyQuestProgress, claimVocabularyQuestReward, getVocabularyQuestCount, isVocabularyQuestCompleted } from '../dailyQuest';

const questions = [
  {
    word: 'こんにちは',
    reading: 'Konnichiwa',
    question: 'Apa arti dari こんにちは?',
    answer: 'Halo',
    options: ['Halo', 'Terima kasih', 'Selamat tinggal', 'Maaf'],
  },
  {
    word: 'ありがとう',
    reading: 'Arigatou',
    question: 'Apa arti dari ありがとう?',
    answer: 'Terima kasih',
    options: ['Halo', 'Terima kasih', 'Selamat pagi', 'Sampai jumpa'],
  },
  {
    word: '学校',
    reading: 'Gakkou',
    question: 'Apa arti dari 学校?',
    answer: 'Sekolah',
    options: ['Rumah', 'Sekolah', 'Kantor', 'Toko'],
  },
  {
    word: '先生',
    reading: 'Sensei',
    question: 'Apa arti dari 先生?',
    answer: 'Guru',
    options: ['Siswa', 'Teman', 'Guru', 'Dokter'],
  },
  {
    word: '友達',
    reading: 'Tomodachi',
    question: 'Apa arti dari 友達?',
    answer: 'Teman',
    options: ['Keluarga', 'Guru', 'Teman', 'Orang tua'],
  },
  {
    word: '家族',
    reading: 'Kazoku',
    question: 'Apa arti dari 家族?',
    answer: 'Keluarga',
    options: ['Sekolah', 'Keluarga', 'Teman', 'Rumah'],
  },
  {
    word: '水',
    reading: 'Mizu',
    question: 'Apa arti dari 水?',
    answer: 'Air',
    options: ['Air', 'Api', 'Nasi', 'Teh'],
  },
  {
    word: '電車',
    reading: 'Densha',
    question: 'Apa arti dari 電車?',
    answer: 'Kereta',
    options: ['Bus', 'Mobil', 'Kereta', 'Sepeda'],
  },
];

function VocabularyQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const [vocabularyQuestCount, setVocabularyQuestCount] = useState(getVocabularyQuestCount());

  const [vocabularyQuestCompleted, setVocabularyQuestCompleted] = useState(isVocabularyQuestCompleted());

  const question = questions[current];

  const chooseAnswer = (option) => {
    if (selected !== null) return;

    setSelected(option);

    if (option === question.answer) {
      setScore((prev) => prev + 20);

      // Tambah XP quiz
      addXP(20);

      // Tambah progress Vocabulary
      addVocabularyProgress();

      // Tandai quest "Selesaikan 1 quiz"
      completeQuizQuest();

      // Tambah progress Daily Quest Vocabulary
      const newQuestCount = addVocabularyQuestProgress();

      setVocabularyQuestCount(newQuestCount);

      if (newQuestCount >= 5) {
        setVocabularyQuestCompleted(true);

        const rewardGranted = claimVocabularyQuestReward();

        if (rewardGranted) {
          addXP(20);
        }
      }
    }
  };

  const nextQuestion = () => {
    if (current === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrent((prev) => prev + 1);
    setSelected(null);
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);

    setVocabularyQuestCount(getVocabularyQuestCount());
    setVocabularyQuestCompleted(isVocabularyQuestCompleted());
  };

  if (finished) {
    return (
      <div className="vocab-quiz-page">
        <div className="vocab-result">
          <div className="result-icon">🏆</div>

          <span className="quiz-label">VOCABULARY QUIZ</span>

          <h1>Quiz Selesai!</h1>

          <p>Kamu sudah menyelesaikan Vocabulary Quiz.</p>

          <div className="final-score">
            <span>Total XP</span>
            <strong>+{score} XP</strong>
          </div>

          <div className="score-info">
            Jawaban benar: {score / 20} dari {questions.length}
          </div>

          <div className="quest-result">
            {vocabularyQuestCompleted ? (
              <>
                <strong>🎉 Daily Quest selesai!</strong>
                <span>5 / 5 kosakata • +20 XP bonus</span>
              </>
            ) : (
              <>
                <strong>🎯 Daily Quest Vocabulary</strong>
                <span>{vocabularyQuestCount} / 5 kosakata dipelajari</span>
              </>
            )}
          </div>

          <button
            className="primary-button"
            onClick={restartQuiz}
          >
            Coba Lagi
          </button>

          <button
            className="secondary-button"
            onClick={() => {
              window.location.href = '/dashboard';
            }}
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vocab-quiz-page">
      <header className="vocab-quiz-header">
        <div>
          <span className="quiz-label">JAPALTI • QUIZ</span>

          <h1>Vocabulary Quiz</h1>
        </div>

        <div className="quiz-xp">⭐ {score} XP</div>
      </header>

      <main className="vocab-quiz-main">
        <div className="quiz-progress">
          <div className="progress-info">
            <span>
              Soal {current + 1} dari {questions.length}
            </span>

            <span>{Math.round(((current + 1) / questions.length) * 100)}%</span>
          </div>

          <div className="progress-bar">
            <div
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="vocab-question-card">
          <p className="question-title">{question.question}</p>

          <div className="vocab-word">{question.word}</div>

          <div className="vocab-reading">{question.reading}</div>

          <div className="answer-list">
            {question.options.map((option) => {
              let className = 'vocab-answer';

              if (selected !== null) {
                if (option === question.answer) {
                  className += ' correct';
                }

                if (option === selected && option !== question.answer) {
                  className += ' wrong';
                }
              }

              return (
                <button
                  key={option}
                  className={className}
                  onClick={() => chooseAnswer(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="answer-feedback">
              {selected === question.answer ? (
                <>
                  <strong>✓ Benar!</strong>
                  <span>+20 XP</span>
                </>
              ) : (
                <>
                  <strong>✕ Belum tepat</strong>
                  <span>Jawaban benar: {question.answer}</span>
                </>
              )}
            </div>
          )}

          {selected !== null && (
            <button
              className="next-question"
              onClick={nextQuestion}
            >
              {current === questions.length - 1 ? 'Lihat Hasil' : 'Soal Berikutnya →'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default VocabularyQuiz;
