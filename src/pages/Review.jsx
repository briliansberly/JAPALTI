import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getHiraganaProgress, getKatakanaProgress, getVocabularyProgress, getGrammarProgress, getKanjiProgress } from '../progress';

import './Review.css';

function Review() {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);

  function loadReviewData() {
    setMaterials([
      {
        name: 'Hiragana',
        icon: 'あ',
        progress: getHiraganaProgress(),
        description: 'Review karakter Hiragana dasar.',
        materialRoute: '/hiragana',
        quizRoute: '/hiragana-quiz',
      },
      {
        name: 'Katakana',
        icon: 'カ',
        progress: getKatakanaProgress(),
        description: 'Review karakter Katakana dasar.',
        materialRoute: '/katakana',
        quizRoute: '/katakana-quiz',
      },
      {
        name: 'Vocabulary N5',
        icon: '語',
        progress: getVocabularyProgress(),
        description: 'Review kosakata bahasa Jepang.',
        materialRoute: '/vocabulary',
        quizRoute: '/vocabulary-quiz',
      },
      {
        name: 'Grammar N5',
        icon: '文',
        progress: getGrammarProgress(),
        description: 'Review pola kalimat bahasa Jepang.',
        materialRoute: '/grammar',
        quizRoute: '/grammar-quiz',
      },
      {
        name: 'Kanji N5',
        icon: '漢',
        progress: getKanjiProgress(),
        description: 'Review Kanji dasar bahasa Jepang.',
        materialRoute: '/kanji',
        quizRoute: '/kanji-quiz',
      },
    ]);
  }

  useEffect(() => {
    loadReviewData();

    window.addEventListener('pageshow', loadReviewData);

    return () => {
      window.removeEventListener('pageshow', loadReviewData);
    };
  }, []);

  const completedCount = materials.filter((material) => material.progress >= 100).length;

  return (
    <div className="review-page">
      <header className="review-header">
        <button
          className="review-back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>

        <div className="review-header-content">
          <span className="review-label">JAPALTI • REVIEW</span>

          <h1>Review 📚</h1>

          <p>Ulangi materi yang sudah kamu pelajari supaya makin nempel.</p>
        </div>
      </header>

      <main className="review-main">
        <section className="review-overview">
          <div>
            <span className="review-overview-label">REVIEW MATERI</span>

            <h2>
              {completedCount} / {materials.length} materi selesai
            </h2>

            <p>Pilih materi untuk membaca ulang atau langsung mengerjakan quiz.</p>
          </div>

          <div className="review-overview-icon">📖</div>
        </section>

        <section className="review-section">
          <div className="review-section-header">
            <div>
              <span className="review-section-label">PILIH MATERI</span>

              <h2>Materi yang bisa direview</h2>
            </div>
          </div>

          <div className="review-grid">
            {materials.map((material) => (
              <article
                className="review-card"
                key={material.name}
              >
                <div className="review-card-top">
                  <div className="review-card-icon">{material.icon}</div>

                  <span className="review-progress">{material.progress}%</span>
                </div>

                <h3>{material.name}</h3>

                <p>{material.description}</p>

                <div className="review-progress-info">
                  <span>Progress</span>
                  <strong>{material.progress}%</strong>
                </div>

                <div className="review-progress-bar">
                  <div
                    style={{
                      width: `${material.progress}%`,
                    }}
                  />
                </div>

                <div className="review-actions">
                  <button
                    className="review-material-button"
                    onClick={() => navigate(material.materialRoute)}
                  >
                    📖 Materi
                  </button>

                  <button
                    className="review-quiz-button"
                    onClick={() => navigate(material.quizRoute)}
                  >
                    📝 Quiz
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="review-tip">
          <div className="review-tip-icon">💡</div>

          <div>
            <strong>Tips Review</strong>

            <p>Kalau ada materi yang masih terasa susah, buka materinya lagi lalu lanjutkan dengan quiz untuk menguji pemahamanmu.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Review;
