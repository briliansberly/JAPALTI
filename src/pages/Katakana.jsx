import { useEffect, useState } from 'react';
import { startStudyTimer } from '../studyTimer';
import './Katakana.css';

const katakana = [
  { kana: 'ア', romaji: 'a' },
  { kana: 'イ', romaji: 'i' },
  { kana: 'ウ', romaji: 'u' },
  { kana: 'エ', romaji: 'e' },
  { kana: 'オ', romaji: 'o' },

  { kana: 'カ', romaji: 'ka' },
  { kana: 'キ', romaji: 'ki' },
  { kana: 'ク', romaji: 'ku' },
  { kana: 'ケ', romaji: 'ke' },
  { kana: 'コ', romaji: 'ko' },

  { kana: 'サ', romaji: 'sa' },
  { kana: 'シ', romaji: 'shi' },
  { kana: 'ス', romaji: 'su' },
  { kana: 'セ', romaji: 'se' },
  { kana: 'ソ', romaji: 'so' },

  { kana: 'タ', romaji: 'ta' },
  { kana: 'チ', romaji: 'chi' },
  { kana: 'ツ', romaji: 'tsu' },
  { kana: 'テ', romaji: 'te' },
  { kana: 'ト', romaji: 'to' },

  { kana: 'ナ', romaji: 'na' },
  { kana: 'ニ', romaji: 'ni' },
  { kana: 'ヌ', romaji: 'nu' },
  { kana: 'ネ', romaji: 'ne' },
  { kana: 'ノ', romaji: 'no' },

  { kana: 'ハ', romaji: 'ha' },
  { kana: 'ヒ', romaji: 'hi' },
  { kana: 'フ', romaji: 'fu' },
  { kana: 'ヘ', romaji: 'he' },
  { kana: 'ホ', romaji: 'ho' },

  { kana: 'マ', romaji: 'ma' },
  { kana: 'ミ', romaji: 'mi' },
  { kana: 'ム', romaji: 'mu' },
  { kana: 'メ', romaji: 'me' },
  { kana: 'モ', romaji: 'mo' },

  { kana: 'ヤ', romaji: 'ya' },
  { kana: 'ユ', romaji: 'yu' },
  { kana: 'ヨ', romaji: 'yo' },

  { kana: 'ラ', romaji: 'ra' },
  { kana: 'リ', romaji: 'ri' },
  { kana: 'ル', romaji: 'ru' },
  { kana: 'レ', romaji: 're' },
  { kana: 'ロ', romaji: 'ro' },

  { kana: 'ワ', romaji: 'wa' },
  { kana: 'ヲ', romaji: 'wo' },
  { kana: 'ン', romaji: 'n' },
];

function Katakana() {
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const stopTimer = startStudyTimer();

    return () => {
      stopTimer();
    };
  }, []);

  return (
    <div className="katakana-page">
      <header className="katakana-header">
        <div>
          <span className="section-label">JAPALTI • KANA</span>

          <h1>Katakana カ</h1>

          <p>Kenali karakter Katakana dasar bahasa Jepang.</p>
        </div>

        <button
          className="back-button"
          onClick={() => (window.location.href = '/learning')}
        >
          ← Kembali
        </button>
      </header>

      {selected && (
        <div className="selected-kana">
          <div className="selected-character">{selected.kana}</div>

          <div>
            <span>Karakter yang dipilih</span>

            <h2>{selected.romaji}</h2>

            <p>
              {selected.kana} dibaca "{selected.romaji}".
            </p>
          </div>

          <button onClick={() => setSelected(null)}>Tutup</button>
        </div>
      )}

      <section className="kana-panel">
        <div className="panel-heading">
          <div>
            <span className="section-label">KANA TABLE</span>

            <h2>46 Katakana Dasar</h2>
          </div>

          <span className="kana-count">{katakana.length} karakter</span>
        </div>

        <div className="kana-grid">
          {katakana.map((item) => (
            <button
              className="kana-card"
              key={item.kana}
              onClick={() => setSelected(item)}
            >
              <strong>{item.kana}</strong>
              <span>{item.romaji}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="practice-card">
        <div>
          <span className="section-label">NEXT STEP</span>

          <h2>Sudah siap latihan?</h2>

          <p>Uji kemampuanmu membaca Katakana.</p>
        </div>

        <button onClick={() => (window.location.href = '/katakana-practice')}>Mulai Latihan →</button>
      </section>
    </div>
  );
}

export default Katakana;
