import { useState } from 'react';
import './GrammarQuiz.css';
import { addXP, addGrammarProgress, completeQuizQuest } from '../progress';

const questions = [
  {
    question: 'わたし ___ がくせいです。',
    translation: 'Saya adalah seorang siswa.',
    options: ['は', 'の', 'も', 'か'],
    answer: 'は',
    explanation: '「は」 digunakan sebagai partikel penanda topik.',
  },
  {
    question: 'これは ほん ___ ありません。',
    translation: 'Ini bukan buku.',
    options: ['です', 'では', 'の', 'も'],
    answer: 'では',
    explanation: '「ではありません」 digunakan untuk menyatakan bentuk negatif secara sopan.',
  },
  {
    question: 'わたし ___ ほんです。',
    translation: 'Ini adalah buku saya.',
    options: ['は', 'も', 'の', 'か'],
    answer: 'の',
    explanation: '「の」 digunakan untuk menunjukkan hubungan atau kepemilikan.',
  },
  {
    question: 'わたし ___ がくせいです。',
    translation: 'Saya juga seorang siswa.',
    options: ['は', 'も', 'の', 'か'],
    answer: 'も',
    explanation: '「も」 memiliki arti "juga".',
  },
  {
    question: 'あなたは がくせいです ___。',
    translation: 'Apakah kamu seorang siswa?',
    options: ['は', 'の', 'も', 'か'],
    answer: 'か',
    explanation: '「か」 di akhir kalimat digunakan untuk membuat pertanyaan sopan.',
  },
  {
    question: 'たなかさん ___ せんせいです。',
    translation: 'Tanaka adalah seorang guru.',
    options: ['は', 'の', 'も', 'か'],
    answer: 'は',
    explanation: '「は」 menandai Tanaka sebagai topik pembicaraan.',
  },
  {
    question: 'これは わたし ___ かばんです。',
    translation: 'Ini adalah tas saya.',
    options: ['は', 'の', 'も', 'か'],
    answer: 'の',
    explanation: '「わたしの」 berarti "milik saya".',
  },
  {
    question: 'たなかさん ___ がくせいです。',
    translation: 'Tanaka juga seorang siswa.',
    options: ['は', 'の', 'も', 'か'],
    answer: 'も',
    explanation: '「も」 digunakan ketika menyatakan bahwa seseorang juga memiliki status yang sama.',
  },
  {
    question: 'これは せんせい ___ ですか。',
    translation: 'Apakah ini milik guru?',
    options: ['は', 'の', 'も', 'か'],
    answer: 'の',
    explanation: '「せんせいの」 menunjukkan hubungan kepemilikan atau hubungan dengan guru.',
  },
  {
    question: 'あなたは せんせい ___。',
    translation: 'Apakah kamu seorang guru?',
    options: ['です', 'ではありません', 'ですか', 'の'],
    answer: 'ですか',
    explanation: '「ですか」 digunakan untuk membentuk pertanyaan sopan.',
  },
];

function GrammarQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  const chooseAnswer = (option) => {
    if (answered) return;

    setSelected(option);
    setAnswered(true);

    if (option === question.answer) {
      setScore((prev) => prev + 20);

      // Tambah XP
      addXP(20);

      // Tambah progress Grammar
      addGrammarProgress();

      // Selesaikan Daily Quest Quiz
      completeQuizQuest();
    }
  };

  const nextQuestion = () => {
    if (current === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrent((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setFinished(false);
  };

  const goBack = () => {
    window.location.href = '/dashboard';
  };

  if (finished) {
    const correctAnswers = score / 20;

    return (
      <div className="grammar-quiz-page">
        <div className="grammar-result">
          <div className="result-icon">🏆</div>

          <span className="grammar-quiz-label">JAPALTI • HASIL QUIZ</span>

          <h1>Quiz Selesai!</h1>

          <p>Kamu telah menyelesaikan Grammar Quiz.</p>

          <div className="result-score">
            <div>
              <span>SKOR</span>
              <strong>{correctAnswers * 10}/100</strong>
            </div>

            <div>
              <span>XP DIDAPAT</span>
              <strong>+{score} XP</strong>
            </div>
          </div>

          <div className="result-message">
            {correctAnswers === 10 && (
              <>
                🎉 <strong>Perfect!</strong>
                <p>Semua jawaban benar. Luar biasa!</p>
              </>
            )}

            {correctAnswers >= 7 && correctAnswers < 10 && (
              <>
                🔥 <strong>Bagus banget!</strong>
                <p>Kamu sudah memahami dasar grammar.</p>
              </>
            )}

            {correctAnswers < 7 && (
              <>
                💪 <strong>Terus belajar!</strong>
                <p>Coba review materi grammar lalu ulangi quiz.</p>
              </>
            )}
          </div>

          <button
            className="grammar-primary"
            onClick={restartQuiz}
          >
            🔄 Coba Lagi
          </button>

          <button
            className="grammar-secondary"
            onClick={goBack}
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grammar-quiz-page">
      <header className="grammar-quiz-header">
        <div>
          <span className="grammar-quiz-label">JAPALTI • GRAMMAR</span>

          <h1>Grammar Quiz</h1>
        </div>

        <div className="grammar-xp">⭐ {score} XP</div>
      </header>

      <main className="grammar-quiz-main">
        <div className="grammar-progress">
          <div className="grammar-progress-info">
            <span>
              Soal {current + 1} dari {questions.length}
            </span>

            <span>{Math.round(((current + 1) / questions.length) * 100)}%</span>
          </div>

          <div className="grammar-progress-bar">
            <div
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="grammar-question-card">
          <div className="question-number">QUESTION {String(current + 1).padStart(2, '0')}</div>

          <h2 className="grammar-question">{question.question}</h2>

          <p className="question-translation">{question.translation}</p>

          <div className="grammar-answer-list">
            {question.options.map((option) => {
              let className = 'grammar-answer';

              if (answered) {
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
                  disabled={answered}
                >
                  <span className="answer-letter">{String.fromCharCode(65 + question.options.indexOf(option))}</span>

                  <span>{option}</span>

                  {answered && option === question.answer && <span className="answer-icon">✓</span>}

                  {answered && option === selected && option !== question.answer && <span className="answer-icon">✕</span>}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={selected === question.answer ? 'grammar-feedback correct-feedback' : 'grammar-feedback wrong-feedback'}>
              <strong>{selected === question.answer ? '✓ Jawaban Benar!' : '✕ Jawaban Belum Tepat'}</strong>

              <p>{question.explanation}</p>

              {selected === question.answer && <span className="xp-earned">+20 XP</span>}
            </div>
          )}

          {answered && (
            <button
              className="grammar-next"
              onClick={nextQuestion}
            >
              {current === questions.length - 1 ? 'Lihat Hasil →' : 'Soal Berikutnya →'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default GrammarQuiz;
