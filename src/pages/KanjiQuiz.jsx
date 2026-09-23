import { useEffect, useRef, useState } from 'react';
import './KanjiQuiz.css';

const practiceCharacters = [
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
];

function KanjiQuiz() {
  const canvasRef = useRef(null);

  const [current, setCurrent] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [checked, setChecked] = useState(null);

  const character = practiceCharacters[current];

  useEffect(() => {
    setupCanvas();
  }, [current]);

  function setupCanvas() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);

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

  // =========================
  // BUAT MASK KANJI PANDUAN
  // =========================
  function createGuideMask(width, height) {
    const guideCanvas = document.createElement('canvas');

    guideCanvas.width = width;
    guideCanvas.height = height;

    const ctx = guideCanvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    // Ambil ukuran/font dari elemen panduan
    const guideElement = document.querySelector('.guide-character');

    let fontSize = 260;
    let fontFamily = 'Arial, sans-serif';
    let fontWeight = 'bold';

    if (guideElement) {
      const style = window.getComputedStyle(guideElement);

      fontSize = parseFloat(style.fontSize) || fontSize;
      fontFamily = style.fontFamily || fontFamily;
      fontWeight = style.fontWeight || fontWeight;
    }

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';

    ctx.fillText(character.kanji, width / 2, height / 2);

    return ctx.getImageData(0, 0, width, height);
  }

  // =========================
  // CEK TULISAN
  // =========================
  function checkDrawing() {
    if (!hasDrawing) {
      alert('Coba tulis Kanji-nya dulu ya 😄');
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) return;

    // =========================
    // AMBIL GAMBAR TULISAN USER
    // =========================
    const userCanvas = document.createElement('canvas');

    userCanvas.width = width;
    userCanvas.height = height;

    const userCtx = userCanvas.getContext('2d');

    userCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);

    const userImage = userCtx.getImageData(0, 0, width, height);

    // =========================
    // AMBIL MASK KANJI PANDUAN
    // =========================
    const guideImage = createGuideMask(width, height);

    if (!guideImage) {
      setChecked('wrong');
      return;
    }

    /*
      Kita menggunakan resolusi sampling kecil
      supaya pengecekan tidak terlalu berat.
    */
    const step = 4;

    const guidePoints = [];
    const userPoints = [];

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;

        // GUIDE
        const guideAlpha = guideImage.data[index + 3];

        if (guideAlpha > 40) {
          guidePoints.push({ x, y });
        }

        // USER
        const red = userImage.data[index];
        const green = userImage.data[index + 1];
        const blue = userImage.data[index + 2];
        const alpha = userImage.data[index + 3];

        const isUserStroke = alpha > 50 && red > 120 && red > green * 1.35 && red > blue * 1.35;

        if (isUserStroke) {
          userPoints.push({ x, y });
        }
      }
    }

    if (userPoints.length < 30) {
      setChecked('wrong');
      return;
    }

    if (guidePoints.length === 0) {
      setChecked('wrong');
      return;
    }

    // =========================
    // BUAT GRID CEPAT
    // =========================
    const gridWidth = Math.ceil(width / step);
    const gridHeight = Math.ceil(height / step);

    const guideGrid = new Uint8Array(gridWidth * gridHeight);

    const userGrid = new Uint8Array(gridWidth * gridHeight);

    guidePoints.forEach(({ x, y }) => {
      const gx = Math.floor(x / step);
      const gy = Math.floor(y / step);

      guideGrid[gy * gridWidth + gx] = 1;
    });

    userPoints.forEach(({ x, y }) => {
      const gx = Math.floor(x / step);
      const gy = Math.floor(y / step);

      userGrid[gy * gridWidth + gx] = 1;
    });

    // =========================
    // CEK JARAK KE PANDUAN
    // =========================
    const radius = 7;

    function hasNearbyPoint(grid, gx, gy) {
      for (let yy = -radius; yy <= radius; yy++) {
        for (let xx = -radius; xx <= radius; xx++) {
          const nx = gx + xx;
          const ny = gy + yy;

          if (nx < 0 || ny < 0 || nx >= gridWidth || ny >= gridHeight) {
            continue;
          }

          if (xx * xx + yy * yy > radius * radius) {
            continue;
          }

          if (grid[ny * gridWidth + nx]) {
            return true;
          }
        }
      }

      return false;
    }

    // =========================
    // GUIDE COVERAGE
    // Berapa banyak bentuk Kanji
    // yang disentuh tulisan user
    // =========================
    let guideMatched = 0;

    guidePoints.forEach(({ x, y }) => {
      const gx = Math.floor(x / step);
      const gy = Math.floor(y / step);

      if (hasNearbyPoint(userGrid, gx, gy)) {
        guideMatched++;
      }
    });

    const guideCoverage = guideMatched / guidePoints.length;

    // =========================
    // USER PRECISION
    // Berapa banyak tulisan user
    // yang berada dekat Kanji panduan
    // =========================
    let userMatched = 0;

    userPoints.forEach(({ x, y }) => {
      const gx = Math.floor(x / step);
      const gy = Math.floor(y / step);

      if (hasNearbyPoint(guideGrid, gx, gy)) {
        userMatched++;
      }
    });

    const userPrecision = userMatched / userPoints.length;

    // =========================
    // CEK BOUNDING BOX
    // =========================
    const getBounds = (points) => {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      points.forEach(({ x, y }) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });

      return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
      };
    };

    const guideBounds = getBounds(guidePoints);
    const userBounds = getBounds(userPoints);

    const widthRatio = userBounds.width / Math.max(guideBounds.width, 1);

    const heightRatio = userBounds.height / Math.max(guideBounds.height, 1);

    const sizeLooksReasonable = widthRatio > 0.35 && widthRatio < 1.8 && heightRatio > 0.35 && heightRatio < 1.8;

    // =========================
    // HASIL AKHIR
    // =========================
    const isCorrect = guideCoverage >= 0.42 && userPrecision >= 0.45 && sizeLooksReasonable;

    if (isCorrect) {
      setChecked('correct');
    } else {
      setChecked('wrong');
    }
  }

  function nextCharacter() {
    if (current === practiceCharacters.length - 1) {
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
            Kanji {current + 1} dari {practiceCharacters.length}
          </span>

          <div className="practice-progress-track">
            <div
              style={{
                width: `${((current + 1) / practiceCharacters.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="writing-card">
          <div className="writing-heading">
            <div>
              <span className="practice-label">TULIS KANJI</span>

              <h2>Ikuti garis Kanji di bawah</h2>
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
              onPointerLeave={stopDrawing}
            />

            <div className="writing-hint">Tulis mengikuti bentuk Kanji yang samar ✍️</div>
          </div>

          {checked === 'correct' && (
            <div className="check-feedback correct-feedback">
              <strong>✓ Tulisanmu sudah tepat!</strong>

              <span>Bentuk tulisanmu cukup mirip dengan Kanji panduan.</span>
            </div>
          )}

          {checked === 'wrong' && (
            <div className="check-feedback wrong-feedback">
              <strong>✕ Tulisanmu belum tepat</strong>

              <span>Coba ikuti bentuk dan posisi garis Kanji lebih dekat dengan panduan.</span>
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
              {current === practiceCharacters.length - 1 ? 'Selesai →' : 'Kanji Berikutnya →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default KanjiQuiz;
