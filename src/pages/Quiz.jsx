import { useNavigate } from 'react-router-dom';

import './Quiz.css';

function Quiz() {
  const navigate = useNavigate();

  const quizzes = [
    {
      name: 'Quiz Hiragana',
      description: 'Uji kemampuan membaca Hiragana dasar.',
      icon: 'あ',
      route: '/hiragana-quiz',
    },
    {
      name: 'Quiz Katakana',
      description: 'Uji kemampuan membaca Katakana dasar.',
      icon: 'カ',
      route: '/katakana-quiz',
    },
    {
      name: 'Quiz Vocabulary',
      description: 'Uji pemahaman kosakata bahasa Jepang.',
      icon: '語',
      route: '/vocabulary-quiz',
    },
    {
      name: 'Quiz Grammar',
      description: 'Uji pemahaman pola kalimat bahasa Jepang.',
      icon: '文',
      route: '/grammar-quiz',
    },
    {
      name: 'Quiz Kanji N5',
      description: 'Uji kemampuan Kanji dasar N5.',
      icon: '漢',
      route: '/kanji-quiz',
    },
  ];

  return (
    <div className="quiz-hub-page">
      <header className="quiz-hub-header">
        <div>
          <span className="quiz-label">JAPALTI • QUIZ</span>

          <h1>Quiz Bahasa Jepang 📝</h1>

          <p>Uji kemampuanmu melalui latihan dan evaluasi bahasa Jepang.</p>
        </div>

        <button
          className="quiz-back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>
      </header>

      <main className="quiz-hub-container">
        <section className="quiz-summary">
          <div>
            <span>QUIZ TERSEDIA</span>
            <strong>{quizzes.length}</strong>
          </div>

          <div>
            <span>MODE</span>
            <strong>Evaluasi</strong>
          </div>

          <div>
            <span>XP PER JAWABAN BENAR</span>
            <strong>+20 XP</strong>
          </div>
        </section>

        <section className="quiz-section">
          <div className="quiz-section-heading">
            <div>
              <span className="quiz-label">PILIH QUIZ</span>

              <h2>Latihan & Evaluasi</h2>

              <p>Pilih quiz yang ingin kamu kerjakan.</p>
            </div>
          </div>

          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div
                className="quiz-card"
                key={quiz.name}
                onClick={() => navigate(quiz.route)}
              >
                <div className="quiz-card-top">
                  <div className="quiz-icon">{quiz.icon}</div>

                  <span className="quiz-type">QUIZ</span>
                </div>

                <h2>{quiz.name}</h2>

                <p>{quiz.description}</p>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(quiz.route);
                  }}
                >
                  Mulai Quiz →
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Quiz;
