import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Roadmap.css';

import { getQuizBestScore, isQuizPassed } from '../levelSystem';

import { getHiraganaProgress, getKatakanaProgress, getVocabularyProgress, getGrammarProgress, getKanjiProgress } from '../progress';

const roadmapItems = [
  {
    id: 'hiragana',
    type: 'material',
    title: 'Hiragana Basic',
    subtitle: 'あ',
    description: 'Pelajari Hiragana dasar',
    route: '/hiragana',
    icon: 'あ',
  },
  {
    id: 'hiragana-quiz',
    type: 'quiz',
    title: 'Hiragana Quiz',
    subtitle: 'あ',
    description: 'Selesaikan dengan nilai 100%',
    route: '/hiragana-quiz',
    icon: 'あ',
  },
  {
    id: 'katakana',
    type: 'material',
    title: 'Katakana Basic',
    subtitle: 'カ',
    description: 'Pelajari Katakana dasar',
    route: '/katakana',
    icon: 'カ',
  },
  {
    id: 'katakana-quiz',
    type: 'quiz',
    title: 'Katakana Quiz',
    subtitle: 'カ',
    description: 'Selesaikan dengan nilai 100%',
    route: '/katakana-quiz',
    icon: 'カ',
  },
  {
    id: 'vocabulary',
    type: 'material',
    title: 'Vocabulary N5',
    subtitle: '語',
    description: 'Mulai mengenal kosakata',
    route: '/vocabulary',
    icon: '語',
  },
  {
    id: 'vocabulary-quiz',
    type: 'quiz',
    title: 'Vocabulary Quiz',
    subtitle: '語',
    description: 'Selesaikan dengan nilai 100%',
    route: '/vocabulary-quiz',
    icon: '語',
  },
  {
    id: 'grammar',
    type: 'material',
    title: 'Grammar N5',
    subtitle: '文',
    description: 'Pelajari pola kalimat dasar',
    route: '/grammar',
    icon: '文',
  },
  {
    id: 'grammar-quiz',
    type: 'quiz',
    title: 'Grammar Quiz',
    subtitle: '文',
    description: 'Selesaikan dengan nilai 100%',
    route: '/grammar-quiz',
    icon: '文',
  },
  {
    id: 'kanji',
    type: 'material',
    title: 'Kanji N5',
    subtitle: '漢',
    description: 'Pelajari Kanji dasar',
    route: '/kanji',
    icon: '漢',
  },
  {
    id: 'kanji-quiz',
    type: 'quiz',
    title: 'Kanji Quiz',
    subtitle: '漢',
    description: 'Selesaikan dengan nilai 100%',
    route: '/kanji-quiz',
    icon: '漢',
  },
];

