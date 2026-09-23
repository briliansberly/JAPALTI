import { useEffect, useState } from 'react';
import { startStudyTimer } from '../studyTimer';
import './Hiragana.css';

const hiragana = [
  { kana: 'あ', romaji: 'a' },
  { kana: 'い', romaji: 'i' },
  { kana: 'う', romaji: 'u' },
  { kana: 'え', romaji: 'e' },
  { kana: 'お', romaji: 'o' },

  { kana: 'か', romaji: 'ka' },
  { kana: 'き', romaji: 'ki' },
  { kana: 'く', romaji: 'ku' },
  { kana: 'け', romaji: 'ke' },
  { kana: 'こ', romaji: 'ko' },

  { kana: 'さ', romaji: 'sa' },
  { kana: 'し', romaji: 'shi' },
  { kana: 'す', romaji: 'su' },
  { kana: 'せ', romaji: 'se' },
  { kana: 'そ', romaji: 'so' },

  { kana: 'た', romaji: 'ta' },
  { kana: 'ち', romaji: 'chi' },
  { kana: 'つ', romaji: 'tsu' },
  { kana: 'て', romaji: 'te' },
  { kana: 'と', romaji: 'to' },

  { kana: 'な', romaji: 'na' },
  { kana: 'に', romaji: 'ni' },
  { kana: 'ぬ', romaji: 'nu' },
  { kana: 'ね', romaji: 'ne' },
  { kana: 'の', romaji: 'no' },

  { kana: 'は', romaji: 'ha' },
  { kana: 'ひ', romaji: 'hi' },
  { kana: 'ふ', romaji: 'fu' },
  { kana: 'へ', romaji: 'he' },
  { kana: 'ほ', romaji: 'ho' },

  { kana: 'ま', romaji: 'ma' },
  { kana: 'み', romaji: 'mi' },
  { kana: 'む', romaji: 'mu' },
  { kana: 'め', romaji: 'me' },
  { kana: 'も', romaji: 'mo' },

  { kana: 'や', romaji: 'ya' },
  { kana: 'ゆ', romaji: 'yu' },
  { kana: 'よ', romaji: 'yo' },

  { kana: 'ら', romaji: 'ra' },
  { kana: 'り', romaji: 'ri' },
  { kana: 'る', romaji: 'ru' },
  { kana: 'れ', romaji: 're' },
  { kana: 'ろ', romaji: 'ro' },

  { kana: 'わ', romaji: 'wa' },
  { kana: 'を', romaji: 'wo' },
  { kana: 'ん', romaji: 'n' },
];

function Hiragana() {
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const stopTimer = startStudyTimer();

    return () => {
      stopTimer();
    };
  }, []);

  return (
    <div className="hiragana-page">
      <header className="hiragana-header">
        <div>
          <span className="section-label">JAPALTI • KANA</span>
          <h1>Hiragana あ</h1>
          <p>Kenali karakter Hiragana dasar bahasa Jepang.</p>
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
            <h2>46 Hiragana Dasar</h2>
          </div>

          <span className="kana-count">{hiragana.length} karakter</span>
        </div>

        <div className="kana-grid">
          {hiragana.map((item) => (
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
          <p>Setelah mengenal karakter, lanjutkan ke latihan membaca Hiragana.</p>
        </div>

        <button onClick={() => (window.location.href = '/hiragana-practice')}>Mulai Latihan →</button>
      </section>
    </div>
  );
}

export default Hiragana;
