import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getXP, isQuizQuestCompleted, getHiraganaProgress, getKatakanaProgress, getVocabularyProgress, getGrammarProgress, getKanjiProgress } from '../progress';

import { getVocabularyQuestCount, isVocabularyQuestCompleted } from '../dailyQuest';

import { isStudyQuestCompleted } from '../studyTimer';

import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: localStorage.getItem('japalti_user_name') || 'Siswa',
    xp: 0,
    quizCompleted: false,
    studyCompleted: false,
    vocabularyQuestCount: 0,
    vocabularyQuestCompleted: false,
    streak: 0,
    hiragana: 0,
    katakana: 0,
    vocabulary: 0,
    grammar: 0,
    kanji: 0,
  });

  function loadDashboardData() {
    const today = new Date();
    const todayString = today.toDateString();

    const completedDate = localStorage.getItem('japalti_quiz_completed');

    let streak = Number(localStorage.getItem('japalti_streak')) || 0;

    const lastStreakDate = localStorage.getItem('japalti_streak_date');

    if (completedDate === todayString) {
      if (lastStreakDate !== todayString) {
        const yesterday = new Date();

        yesterday.setDate(yesterday.getDate() - 1);

        if (lastStreakDate === yesterday.toDateString()) {
          streak += 1;
        } else {
          streak = 1;
        }

        localStorage.setItem('japalti_streak', streak);

        localStorage.setItem('japalti_streak_date', todayString);
      }
    }

    setData({
      name: localStorage.getItem('japalti_user_name') || 'Siswa',
      xp: getXP(),
      quizCompleted: isQuizQuestCompleted(),
      studyCompleted: isStudyQuestCompleted(),
      vocabularyQuestCount: getVocabularyQuestCount(),
      vocabularyQuestCompleted: isVocabularyQuestCompleted(),
      streak,

      hiragana: getHiraganaProgress(),
      katakana: getKatakanaProgress(),
      vocabulary: getVocabularyProgress(),
      grammar: getGrammarProgress(),
      kanji: getKanjiProgress(),
    });
  }

  useEffect(() => {
    loadDashboardData();

    window.addEventListener('pageshow', loadDashboardData);

    return () => {
      window.removeEventListener('pageshow', loadDashboardData);
    };
  }, []);

  const { name, xp, quizCompleted, studyCompleted, vocabularyQuestCount, vocabularyQuestCompleted, streak, hiragana, katakana, vocabulary, grammar, kanji } = data;

  const level = Math.floor(xp / 100) + 1;

  const materials = [
    {
      name: 'Hiragana Dasar',
      icon: 'あ',
      progress: hiragana,
      description: 'Pelajari karakter Hiragana dari awal.',
      route: '/hiragana',
    },
    {
      name: 'Katakana Dasar',
      icon: 'カ',
      progress: katakana,
      description: 'Pelajari karakter Katakana dari awal.',
      route: '/katakana',
    },
    {
      name: 'Vocabulary N5',
      icon: '語',
      progress: vocabulary,
      description: 'Tambah kosakata bahasa Jepang.',
      route: '/vocabulary',
    },
    {
      name: 'Grammar N5',
      icon: '文',
      progress: grammar,
      description: 'Pelajari pola kalimat bahasa Jepang.',
      route: '/grammar',
    },
    {
      name: 'Kanji N5',
      icon: '漢',
      progress: kanji,
      description: 'Pelajari Kanji dasar bahasa Jepang.',
      route: '/kanji',
    },
  ];

  const completedMaterials = materials.filter((material) => material.progress >= 100).length;

  const unfinishedMaterials = materials.filter((material) => material.progress < 100);

  const nextMaterial = unfinishedMaterials.length > 0 ? unfinishedMaterials.reduce((lowest, current) => (current.progress < lowest.progress ? current : lowest)) : materials[0];

  return (
    <div className="dashboard-page">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">J</div>

          <div>
            <h2>JAPALTI</h2>
            <span>Learning Platform</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <a className="active">⌂ Dashboard</a>

          <a onClick={() => navigate('/learning')}>📖 Belajar</a>

          <a onClick={() => navigate('/quiz')}>📝 Quiz</a>

          <a onClick={() => navigate('/daily-quest')}>🎯 Daily Quest</a>

          <a onClick={() => navigate('/roadmap')}>🗺️ Roadmap</a>

          <a onClick={() => navigate('/review')}>🔄 Review</a>
        </nav>

        <div className="sidebar-bottom">
          <a onClick={() => navigate('/settings')}>⚙️ Pengaturan</a>

          <a onClick={() => navigate('/')}>🚪 Keluar</a>
        </div>
      </aside>

      {/* MAIN */}

      <main className="dashboard-main">
        {/* TOPBAR */}

        <header className="topbar">
          <div>
            <p className="welcome-small">Dashboard</p>

            <h1>Selamat datang! 👋</h1>
          </div>

          <div className="profile">
            <div className="profile-avatar">{name.charAt(0).toUpperCase()}</div>

            <div>
              <strong>{name}</strong>
              <span>Level {level}</span>
            </div>
          </div>
        </header>

        {/* STATS */}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>

            <div>
              <span>Total XP</span>
              <h2>{xp} XP</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>

            <div>
              <span>Streak</span>
              <h2>{streak} Hari</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>

            <div>
              <span>Level</span>
              <h2>Level {level}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📚</div>

            <div>
              <span>Materi Selesai</span>
              <h2>{completedMaterials} / 5</h2>
            </div>
          </div>
        </section>

        {/* CONTENT */}

        <section className="content-grid">
          {/* CONTINUE LEARNING */}

          <div className="panel continue-panel">
            <div className="panel-header">
              <div>
                <span className="section-label">LANJUTKAN BELAJAR</span>

                <h2>Mulai dari sini</h2>
              </div>
            </div>

            <div className="learning-card">
              <div className="learning-icon">{nextMaterial.icon}</div>

              <div className="learning-info">
                <h3>{nextMaterial.name}</h3>

                <p>{nextMaterial.description}</p>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${nextMaterial.progress}%`,
                    }}
                  />
                </div>

                <span>{nextMaterial.progress}% selesai</span>
              </div>

              <button onClick={() => navigate(nextMaterial.route)}>{nextMaterial.progress === 0 ? 'Mulai →' : 'Lanjut →'}</button>
            </div>
          </div>

          {/* DAILY QUEST */}

          <div className="panel quest-panel">
            <div className="panel-header">
              <div>
                <span className="section-label">HARI INI</span>

                <h2>Daily Quest 🎯</h2>
              </div>
            </div>

            {/* VOCABULARY QUEST */}

            <div
              className={`quest-item ${vocabularyQuestCompleted ? 'completed' : ''}`}
              onClick={() => navigate('/vocabulary')}
            >
              <span className="quest-check">{vocabularyQuestCompleted ? '✓' : '○'}</span>

              <div>
                <strong>Pelajari 5 kosakata</strong>

                <p>{vocabularyQuestCompleted ? 'Selesai!' : `${vocabularyQuestCount} / 5 kosakata`}</p>
              </div>

              <span className="quest-xp"></span>
            </div>

            {/* QUIZ QUEST */}

            <div
              className={`quest-item ${quizCompleted ? 'completed' : ''}`}
              onClick={() => navigate('/quiz')}
            >
              <span className="quest-check">{quizCompleted ? '✓' : '○'}</span>

              <div>
                <strong>Selesaikan 1 quiz</strong>

                <p>{quizCompleted ? 'Selesai!' : 'Kerjakan quiz hari ini'}</p>
              </div>

              <span className="quest-xp"></span>
            </div>

            {/* STUDY TIMER QUEST */}

            <div
              className={`quest-item ${studyCompleted ? 'completed' : ''}`}
              onClick={() => navigate('/vocabulary')}
            >
              <span className="quest-check">{studyCompleted ? '✓' : '○'}</span>

              <div>
                <strong>Belajar selama 10 menit</strong>

                <p>{studyCompleted ? 'Selesai!' : 'Target 10 menit'}</p>
              </div>

              <span className="quest-xp"></span>
            </div>
          </div>
        </section>

        {/* MATERIAL */}

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="section-label">MATERI</span>

              <h2>Belajar Bahasa Jepang</h2>
            </div>

            <button
              className="view-all"
              onClick={() => navigate('/learning')}
            >
              Lihat semua →
            </button>
          </div>

          <div className="lesson-grid">
            {materials.map((material) => (
              <div
                className="lesson-card"
                key={material.name}
                onClick={() => navigate(material.route)}
              >
                <div className="lesson-icon">{material.icon}</div>

                <h3>{material.name}</h3>

                <p>{material.description}</p>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${material.progress}%`,
                    }}
                  />
                </div>

                <span>{material.progress}% selesai</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
