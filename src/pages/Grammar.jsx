import { useState, useEffect } from 'react';
import './Grammar.css';
import { startStudyTimer } from '../studyTimer';

const grammarData = [
  {
    title: 'Pola A は B です',
    pattern: 'A は B です',
    meaning: 'A adalah B',

    explanation: 'Pola kalimat A は B です adalah pola dasar dalam bahasa Jepang untuk menyatakan identitas atau status.',

    parts: [
      {
        symbol: 'A',
        description: 'Subjek atau topik, yaitu orang, benda, atau hal yang sedang dibicarakan.',
      },
      {
        symbol: 'は (wa)',
        description: 'Partikel penanda topik. Ditulis dengan huruf は (ha), tetapi dalam pola ini dibaca wa.',
      },
      {
        symbol: 'B',
        description: 'Keterangan identitas, profesi, atau predikat dari A.',
      },
      {
        symbol: 'です (desu)',
        description: 'Kata penutup yang membuat kalimat menjadi sopan. Dalam pola ini bermakna "adalah".',
      },
    ],

    example: 'わたしは がくせいです。',
    translation: 'Saya adalah seorang siswa.',

    note: 'Perhatikan bahwa は pada pola ini dibaca "wa", bukan "ha".',
  },

  {
    title: 'Pola A は B ではありません',
    pattern: 'A は B ではありません',
    meaning: 'A bukan B',

    explanation: 'Pola ini digunakan untuk menyatakan bahwa seseorang atau sesuatu bukan merupakan B.',

    parts: [
      {
        symbol: 'A',
        description: 'Subjek atau topik yang sedang dibicarakan.',
      },
      {
        symbol: 'は (wa)',
        description: 'Partikel yang menandai topik pembicaraan.',
      },
      {
        symbol: 'B',
        description: 'Identitas, profesi, atau keterangan yang disangkal.',
      },
      {
        symbol: 'ではありません',
        description: 'Bentuk sopan untuk menyatakan bahwa sesuatu bukan B.',
      },
    ],

    example: 'わたしは せんせいではありません。',
    translation: 'Saya bukan seorang guru.',

    note: 'Pola ini merupakan bentuk negatif dari A は B です.',
  },

  {
    title: 'Pola A の B',
    pattern: 'A の B',
    meaning: 'B milik atau berhubungan dengan A',

    explanation: 'Partikel の digunakan untuk menunjukkan hubungan antara A dan B, termasuk kepemilikan.',

    parts: [
      {
        symbol: 'A',
        description: 'Pemilik atau sesuatu yang menjadi sumber hubungan.',
      },
      {
        symbol: 'の',
        description: 'Partikel yang menghubungkan A dengan B.',
      },
      {
        symbol: 'B',
        description: 'Benda atau hal yang dimiliki atau berhubungan dengan A.',
      },
    ],

    example: 'わたしの ほんです。',
    translation: 'Ini adalah buku saya.',

    note: 'Dalam contoh ini, わたし berarti saya dan ほん berarti buku.',
  },

  {
    title: 'Pola A も B です',
    pattern: 'A も B です',
    meaning: 'A juga B',

    explanation: 'Partikel も digunakan ketika ingin menyatakan bahwa A juga memiliki keadaan atau status yang sama.',

    parts: [
      {
        symbol: 'A',
        description: 'Subjek atau topik yang dibicarakan.',
      },
      {
        symbol: 'も',
        description: 'Partikel yang memiliki makna "juga".',
      },
      {
        symbol: 'B',
        description: 'Identitas, status, atau keterangan A.',
      },
      {
        symbol: 'です',
        description: 'Penutup kalimat yang membuat kalimat menjadi sopan.',
      },
    ],

    example: 'わたしも がくせいです。',
    translation: 'Saya juga seorang siswa.',

    note: 'も dapat menggantikan は ketika ingin memberikan makna "juga".',
  },

  {
    title: 'Pola A は B ですか',
    pattern: 'A は B ですか',
    meaning: 'Apakah A adalah B?',

    explanation: 'Pola ini digunakan untuk membuat pertanyaan sederhana mengenai identitas atau status seseorang atau sesuatu.',

    parts: [
      {
        symbol: 'A',
        description: 'Subjek atau topik yang ingin ditanyakan.',
      },
      {
        symbol: 'は (wa)',
        description: 'Partikel penanda topik.',
      },
      {
        symbol: 'B',
        description: 'Identitas atau status yang ditanyakan.',
      },
      {
        symbol: 'ですか',
        description: 'Bentuk yang digunakan untuk membuat pertanyaan secara sopan.',
      },
    ],

    example: 'あなたは がくせいですか。',
    translation: 'Apakah kamu seorang siswa?',

    note: 'Kata か pada akhir kalimat menandakan bahwa kalimat tersebut merupakan pertanyaan.',
  },
];

