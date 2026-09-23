import { useEffect, useState } from 'react';
import './Progress.css';

import { getXP, getKatakanaProgress, getHiraganaProgress, getVocabularyProgress, getGrammarProgress, getKanjiProgress } from '../progress';

function Progress() {
  const [data, setData] = useState({
    xp: 0,
    hiragana: 0,
    katakana: 0,
    vocabulary: 0,
    grammar: 0,
    kanji: 0,
  });

  function loadProgress() {
    setData({
      xp: getXP(),
      hiragana: getHiraganaProgress(),
      katakana: getKatakanaProgress(),
      vocabulary: getVocabularyProgress(),
      grammar: getGrammarProgress(),
      kanji: getKanjiProgress(),
    });
  }

  useEffect(() => {
    loadProgress();

    window.addEventListener('pageshow', loadProgress);

    return () => {
      window.removeEventListener('pageshow', loadProgress);
    };
  }, []);

  const { xp, hiragana, katakana, vocabulary, grammar, kanji } = data;

  const materials = [
    {
      name: 'Hiragana',
      icon: 'あ',
      description: 'Belajar karakter Hiragana',
      progress: hiragana,
    },
    {
      name: 'Katakana',
      icon: 'カ',
      description: 'Belajar karakter Katakana',
      progress: katakana,
    },
    {
      name: 'Vocabulary',
      icon: '語',
      description: 'Belajar kosakata bahasa Jepang',
      progress: vocabulary,
    },
    {
      name: 'Grammar',
      icon: '文',
      description: 'Belajar pola kalimat bahasa Jepang',
      progress: grammar,
    },
    {
      name: 'Kanji',
      icon: '漢',
      description: 'Belajar Kanji dasar N5',
      progress: kanji,
    },
  ];

  const level = Math.floor(xp / 100) + 1;
  const currentLevelXP = xp % 100;
  const progress = currentLevelXP;

  const completedMaterials = materials.filter((material) => material.progress >= 100).length;

  const overallProgress = Math.round(materials.reduce((total, material) => total + material.progress, 0) / materials.length);

  return (
    <div className="progress-page">
      <header className="progress-header">
        <div>
          <span className="section-label">JAPALTI • PROGRESS</span>

          <h1>Progress Belajar 📊</h1>

          <p>Lihat perkembangan belajar bahasa Jepangmu.</p>
        </div>

        <button
          onClick={() => {
            window.location.href = '/dashboard';
          }}
        >
          ← Dashboard
        </button>
      </header>

      <main className="progress-container">
        <section className="progress-stats">
          <div className="progress-stat-card">
            <span>⭐</span>

            <div>
              <small>Total XP</small>
              <strong>{xp} XP</strong>
            </div>
          </div>

          <div className="progress-stat-card">
            <span>🏆</span>

            <div>
              <small>Level</small>
              <strong>Level {level}</strong>
            </div>
          </div>

          <div className="progress-stat-card">
            <span>📚</span>

            <div>
              <small>Materi Selesai</small>
              <strong>
                {completedMaterials} / {materials.length}
              </strong>
            </div>
          </div>
        </section>

        <section className="level-card">
          <div className="level-top">
            <div>
              <span className="section-label">LEVEL SAAT INI</span>

              <h2>Level {level}</h2>
            </div>

            <strong>{currentLevelXP} / 100 XP</strong>
          </div>

          <div className="level-bar">
            <div
              className="level-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p>
            {100 - currentLevelXP} XP lagi untuk mencapai Level {level + 1}.
          </p>
        </section>

        <section className="level-card">
          <div className="level-top">
            <div>
              <span className="section-label">OVERALL PROGRESS</span>

              <h2>Perjalanan Belajar</h2>
            </div>

            <strong>{overallProgress}%</strong>
          </div>

          <div className="level-bar">
            <div
              className="level-fill"
              style={{
                width: `${overallProgress}%`,
              }}
            />
          </div>

          <p>Progress rata-rata dari seluruh materi JAPALTI.</p>
        </section>

        <section className="progress-panel">
          <div className="panel-title">
            <span className="section-label">MATERI</span>

            <h2>Perkembangan Materi</h2>
          </div>

          {materials.map((material) => (
            <div
              className="material-item"
              key={material.name}
            >
              <div className="material-info">
                <strong>
                  {material.icon} {material.name}
                </strong>

                <span>{material.description}</span>
              </div>

              <div className="material-progress">
                <div>
                  <div
                    style={{
                      width: `${material.progress}%`,
                    }}
                  />
                </div>

                <span>{material.progress}%</span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Progress;
