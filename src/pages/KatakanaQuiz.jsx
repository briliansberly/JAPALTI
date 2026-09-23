import { useState } from 'react';
import './KatakanaQuiz.css';
import { addXP, addKatakanaProgress } from '../progress';

const questions = [
  {
    kana: 'ア',
    answer: 'a',
    options: ['a', 'i', 'u', 'e'],
  },
  {
    kana: 'カ',
    answer: 'ka',
    options: ['ka', 'sa', 'ta', 'na'],
  },
  {
    kana: 'シ',
    answer: 'shi',
    options: ['shi', 'chi', 'su', 'se'],
  },
  {
    kana: 'ツ',
    answer: 'tsu',
    options: ['ta', 'tsu', 'te', 'to'],
  },
  {
    kana: 'ネ',
    answer: 'ne',
    options: ['na', 'ni', 'nu', 'ne'],
  },
];

function KatakanaQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  function answerQuestion(option) {
    if (selected !== null) return;

    setSelected(option);

    if (option === question.answer) {
      setScore(score + 20);
      addXP(20);
      addKatakanaProgress();

      completeQuizQuest();
      localStorage.setItem('japalti_quiz_completed', new Date().toDateString());
    }
  }

  function nextQuestion() {
    if (current === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrent((prev) => prev + 1);
    setSelected(null);
  }

  function restartQuiz() {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="katakana-quiz-page">
        <div className="result-card">
          <div className="result-icon">🏆</div>

          <span className="section-label">QUIZ SELESAI</span>

          <h1>おめでとう! 🎉</h1>

          <p>Kamu sudah menyelesaikan Quiz Katakana.</p>

          <div className="final-score">
            <span>XP yang didapat</span>
            <strong>+{score} XP</strong>
          </div>

          <div className="result-actions">
            <button onClick={restartQuiz}>Coba Lagi</button>

            <button
              onClick={() => {
                window.location.href = '/dashboard';
              }}
            >
              ← Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="katakana-quiz-page">
      <header className="quiz-header">
        <div>
          <span className="section-label">JAPALTI • QUIZ</span>

          <h1>Latihan Katakana</h1>
        </div>

        <div className="quiz-xp">⭐ {score} XP</div>
      </header>

      <main className="quiz-container">
        <div className="katakana-progress">
          <div className="katakana-progress-info">
            <span>
              Soal {current + 1} dari {questions.length}
            </span>

            <span>{Math.round(((current + 1) / questions.length) * 100)}%</span>
          </div>

          <div className="katakana-progress-track">
            <div
              className="katakana-progress-fill"
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
                }

                if (option === selected && option !== question.answer) {
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
                  <strong>✓ Jawaban benar!</strong>
                  <span>+20 XP</span>
                </>
              ) : (
                <>
                  <strong>✕ Belum tepat</strong>
                  <span>Jawaban yang benar adalah {question.answer}</span>
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
      </main>
    </div>
  );
}

export default KatakanaQuiz;
