import { useEffect, useState } from 'react';
import './Vocabulary.css';
import { startStudyTimer } from '../studyTimer';

const vocabulary = [
  {
    word: 'こんにちは',
    reading: 'Konnichiwa',
    meaning: 'Halo / Selamat siang',
    category: 'Salam',
  },
  {
    word: 'ありがとう',
    reading: 'Arigatou',
    meaning: 'Terima kasih',
    category: 'Salam',
  },
  {
    word: '学校',
    reading: 'Gakkou',
    meaning: 'Sekolah',
    category: 'Sekolah',
  },
  {
    word: '先生',
    reading: 'Sensei',
    meaning: 'Guru',
    category: 'Sekolah',
  },
  {
    word: '学生',
    reading: 'Gakusei',
    meaning: 'Siswa / Pelajar',
    category: 'Sekolah',
  },
  {
    word: '友達',
    reading: 'Tomodachi',
    meaning: 'Teman',
    category: 'Keluarga & Teman',
  },
  {
    word: '家族',
    reading: 'Kazoku',
    meaning: 'Keluarga',
    category: 'Keluarga & Teman',
  },
  {
    word: '父',
    reading: 'Chichi',
    meaning: 'Ayah',
    category: 'Keluarga & Teman',
  },
  {
    word: '母',
    reading: 'Haha',
    meaning: 'Ibu',
    category: 'Keluarga & Teman',
  },
  {
    word: '水',
    reading: 'Mizu',
    meaning: 'Air',
    category: 'Makanan',
  },
  {
    word: 'ご飯',
    reading: 'Gohan',
    meaning: 'Nasi / Makanan',
    category: 'Makanan',
  },
  {
    word: '電車',
    reading: 'Densha',
    meaning: 'Kereta',
    category: 'Transportasi',
  },
];

const categories = ['Semua', 'Salam', 'Sekolah', 'Keluarga & Teman', 'Makanan', 'Transportasi'];

function Vocabulary() {
  const [category, setCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [studySeconds, setStudySeconds] = useState(0);
  const [studyCompleted, setStudyCompleted] = useState(false);
  const [speakingWord, setSpeakingWord] = useState(null);

  useEffect(() => {
    const stopTimer = startStudyTimer(
      (seconds) => {
        setStudySeconds(seconds);
      },
      () => {
        setStudyCompleted(true);
      },
    );

    return () => {
      stopTimer();
    };
  }, []);

  // =========================
  // SUARA BAHASA JEPANG
  // =========================
  function speakJapanese(text) {
    if (!('speechSynthesis' in window)) {
      alert('Browser kamu tidak mendukung fitur suara 😭');
      return;
    }

    // Hentikan suara sebelumnya kalau masih berjalan
    window.speechSynthesis.cancel();

    setSpeakingWord(text);

    const speak = () => {
      const voices = window.speechSynthesis.getVoices();

      // Cari voice Jepang
      const japaneseVoice = voices.find((voice) => voice.lang === 'ja-JP') || voices.find((voice) => voice.lang.startsWith('ja'));

      const utterance = new SpeechSynthesisUtterance(text);

      // Bahasa Jepang
      utterance.lang = 'ja-JP';

      // Kecepatan sedikit diperlambat supaya enak buat belajar
      utterance.rate = 0.8;

      // Pitch normal
      utterance.pitch = 1;

      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      }

      utterance.onend = () => {
        setSpeakingWord(null);
      };

      utterance.onerror = () => {
        setSpeakingWord(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }

  const filteredVocabulary = vocabulary.filter((item) => {
    const matchCategory = category === 'Semua' || item.category === category;

    const searchText = `${item.word} ${item.reading} ${item.meaning}`.toLowerCase();

    const matchSearch = searchText.includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const minutes = Math.floor(studySeconds / 60);
  const seconds = studySeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="vocabulary-page">
      <header className="vocabulary-header">
        <div>
          <span className="section-label">JAPALTI • VOCABULARY</span>

          <h1>Kotoba 単語</h1>

          <p>Pelajari kosakata bahasa Jepang berdasarkan tema.</p>
        </div>

        <button
          className="back-button"
          onClick={() => {
            window.location.href = '/learning';
          }}
        >
          ← Kembali
        </button>
      </header>

      <main className="vocabulary-container">
        <div className="study-timer-card">
          <div>
            <strong>{studyCompleted ? '🎉 Quest belajar selesai!' : '⏱️ Waktu belajar hari ini'}</strong>

            <span>{formattedTime} / 10:00</span>
          </div>

          <div className="study-timer-bar">
            <div
              style={{
                width: `${Math.min((studySeconds / 600) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Cari kosakata..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-list">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? 'category active' : 'category'}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="vocabulary-count">
          Menampilkan <strong>{filteredVocabulary.length}</strong> kosakata
        </div>

        <div className="vocabulary-grid">
          {filteredVocabulary.map((item) => (
            <div
              className="word-card"
              key={`${item.word}-${item.category}`}
            >
              <div className="word-top">
                <span className="word-category">{item.category}</span>

                <button
                  type="button"
                  className={speakingWord === item.word ? 'speaker speaking' : 'speaker'}
                  onClick={() => speakJapanese(item.word)}
                  aria-label={`Dengarkan ${item.word}`}
                  title="Dengarkan pengucapan"
                >
                  🔊
                </button>
              </div>

              <h2>{item.word}</h2>

              <p className="reading">{item.reading}</p>

              <p className="meaning">{item.meaning}</p>
            </div>
          ))}
        </div>

        {filteredVocabulary.length === 0 && (
          <div className="empty-vocabulary">
            <div>🔎</div>

            <h2>Kosakata tidak ditemukan</h2>

            <p>Coba gunakan kata pencarian yang lain.</p>
          </div>
        )}

        <div className="vocabulary-practice">
          <div>
            <span className="section-label">LATIHAN</span>

            <h2>Sudah hafal kosakatanya?</h2>

            <p>Uji kemampuanmu melalui quiz vocabulary.</p>
          </div>

          <button
            onClick={() => {
              window.location.href = '/vocabulary-quiz';
            }}
          >
            Mulai Quiz →
          </button>
        </div>
      </main>
    </div>
  );
}

export default Vocabulary;
