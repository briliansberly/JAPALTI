import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './HiraganaPractice.css';

const practiceCharacters = [
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

function HiraganaPractice() {
  const navigate = useNavigate();
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

    if (rect.width <= 0 || rect.height <= 0) return;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);

    const ctx = canvas.getContext('2d');

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#e00000';
  }

  function getPosition(event) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function startDrawing(event) {
    event.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { x, y } = getPosition(event);

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // Tidak masalah jika browser tidak mendukung capture.
    }

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

    if (!canvas) return;

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

  /*
   * Membuat gambar huruf panduan
   * menggunakan font dan ukuran yang sama
   * dengan huruf abu-abu di layar.
   */
  function createGuideMask(width, height) {
    const guideCanvas = document.createElement('canvas');

    guideCanvas.width = width;
    guideCanvas.height = height;

    const ctx = guideCanvas.getContext('2d');

    if (!ctx) return null;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#000';

    ctx.font = 'bold 260px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(character.kana, width / 2, height / 2);

    return ctx.getImageData(0, 0, width, height);
  }

  /*
   * Mengecek apakah titik user berada
   * cukup dekat dengan garis panduan.
   *
   * Tidak harus tepat di tengah garis.
   * Masih diberi toleransi sekitar 32px.
   */
  function isNearGuide(point, guidePoints, tolerance = 32) {
    const toleranceSquared = tolerance * tolerance;

    /*
     * Cek dengan sampling agar tidak terlalu berat.
     */
    const sampleStep = Math.max(1, Math.floor(guidePoints.length / 2500));

    for (let i = 0; i < guidePoints.length; i += sampleStep) {
      const guide = guidePoints[i];

      const dx = point.x - guide.x;
      const dy = point.y - guide.y;

      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared <= toleranceSquared) {
        return true;
      }
    }

    return false;
  }

  function checkDrawing() {
    if (!hasDrawing) {
      alert('Coba tulis hurufnya dulu ya 😄');
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) return;

    /*
     * =========================
     * AMBIL GAMBAR USER
     * =========================
     */

    const userCanvas = document.createElement('canvas');

    userCanvas.width = width;
    userCanvas.height = height;

    const userCtx = userCanvas.getContext('2d');

    if (!userCtx) return;

    userCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);

    const userImage = userCtx.getImageData(0, 0, width, height);

    /*
     * =========================
     * BUAT MASK HURUF PANDUAN
     * =========================
     */

    const guideImage = createGuideMask(width, height);

    if (!guideImage) {
      setChecked('wrong');
      return;
    }

    /*
     * =========================
     * AMBIL TITIK GUIDE
     * =========================
     */

    const guidePoints = [];

    const sampleSize = 4;

    for (let y = 0; y < height; y += sampleSize) {
      for (let x = 0; x < width; x += sampleSize) {
        const index = (y * width + x) * 4;

        const alpha = guideImage.data[index + 3];

        if (alpha > 30) {
          guidePoints.push({
            x,
            y,
          });
        }
      }
    }

    if (guidePoints.length === 0) {
      setChecked('wrong');
      return;
    }

    /*
     * =========================
     * AMBIL TITIK TULISAN USER
     * =========================
     */

    const userPoints = [];

    for (let y = 0; y < height; y += sampleSize) {
      for (let x = 0; x < width; x += sampleSize) {
        const index = (y * width + x) * 4;

        const red = userImage.data[index];

        const green = userImage.data[index + 1];

        const blue = userImage.data[index + 2];

        const alpha = userImage.data[index + 3];

        /*
         * Coretan user berwarna merah.
         */
        const isRedStroke = alpha > 50 && red > 120 && red > green * 1.4 && red > blue * 1.4;

        if (isRedStroke) {
          userPoints.push({
            x,
            y,
          });
        }
      }
    }

    /*
     * Coretan terlalu sedikit.
     */
    if (userPoints.length < 30) {
      setChecked('wrong');
      return;
    }

    /*
     * =========================
     * CEK 1
     * USER HARUS DEKAT GUIDE
     * =========================
     *
     * Misalnya user bikin garis
     * sembarangan di pojok canvas.
     * Itu akan menghasilkan nilai rendah.
     */

    let userNearGuide = 0;

    for (const point of userPoints) {
      if (isNearGuide(point, guidePoints, 38)) {
        userNearGuide++;
      }
    }

    const userAccuracy = userNearGuide / userPoints.length;

    /*
     * =========================
     * CEK 2
     * GUIDE HARUS TERLALUI USER
     * =========================
     *
     * Jadi bukan cuma satu titik
     * yang ditaruh dekat huruf.
     *
     * Sebagian besar bentuk huruf
     * harus benar-benar disentuh.
     */

    let guideCovered = 0;

    /*
     * Supaya proses tidak terlalu berat,
     * guide disampling.
     */
    const guideStep = Math.max(1, Math.floor(guidePoints.length / 3500));

    for (let i = 0; i < guidePoints.length; i += guideStep) {
      const guidePoint = guidePoints[i];

      if (isNearGuide(guidePoint, userPoints, 42)) {
        guideCovered++;
      }
    }

    const totalGuideSamples = Math.ceil(guidePoints.length / guideStep);

    const guideAccuracy = guideCovered / totalGuideSamples;

    /*
     * =========================
     * CEK 3
     * CORETAAN BERLEBIHAN
     * =========================
     *
     * Kalau user mencoret-coret
     * terlalu jauh dari huruf,
     * userAccuracy akan rendah.
     */

    /*
     * =========================
     * HASIL AKHIR
     * =========================
     *
     * User harus:
     *
     * 1. Minimal 58% coretan berada
     *    dekat dengan bentuk huruf.
     *
     * 2. Minimal 48% bentuk guide
     *    berhasil diikuti.
     *
     * Jadi tidak cukup hanya
     * menggambar satu garis.
     */

    const isCorrect = userAccuracy >= 0.58 && guideAccuracy >= 0.48;

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
    <div className="hiragana-practice-page">
      <header className="practice-header">
        <div>
          <span className="practice-label">JAPALTI • LATIHAN MENULIS</span>

          <h1>Latihan Menulis Hiragana ✍️</h1>

          <p>Ikuti bentuk huruf Jepang dengan tulisanmu sendiri.</p>
        </div>

        <button
          className="practice-back-button"
          onClick={() => navigate('/hiragana')}
        >
          ← Kembali
        </button>
      </header>

      <main className="practice-container">
        <div className="practice-progress">
          <span>
            Karakter {current + 1} dari {practiceCharacters.length}
          </span>

          <div className="practice-progress-track">
            <div
              style={{
                width: `${((current + 1) / practiceCharacters.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <section className="writing-card">
          <div className="writing-heading">
            <div>
              <span className="practice-label">TRACE & WRITE</span>

              <h2>Ikuti bentuk huruf ini</h2>
            </div>

            <div className="character-info">
              <strong>{character.kana}</strong>

              <span>{character.romaji}</span>
            </div>
          </div>

          <div className="writing-area">
            <div className="guide-character">{character.kana}</div>

            <canvas
              ref={canvasRef}
              className="drawing-canvas"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              onPointerLeave={stopDrawing}
            />

            <div className="writing-hint">Ikuti garis abu-abu untuk menulis karakter dengan benar.</div>
          </div>

          {checked === 'correct' && (
            <div className="check-feedback correct-feedback">
              <strong>✓ Benar! Bagus banget! 🎉</strong>

              <span>Tulisanmu sudah mengikuti bentuk huruf {character.kana}. Kamu boleh lanjut.</span>
            </div>
          )}

          {checked === 'wrong' && (
            <div className="check-feedback wrong-feedback">
              <strong>✕ Belum tepat!</strong>

              <span>Coba lagi dan ikuti bentuk huruf {character.kana} yang berwarna abu-abu.</span>
            </div>
          )}

          <div className="writing-actions">
            <button
              className="clear-button"
              onClick={clearCanvas}
            >
              🗑 Hapus
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
              Huruf Berikutnya →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HiraganaPractice;
