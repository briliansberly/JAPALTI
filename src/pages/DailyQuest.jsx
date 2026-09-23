import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './DailyQuest.css';

import { getXP, isQuizQuestCompleted } from '../progress';

import { getVocabularyQuestCount, isVocabularyQuestCompleted } from '../dailyQuest';

import { getStudySeconds, isStudyQuestCompleted } from '../studyTimer';

function DailyQuest() {
  const navigate = useNavigate();

  const [xp, setXp] = useState(getXP());

  const [vocabularyCount, setVocabularyCount] = useState(getVocabularyQuestCount());

  const [vocabularyCompleted, setVocabularyCompleted] = useState(isVocabularyQuestCompleted());

  const [quizCompleted, setQuizCompleted] = useState(isQuizQuestCompleted());

  const [studySeconds, setStudySeconds] = useState(getStudySeconds());

  const [studyCompleted, setStudyCompleted] = useState(isStudyQuestCompleted());

  const refreshQuest = () => {
    setXp(getXP());

    setVocabularyCount(getVocabularyQuestCount());
    setVocabularyCompleted(isVocabularyQuestCompleted());

    setQuizCompleted(isQuizQuestCompleted());

    setStudySeconds(getStudySeconds());
    setStudyCompleted(isStudyQuestCompleted());
  };

  useEffect(() => {
    refreshQuest();

    const handleFocus = () => {
      refreshQuest();
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshQuest();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const studyMinutes = Math.floor(studySeconds / 60);
  const studyRemainingSeconds = studySeconds % 60;

  const formattedStudyTime = `${String(studyMinutes).padStart(2, '0')}:${String(studyRemainingSeconds).padStart(2, '0')}`;

  const vocabularyProgress = Math.min((vocabularyCount / 5) * 100, 100);

  const studyProgress = Math.min((studySeconds / 600) * 100, 100);

  const completedQuestCount = (vocabularyCompleted ? 1 : 0) + (quizCompleted ? 1 : 0) + (studyCompleted ? 1 : 0);

  return (
    <div className="daily-quest-page">
      <header className="daily-quest-header">
        <button
          className="back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>

        <div className="daily-quest-header-content">
          <div className="daily-quest-title-row">
            <div>
              <span className="daily-quest-label">JAPALTI • DAILY QUEST</span>

              <h1>Daily Quest 🎯</h1>

              <p>Selesaikan misi hari ini dan kumpulkan XP tambahan.</p>
            </div>

            <div className="daily-xp-card">
              <span>XP Kamu</span>
              <strong>⭐ {xp} XP</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="daily-quest-main">
        <section className="daily-overview">
          <div className="overview-left">
            <div className="overview-icon">🔥</div>

            <div>
              <span className="overview-label">QUEST HARI INI</span>

              <h2>{completedQuestCount === 3 ? 'Semua quest selesai!' : `${completedQuestCount} / 3 quest selesai`}</h2>

              <p>{completedQuestCount === 3 ? 'Mantap! Kamu berhasil menyelesaikan semua misi hari ini.' : 'Selesaikan semua quest untuk mendapatkan total 90 XP.'}</p>
            </div>
          </div>

          <div className="overview-reward">
            <span>Total Reward</span>
            <strong>+90 XP</strong>
          </div>
        </section>

        <section className="quest-list">
          <div className="section-heading">
            <div>
              <span className="section-label">MISI HARI INI</span>
              <h2>3 Quest untuk kamu</h2>
            </div>

            <span className="quest-date">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>
          </div>

          {/* VOCABULARY QUEST */}
          <article className={`daily-quest-card ${vocabularyCompleted ? 'completed' : ''}`}>
            <div className="quest-card-icon vocabulary">📚</div>

            <div className="quest-card-content">
              <div className="quest-card-top">
                <div>
                  <span className="quest-type">VOCABULARY</span>

                  <h3>Pelajari 5 Kosakata</h3>

                  <p>Tingkatkan kemampuan kosakatamu dengan mempelajari kata-kata baru.</p>
                </div>

                <div className="quest-reward">
                  <span>Reward</span>
                  <strong>+20 XP</strong>
                </div>
              </div>

              <div className="quest-progress-info">
                <span>{vocabularyCompleted ? 'Selesai' : `${vocabularyCount} / 5 kosakata`}</span>

                <span>{Math.round(vocabularyProgress)}%</span>
              </div>

              <div className="quest-progress-bar">
                <div
                  style={{
                    width: `${vocabularyProgress}%`,
                  }}
                />
              </div>

              <button
                className="quest-action"
                onClick={() => navigate('/vocabulary')}
              >
                {vocabularyCompleted ? 'Pelajari Lagi' : 'Mulai Belajar →'}
              </button>
            </div>

            <div className="quest-status">{vocabularyCompleted ? '✓' : '○'}</div>
          </article>

          {/* QUIZ QUEST */}
          <article className={`daily-quest-card ${quizCompleted ? 'completed' : ''}`}>
            <div className="quest-card-icon quiz">📝</div>

            <div className="quest-card-content">
              <div className="quest-card-top">
                <div>
                  <span className="quest-type">QUIZ</span>

                  <h3>Selesaikan 1 Quiz</h3>

                  <p>Uji pemahamanmu dengan menyelesaikan satu quiz hari ini.</p>
                </div>

                <div className="quest-reward">
                  <span>Reward</span>
                  <strong>+20 XP</strong>
                </div>
              </div>

              <div className="single-quest-status">
                {quizCompleted ? (
                  <>
                    <span className="status-check">✓</span>
                    <span>Quiz hari ini sudah selesai</span>
                  </>
                ) : (
                  <>
                    <span className="status-circle">○</span>
                    <span>Belum selesai</span>
                  </>
                )}
              </div>

              <button
                className="quest-action"
                onClick={() => navigate('/quiz')}
              >
                {quizCompleted ? 'Latihan Lagi' : 'Mulai Quiz →'}
              </button>
            </div>

            <div className="quest-status">{quizCompleted ? '✓' : '○'}</div>
          </article>

          {/* STUDY QUEST */}
          <article className={`daily-quest-card ${studyCompleted ? 'completed' : ''}`}>
            <div className="quest-card-icon study">⏱️</div>

            <div className="quest-card-content">
              <div className="quest-card-top">
                <div>
                  <span className="quest-type">STUDY TIME</span>

                  <h3>Belajar Selama 10 Menit</h3>

                  <p>Luangkan waktu untuk belajar materi JAPALTI hari ini.</p>
                </div>

                <div className="quest-reward">
                  <span>Reward</span>
                  <strong>+50 XP</strong>
                </div>
              </div>

              <div className="quest-progress-info">
                <span>{studyCompleted ? 'Selesai' : `${formattedStudyTime} / 10:00`}</span>

                <span>{Math.round(studyProgress)}%</span>
              </div>

              <div className="quest-progress-bar">
                <div
                  style={{
                    width: `${studyProgress}%`,
                  }}
                />
              </div>

              <button
                className="quest-action"
                onClick={() => navigate('/vocabulary')}
              >
                {studyCompleted ? 'Belajar Lagi' : 'Mulai Belajar →'}
              </button>
            </div>

            <div className="quest-status">{studyCompleted ? '✓' : '○'}</div>
          </article>
        </section>

        <section className="daily-quest-tip">
          <div className="tip-icon">💡</div>

          <div>
            <strong>Tips hari ini</strong>

            <p>Konsisten sedikit demi sedikit lebih baik daripada belajar banyak tapi cuma sesekali. Selesaikan 3 quest hari ini dan lanjutkan streak belajarmu!</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DailyQuest;
