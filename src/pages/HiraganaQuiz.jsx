import { useState } from 'react';
import './HiraganaQuiz.css';
import { addXP, addHiraganaProgress } from '../progress';
import { getQuizBestScore, saveQuizScore, isQuizPassed } from '../levelSystem';

const questions = [
  {
    kana: 'あ',
    answer: 'a',
    options: ['a', 'i', 'u', 'e'],
  },
  {
    kana: 'か',
    answer: 'ka',
    options: ['sa', 'ka', 'ta', 'na'],
  },
  {
    kana: 'し',
    answer: 'shi',
    options: ['chi', 'shi', 'su', 'se'],
  },
  {
    kana: 'つ',
    answer: 'tsu',
    options: ['to', 'tsu', 'te', 'ta'],
  },
  {
    kana: 'ね',
    answer: 'ne',
    options: ['na', 'ni', 'nu', 'ne'],
  },
];

const QUIZ_NAME = 'hiragana';

function HiraganaQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  function answerQuestion(option) {
    if (selected !== null) return;

    setSelected(option);

    if (option === question.answer) {
      setScore((prev) => prev + 20);

      // XP
      addXP(20);

      // Progress Hiragana
      addHiraganaProgress();

      // Daily quiz quest
      localStorage.setItem('japalti_quiz_completed', new Date().toDateString());
    }
  }

  function nextQuestion() {
    if (current === questions.length - 1) {
      const finalScore = score;

      saveQuizScore(QUIZ_NAME, finalScore);

      setFinished(true);
      return;
    }

    setCurrent((prev) => prev + 1);
    setSelected(null);
  }

  function retryQuiz() {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }

  if (finished) {
    const bestScore = getQuizBestScore(QUIZ_NAME);
    const passed = isQuizPassed(QUIZ_NAME);

    return (
      <div className="quiz-page">
        <div className="result-card">
          <div className="result-icon">{passed ? '🏆' : '📚'}</div>

          <span className="section-label">QUIZ SELESAI</span>

          <h1>{passed ? 'Quiz Sempurna! 🎉' : 'Coba Lagi! 💪'}</h1>

          <p>{passed ? 'Hiragana Level 1 sudah kamu kuasai.' : 'Kamu harus mendapatkan 100% untuk lulus quiz ini.'}</p>

          <div className="final-score">
            <span>Nilai Percobaan Ini</span>
            <strong>{score}%</strong>

            <span style={{ marginTop: '12px' }}>Nilai Terbaik</span>
            <strong>{bestScore}%</strong>
          </div>

          {passed && (
            <div
              style={{
                marginBottom: '20px',
                padding: '14px',
                borderRadius: '10px',
                background: '#edf7ee',
                color: '#2e7d32',
                fontWeight: 'bold',
              }}
            >
              ✓ Hiragana Quiz Lulus 100%
            </div>
          )}

          {!passed && <button onClick={retryQuiz}>🔄 Ulangi Quiz</button>}

          <button
            onClick={() => {
              window.location.href = '/dashboard';
            }}
            style={{
              marginTop: passed ? '0' : '10px',
            }}
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <div>
          <span className="section-label">JAPALTI • QUIZ</span>

          <h1>Latihan Hiragana</h1>
        </div>

        <div className="quiz-xp">⭐ {score} XP</div>
      </header>

      <div className="quiz-container">
        <div className="question-progress">
          <span>
            Soal {current + 1} dari {questions.length}
          </span>

          <div>
            <div
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="question-card">
          <p className="question-label">Karakter ini dibaca...</p>

          <div className="question-kana">{question.kana}</div>

          <div className="options">
            {question.options.map((option) => {
              let className = 'option-button';

              if (selected !== null) {
                if (option === question.answer) {
                  className += ' correct';
                } else if (option === selected) {
                  className += ' wrong';
                }
              }

              return (
                <button
                  key={option}
                  className={className}
                  onClick={() => answerQuestion(option)}
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
                  <span>Jawaban yang benar: {question.answer}</span>
                </>
              )}
            </div>
          )}

          {selected !== null && (
            <button
              className="next-button"
              onClick={nextQuestion}
            >
              {current === questions.length - 1 ? 'Lihat Hasil' : 'Soal Berikutnya →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HiraganaQuiz;