function Grammar() {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const stopTimer = startStudyTimer();

    return () => {
      stopTimer();
    };
  }, []);

  const lesson = grammarData[selected];

  const speakJapanese = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Browser kamu tidak mendukung fitur suara.');
      return;
    }

    window.speechSynthesis.cancel();

    const speak = () => {
      const voices = window.speechSynthesis.getVoices();

      const japaneseVoice = voices.find((voice) => voice.lang === 'ja-JP') || voices.find((voice) => voice.lang.startsWith('ja'));

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      utterance.pitch = 1;

      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      }

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
  };

  return (
    <div className="grammar-page">
      <header className="grammar-header">
        <div>
          <span className="grammar-label">JAPALTI • GRAMMAR</span>

          <h1>Grammar 文法</h1>

          <p>Pelajari pola kalimat dasar bahasa Jepang.</p>
        </div>

        <button
          className="grammar-back"
          onClick={() => {
            window.location.href = '/learning';
          }}
        >
          ← Kembali
        </button>
      </header>

      <main className="grammar-container">
        <div className="grammar-layout">
          <aside className="grammar-menu">
            <h3>Materi Grammar</h3>

            {grammarData.map((item, index) => (
              <button
                key={item.title}
                className={selected === index ? 'grammar-menu-item active' : 'grammar-menu-item'}
                onClick={() => setSelected(index)}
              >
                <span>{index + 1}</span>
                {item.title}
              </button>
            ))}
          </aside>

          <section className="grammar-content">
            <span className="grammar-number">LESSON {selected + 1}</span>

            <h2>{lesson.title}</h2>

            <div className="pattern-box">
              <span>POLA KALIMAT</span>

              <strong>{lesson.pattern}</strong>

              <p>{lesson.meaning}</p>
            </div>

            <div className="grammar-explanation">
              <h3>📖 Penjelasan</h3>

              <p>{lesson.explanation}</p>
            </div>

            <div className="grammar-parts">
              <h3>🔎 Mengenal Setiap Bagian</h3>

              {lesson.parts.map((part) => (
                <div
                  className="grammar-part"
                  key={part.symbol}
                >
                  <div className="grammar-symbol">{part.symbol}</div>

                  <div>
                    <strong>{part.symbol}</strong>
                    <p>{part.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="example-box">
              <span>CONTOH KALIMAT</span>

              <div className="example-japanese">
                <h3>{lesson.example}</h3>

                <button
                  className="speak-button"
                  onClick={() => speakJapanese(lesson.example)}
                  title="Dengarkan pengucapan"
                >
                  🔊
                </button>
              </div>

              <p>{lesson.translation}</p>
            </div>

            <div className="grammar-tip">
              💡 <strong>Catatan:</strong> {lesson.note}
            </div>

            <button
              className="grammar-quiz-button"
              onClick={() => {
                window.location.href = '/grammar-quiz';
              }}
            >
              Mulai Grammar Quiz →
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Grammar;
