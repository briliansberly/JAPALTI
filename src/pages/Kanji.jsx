import { useEffect, useState } from 'react';
import { startStudyTimer } from '../studyTimer';
import './Kanji.css';

const kanjiList = [
  {
    kanji: '日',
    meaning: 'Hari / Matahari',
    onyomi: 'ニチ (nichi)',
    kunyomi: 'ひ (hi)',
    example: '日本 (にほん) = Jepang',
  },
  {
    kanji: '月',
    meaning: 'Bulan',
    onyomi: 'ゲツ (getsu)',
    kunyomi: 'つき (tsuki)',
    example: '月曜日 (げつようび) = Senin',
  },
  {
    kanji: '火',
    meaning: 'Api',
    onyomi: 'カ (ka)',
    kunyomi: 'ひ (hi)',
    example: '火曜日 (かようび) = Selasa',
  },
  {
    kanji: '水',
    meaning: 'Air',
    onyomi: 'スイ (sui)',
    kunyomi: 'みず (mizu)',
    example: '水曜日 (すいようび) = Rabu',
  },
  {
    kanji: '木',
    meaning: 'Pohon / Kayu',
    onyomi: 'モク (moku)',
    kunyomi: 'き (ki)',
    example: '木曜日 (もくようび) = Kamis',
  },
  {
    kanji: '金',
    meaning: 'Emas / Uang',
    onyomi: 'キン (kin)',
    kunyomi: 'かね (kane)',
    example: '金曜日 (きんようび) = Jumat',
  },
  {
    kanji: '土',
    meaning: 'Tanah',
    onyomi: 'ド (do)',
    kunyomi: 'つち (tsuchi)',
    example: '土曜日 (どようび) = Sabtu',
  },
  {
    kanji: '人',
    meaning: 'Orang',
    onyomi: 'ジン (jin)',
    kunyomi: 'ひと (hito)',
    example: '日本人 (にほんじん) = Orang Jepang',
  },
  {
    kanji: '大',
    meaning: 'Besar',
    onyomi: 'ダイ (dai)',
    kunyomi: 'おお (oo)',
    example: '大学 (だいがく) = Universitas',
  },
  {
    kanji: '小',
    meaning: 'Kecil',
    onyomi: 'ショウ (shou)',
    kunyomi: 'ちい (chii)',
    example: '小学校 (しょうがっこう) = Sekolah Dasar',
  },
  {
    kanji: '山',
    meaning: 'Gunung',
    onyomi: 'サン (san)',
    kunyomi: 'やま (yama)',
    example: '富士山 (ふじさん) = Gunung Fuji',
  },
  {
    kanji: '川',
    meaning: 'Sungai',
    onyomi: 'セン (sen)',
    kunyomi: 'かわ (kawa)',
    example: '川 (かわ) = Sungai',
  },
];

function Kanji() {
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const stopTimer = startStudyTimer();

    return () => {
      stopTimer();
    };
  }, []);

  return (
    <div className="kanji-page">
      <header className="kanji-header">
        <div>
          <span className="section-label">JAPALTI • KANJI</span>

          <h1>Kanji N5 漢字</h1>

          <p>Kenali kanji dasar bahasa Jepang untuk pemula.</p>
        </div>

        <button
          className="back-button"
          onClick={() => {
            window.location.href = '/dashboard';
          }}
        >
          ← Kembali
        </button>
      </header>

      <main className="kanji-container">
        <div className="kanji-info">
          <div>
            <span className="section-label">MATERI</span>

            <h2>Kanji Dasar</h2>
          </div>

          <span>{kanjiList.length} Kanji</span>
        </div>

        <div className="kanji-grid">
          {kanjiList.map((item) => (
            <button
              className="kanji-card"
              key={item.kanji}
              onClick={() => setSelected(item)}
            >
              <strong>{item.kanji}</strong>

              <span>{item.meaning}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="kanji-detail">
            <div className="detail-kanji">{selected.kanji}</div>

            <div className="detail-content">
              <span className="section-label">DETAIL KANJI</span>

              <h2>{selected.meaning}</h2>

              <div className="reading">
                <div>
                  <small>ONYOMI</small>
                  <strong>{selected.onyomi}</strong>
                </div>

                <div>
                  <small>KUNYOMI</small>
                  <strong>{selected.kunyomi}</strong>
                </div>
              </div>

              <p>
                <strong>Contoh:</strong> {selected.example}
              </p>

              <button onClick={() => setSelected(null)}>Tutup</button>
            </div>
          </div>
        )}

        <div className="kanji-practice">
          <div>
            <span className="section-label">LATIHAN</span>

            <h2>Sudah siap latihan menulis Kanji?</h2>

            <p>Latih kemampuan menulis Kanji dengan mengikuti bentuk panduan.</p>
          </div>

          <button
            onClick={() => {
              window.location.href = '/kanji-practice';
            }}
          >
            Mulai Latihan →
          </button>
        </div>
      </main>
    </div>
  );
}

export default Kanji;
