import { useEffect, useRef, useState } from 'react';
import './KanjiPractice.css';

const kanjiList = [
  {
    kanji: '日',
    reading: 'にち / ひ',
    meaning: 'Hari / Matahari',
  },
  {
    kanji: '月',
    reading: 'げつ / つき',
    meaning: 'Bulan',
  },
  {
    kanji: '山',
    reading: 'さん / やま',
    meaning: 'Gunung',
  },
  {
    kanji: '水',
    reading: 'すい / みず',
    meaning: 'Air',
  },
  {
    kanji: '人',
    reading: 'じん / ひと',
    meaning: 'Orang',
  },
  {
    kanji: '大',
    reading: 'だい / おお',
    meaning: 'Besar',
  },
  {
    kanji: '小',
    reading: 'しょう / ちい',
    meaning: 'Kecil',
  },
  {
    kanji: '川',
    reading: 'せん / かわ',
    meaning: 'Sungai',
  },
];

function KanjiPractice() {
  const canvasRef = useRef(null);

  const [current, setCurrent] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [checked, setChecked] = useState(null);

  const character = kanjiList[current];

  useEffect(() => {
    setupCanvas();
  }, [current]);

  function setupCanvas() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const ctx = canvas.getContext('2d');

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#c62828';
  }

  function getPosition(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function startDrawing(event) {
    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const { x, y } = getPosition(event);

    canvas.setPointerCapture(event.pointerId);

    ctx.beginPath();
    ctx.moveTo(x, y);

    setDrawing(true);
    setHasDrawing(true);
    setChecked(null);
  }

  function draw(event) {
    if (!drawing) return;

    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const { x, y } = getPosition(event);

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDrawing() {
    setDrawing(false);
  }

  function clearCanvas() {
    setupCanvas();
    setHasDrawing(false);
    setChecked(null);
  }

  function checkDrawing() {
    if (!hasDrawing) {
      alert('Tulis Kanji-nya dulu ya 😄');
      return;
    }

    /*
      Untuk tahap awal:
      cek apakah user benar-benar membuat
      tulisan di canvas.
    */
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let pixels = 0;

    for (let i = 3; i < image.data.length; i += 4) {
      if (image.data[i] > 30) {
        pixels++;
      }
    }

    if (pixels > 100) {
      setChecked('correct');
    } else {
      setChecked('wrong');
    }
  }

  function nextCharacter() {
    if (current === kanjiList.length - 1) {
      setCurrent(0);
    } else {
      setCurrent((prev) => prev + 1);
    }

    setHasDrawing(false);
    setChecked(null);
  }

  return (
    <div className="kanji-practice-page">
      <header className="practice-header">
        <div>
          <span className="practice-label">JAPALTI • KANJI PRACTICE</span>

          <h1>Latihan Menulis Kanji</h1>

          <p>Ikuti bentuk Kanji lalu tulis di atas panduannya.</p>
        </div>

        <button
          className="practice-back-button"
          onClick={() => {
            window.location.href = '/kanji';
          }}
        >
          ← Kembali
        </button>
      </header>

      <main className="practice-container">
        <div className="practice-progress">
          <span>
            Kanji {current + 1} dari {kanjiList.length}
          </span>

          <div className="practice-progress-track">
            <div
              style={{
                width: `${((current + 1) / kanjiList.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="writing-card">
          <div className="writing-heading">
            <div>
              <span className="practice-label">TULIS KANJI</span>

              <h2>Ikuti bentuk Kanji di bawah</h2>
            </div>

            <div className="character-info">
              <strong>{character.kanji}</strong>

              <div>
                <span>{character.reading}</span>
                <span>{character.meaning}</span>
              </div>
            </div>
          </div>

          <div className="writing-area">
            <div className="guide-character">{character.kanji}</div>

            <canvas
              ref={canvasRef}
              className="drawing-canvas"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
            />

            <div className="writing-hint">Tulis mengikuti bentuk Kanji yang samar ✍️</div>
          </div>

          {checked === 'correct' && (
            <div className="check-feedback correct-feedback">
              <strong>✓ Tulisan sudah dibuat!</strong>

              <span>Kalau sudah puas dengan tulisanmu, lanjut ke Kanji berikutnya.</span>
            </div>
          )}

          {checked === 'wrong' && (
            <div className="check-feedback wrong-feedback">
              <strong>✕ Belum ada tulisan</strong>

              <span>Coba tulis Kanji-nya di area latihan.</span>
            </div>
          )}

          <div className="writing-actions">
            <button
              className="clear-button"
              onClick={clearCanvas}
            >
              ↻ Hapus
            </button>

            <button
              className="check-button"
              onClick={checkDrawing}
            >
              ✓ Cek Tulisan
            </button>

            <button
              className="next-character-button"
              onClick={nextCharacter}
              disabled={checked !== 'correct'}
            >
              Kanji Berikutnya →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default KanjiPractice;