function Roadmap() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState({
    hiragana: 0,
    katakana: 0,
    vocabulary: 0,
    grammar: 0,
    kanji: 0,
  });

  const [quizScores, setQuizScores] = useState({});

  function loadProgress() {
    setProgress({
      hiragana: getHiraganaProgress(),
      katakana: getKatakanaProgress(),
      vocabulary: getVocabularyProgress(),
      grammar: getGrammarProgress(),
      kanji: getKanjiProgress(),
    });

    setQuizScores({
      hiragana: getQuizBestScore('hiragana'),
      katakana: getQuizBestScore('katakana'),
      vocabulary: getQuizBestScore('vocabulary'),
      grammar: getQuizBestScore('grammar'),
      kanji: getQuizBestScore('kanji'),
    });
  }

  useEffect(() => {
    loadProgress();

    window.addEventListener('pageshow', loadProgress);
    window.addEventListener('focus', loadProgress);

    return () => {
      window.removeEventListener('pageshow', loadProgress);
      window.removeEventListener('focus', loadProgress);
    };
  }, []);

  function isCompleted(item) {
    if (item.type === 'quiz') {
      return isQuizPassed(item.id.replace('-quiz', ''));
    }

    return progress[item.id] >= 100;
  }

  /*
    Level 1 selesai kalau SEMUA quiz
    sudah mendapatkan nilai 100%.
  */
  const level1Complete = isQuizPassed('hiragana') && isQuizPassed('katakana') && isQuizPassed('vocabulary') && isQuizPassed('grammar') && isQuizPassed('kanji');

  /*
    Cari node pertama yang belum selesai.
    Node itu menjadi NEXT UP.
  */
  const nextItem = roadmapItems.find((item) => !isCompleted(item));

  function isLocked(item) {
    const index = roadmapItems.findIndex((roadmapItem) => roadmapItem.id === item.id);

    if (index === 0) {
      return false;
    }

    const previousItem = roadmapItems[index - 1];

    return !isCompleted(previousItem);
  }

  function handleNodeClick(item) {
    if (isLocked(item)) {
      return;
    }

    navigate(item.route);
  }

  const completedCount = roadmapItems.filter(isCompleted).length;
  const roadmapPercentage = Math.round((completedCount / roadmapItems.length) * 100);

  return (
    <div className="roadmap-page">
      {/* SIDEBAR */}

      <aside className="roadmap-sidebar">
        <div className="roadmap-brand">
          <div className="roadmap-brand-logo">J</div>

          <div>
            <h2>JAPALTI</h2>
            <span>Learning Platform</span>
          </div>
        </div>

        <nav className="roadmap-sidebar-menu">
          <button onClick={() => navigate('/dashboard')}>⌂ Dashboard</button>

          <button onClick={() => navigate('/learning')}>📖 Belajar</button>

          <button onClick={() => navigate('/quiz')}>📝 Quiz</button>

          <button className="active">🗺️ Roadmap</button>

          <button onClick={() => navigate('/daily-quest')}>🎯 Daily Quest</button>

          <button onClick={() => navigate('/review')}>🔄 Review</button>
        </nav>

        <div className="roadmap-sidebar-bottom">
          <button onClick={() => navigate('/settings')}>⚙️ Pengaturan</button>

          <button onClick={() => navigate('/')}>🚪 Keluar</button>
        </div>
      </aside>

      {/* MAIN */}

      <main className="roadmap-main">
        <header className="roadmap-header">
          <div>
            <span className="roadmap-label">JAPALTI • ROADMAP</span>

            <h1>Roadmap</h1>

            <p>Master Japanese step by step.</p>
          </div>

          <div className="roadmap-progress-box">
            <span>Progress</span>
            <strong>{roadmapPercentage}%</strong>
          </div>
        </header>

        {/* LEVEL 1 */}

        <section className="roadmap-section">
          <div className="roadmap-section-title">
            <span className="roadmap-line" />

            <div className="roadmap-level-badge">LEVEL 1 • KANA & N5</div>

            <span className="roadmap-line" />
          </div>

          <p className="roadmap-section-subtitle">Foundation — kuasai dasar bahasa Jepang</p>

          <div className="roadmap-track">
            <div className="roadmap-path">
              <svg
                viewBox="0 0 1000 1250"
                preserveAspectRatio="none"
              >
                <path
                  d="
                    M500 70
                    C500 160 780 150 780 270
                    C780 390 220 370 220 500
                    C220 630 780 610 780 740
                    C780 870 220 850 220 980
                    C220 1080 500 1080 500 1190
                  "
                />
              </svg>
            </div>

            {roadmapItems.map((item, index) => {
              const completed = isCompleted(item);
              const locked = isLocked(item);
              const isNext = nextItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`roadmap-node-wrapper node-${index} ${completed ? 'completed' : ''} ${locked ? 'locked' : ''} ${isNext ? 'next' : ''}`}
                >
                  {isNext && <div className="next-badge">NEXT UP!</div>}

                  <button
                    className="roadmap-node"
                    onClick={() => handleNodeClick(item)}
                    disabled={locked}
                  >
                    <span className="node-icon">{locked ? '🔒' : item.icon}</span>
                  </button>

                  <div className="roadmap-node-info">
                    <strong>{item.title}</strong>

                    <span>{completed ? 'Completed ✓' : locked ? 'Locked' : item.description}</span>

                    {item.type === 'quiz' && <small>Best score: {quizScores[item.id.replace('-quiz', '')] || 0}%</small>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* NEXT LEVEL */}

        <section className={`next-level-card ${level1Complete ? 'unlocked' : ''}`}>
          <div className="next-level-icon">{level1Complete ? '🎉' : '🔒'}</div>

          <div>
            <span className="roadmap-label">LEVEL 2</span>

            <h2>First Words</h2>

            <p>{level1Complete ? 'Level 2 sudah terbuka! Saatnya mulai membangun kosakata dan kalimat.' : 'Selesaikan semua quiz Level 1 dengan nilai 100% untuk membuka level ini.'}</p>
          </div>

          <button
            disabled={!level1Complete}
            onClick={() => navigate('/learning')}
          >
            {level1Complete ? 'Mulai Level 2 →' : 'Terkunci 🔒'}
          </button>
        </section>
      </main>
    </div>
  );
}

export default Roadmap;
