import { useNavigate } from 'react-router-dom';

import './Learning.css';

import { getHiraganaProgress, getKatakanaProgress, getVocabularyProgress, getGrammarProgress, getKanjiProgress } from '../progress';

function Learning() {
  const navigate = useNavigate();

  const materials = [
    {
      name: 'Hiragana',
      description: 'Pelajari karakter Hiragana dasar.',
      icon: 'あ',
      progress: getHiraganaProgress(),
      route: '/hiragana',
    },
    {
      name: 'Katakana',
      description: 'Pelajari karakter Katakana dasar.',
      icon: 'カ',
      progress: getKatakanaProgress(),
      route: '/katakana',
    },
    {
      name: 'Vocabulary',
      description: 'Tambah kosakata bahasa Jepang.',
      icon: '語',
      progress: getVocabularyProgress(),
      route: '/vocabulary',
    },
    {
      name: 'Grammar',
      description: 'Pelajari pola kalimat bahasa Jepang.',
      icon: '文',
      progress: getGrammarProgress(),
      route: '/grammar',
    },
    {
      name: 'Kanji N5',
      description: 'Pelajari Kanji dasar bahasa Jepang.',
      icon: '漢',
      progress: getKanjiProgress(),
      route: '/kanji',
    },
  ];

  const totalProgress = Math.round(materials.reduce((total, material) => total + material.progress, 0) / materials.length);

  const completedMaterials = materials.filter((material) => material.progress >= 100).length;

  function getStatus(progress) {
    if (progress >= 100) {
      return 'Selesai';
    }

    if (progress > 0) {
      return 'Sedang belajar';
    }

    return 'Belum mulai';
  }

  function getButtonText(progress) {
    if (progress >= 100) {
      return 'Ulangi →';
    }

    if (progress > 0) {
      return 'Lanjut →';
    }

    return 'Mulai →';
  }

  return (
    <div className="learning-page">
      <header className="learning-header">
        <div>
          <span className="learning-label">JAPALTI • BELAJAR</span>

          <h1>Belajar Bahasa Jepang 📚</h1>

          <p>Pilih materi dan lanjutkan perjalanan belajarmu.</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>
      </header>

      <main className="learning-container">
        <section className="overall-card">
          <div className="overall-top">
            <div>
              <span className="overall-label">PROGRESS BELAJAR</span>

              <h2>Perjalanan Bahasa Jepangmu</h2>

              <p>
                {completedMaterials} dari {materials.length} materi telah selesai.
              </p>
            </div>

            <strong>{totalProgress}%</strong>
          </div>

          <div className="overall-progress">
            <div
              style={{
                width: `${totalProgress}%`,
              }}
            />
          </div>
        </section>

        <section className="materials-section">
          <div className="section-heading">
            <div>
              <span className="learning-label">MATERI</span>

              <h2>Pilih Materi</h2>
            </div>

            <span className="material-count">{materials.length} Materi</span>
          </div>

          <div className="learning-grid">
            {materials.map((material) => {
              const status = getStatus(material.progress);

              return (
                <div
                  className="material-card"
                  key={material.name}
                  onClick={() => navigate(material.route)}
                >
                  <div className="card-top">
                    <div className="material-icon">{material.icon}</div>

                    <span className={`material-status ${material.progress >= 100 ? 'completed' : material.progress > 0 ? 'learning' : 'not-started'}`}>{status}</span>
                  </div>

                  <h2>{material.name}</h2>

                  <p>{material.description}</p>

                  <div className="progress-info">
                    <span>Progress</span>
                    <strong>{material.progress}%</strong>
                  </div>

                  <div className="material-progress-bar">
                    <div
                      className="material-progress-fill"
                      style={{
                        width: `${material.progress}%`,
                      }}
                    />
                  </div>

                  <div className="material-bottom">
                    <span>{material.progress >= 100 ? 'Materi selesai' : material.progress > 0 ? 'Lanjutkan belajar' : 'Belum dimulai'}</span>

                    <strong>{getButtonText(material.progress)}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Learning;
