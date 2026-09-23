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

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

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

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

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

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
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
      // Tidak masalah kalau browser tidak mendukung.
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
   * Mengambil titik dari tulisan user.
   */
  function getUserPoints() {
    const canvas = canvasRef.current;

    if (!canvas) return [];

    const rect = canvas.getBoundingClientRect();

    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) {
      return [];
    }

    const tempCanvas = document.createElement('canvas');

    tempCanvas.width = width;
    tempCanvas.height = height;

    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);

    const image = tempCtx.getImageData(0, 0, width, height);

    const points = [];

    /*
     * Ambil pixel merah dari canvas.
     */
    for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < width; x += 3) {
        const index = (y * width + x) * 4;

        const red = image.data[index];
        const green = image.data[index + 1];
        const blue = image.data[index + 2];
        const alpha = image.data[index + 3];

        const isRed = alpha > 40 && red > 120 && red > green * 1.35 && red > blue * 1.35;

        if (isRed) {
          points.push({
            x,
            y,
          });
        }
      }
    }

    return points;
  }

  /*
   * Membuat area panduan berdasarkan Kanji
   * yang BENAR-BENAR tampil di layar.
   *
   * Jadi posisi pengecekan akan mengikuti
   * posisi karakter abu-abu, bukan koordinat
   * manual yang bisa meleset.
   */
  function createGuideMask(width, height) {
    const guideCanvas = document.createElement('canvas');

    guideCanvas.width = width;
    guideCanvas.height = height;

    const ctx = guideCanvas.getContext('2d');

    /*
     * Ambil style dari .guide-character
     * supaya ukuran/font sama dengan yang
     * terlihat di layar.
     */
    const guideElement = document.querySelector('.guide-character');

    let fontSize = 260;
    let fontWeight = 'bold';
    let fontFamily = 'Arial, sans-serif';

    if (guideElement) {
      const style = window.getComputedStyle(guideElement);

      fontSize = parseFloat(style.fontSize) || fontSize;

      fontWeight = style.fontWeight || fontWeight;

      fontFamily = style.fontFamily || fontFamily;
    }

    ctx.clearRect(0, 0, width, height);

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    /*
     * Hitam = area Kanji yang dianggap
     * sebagai area panduan.
     */
    ctx.fillStyle = '#000';

    ctx.fillText(character.kanji, width / 2, height / 2);

    return ctx.getImageData(0, 0, width, height);
  }

  /*
   * Ambil titik-titik dari area Kanji.
   */
  function getGuidePoints(width, height) {
    const image = createGuideMask(width, height);

    const points = [];

    /*
     * Sampling setiap 4 pixel supaya
     * pengecekan tetap ringan.
     */
    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const index = (y * width + x) * 4;

        const alpha = image.data[index + 3];

        if (alpha > 30) {
          points.push({
            x,
            y,
          });
        }
      }
    }

    return points;
  }

  /*
   * Cari jarak terdekat dari satu titik
   * ke kumpulan titik lainnya.
   */
  function nearestDistance(point, points) {
    let nearest = Infinity;

    for (const other of points) {
      const d = distance(point, other);

      if (d < nearest) {
        nearest = d;
      }
    }

    return nearest;
  }

  function checkDrawing() {
    if (!hasDrawing) {
      alert('Tulis Kanji-nya dulu ya 😄');
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const width = Math.floor(rect.width);

    const height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) {
      return;
    }

    const userPoints = getUserPoints();

    const guidePoints = getGuidePoints(width, height);

    if (userPoints.length < 30 || guidePoints.length < 30) {
      setChecked('wrong');
      return;
    }

    /*
     * Toleransi besar.
     *
     * User TIDAK wajib tepat di tengah
     * Kanji.
     *
     * Yang penting masih berada di
     * sekitar area Kanji.
     */
    const tolerance = 48;

    /*
     * ==========================
     * CEK 1
     * ==========================
     *
     * Apakah sebagian besar bagian
     * Kanji sudah disentuh tulisan?
     *
     * Kita tidak menuntut 100%.
     */
    let coveredGuide = 0;

    for (const guidePoint of guidePoints) {
      const nearest = nearestDistance(guidePoint, userPoints);

      if (nearest <= tolerance) {
        coveredGuide++;
      }
    }

    const guideCoverage = coveredGuide / guidePoints.length;

    /*
     * ==========================
     * CEK 2
     * ==========================
     *
     * Apakah tulisan user masih
     * berada di sekitar Kanji?
     *
     * Ini yang bikin coretan yang
     * keluar jauh menjadi SALAH.
     */
    let insideGuide = 0;

    for (const userPoint of userPoints) {
      const nearest = nearestDistance(userPoint, guidePoints);

      if (nearest <= tolerance) {
        insideGuide++;
      }
    }

    const userInsideRatio = insideGuide / userPoints.length;

    /*
     * ==========================
     * CEK 3
     * ==========================
     *
     * Cek ukuran tulisan supaya
     * coretan kecil/random tidak
     * dianggap benar.
     */
    const userXs = userPoints.map((point) => point.x);

    const userYs = userPoints.map((point) => point.y);

    const guideXs = guidePoints.map((point) => point.x);

    const guideYs = guidePoints.map((point) => point.y);

    const userWidth = Math.max(...userXs) - Math.min(...userXs);

    const userHeight = Math.max(...userYs) - Math.min(...userYs);

    const guideWidth = Math.max(...guideXs) - Math.min(...guideXs);

    const guideHeight = Math.max(...guideYs) - Math.min(...guideYs);

    const widthRatio = userWidth / guideWidth;

    const heightRatio = userHeight / guideHeight;

    /*
     * Tulisan tidak boleh terlalu kecil.
     *
     * Tapi kita kasih ruang besar supaya
     * user tetap bebas menulis.
     */
    const correctSize = widthRatio >= 0.45 && heightRatio >= 0.45;

    /*
     * ==========================
     * HASIL AKHIR
     * ==========================
     *
     * Tidak perlu persis.
     *
     * Yang penting:
     *
     * - bentuk cukup mengikuti Kanji
     * - sebagian besar coretan masih
     *   berada di area Kanji
     * - ukuran tulisan masuk akal
     */
    const isCorrect = guideCoverage >= 0.4 && userInsideRatio >= 0.72 && correctSize;

    if (isCorrect) {
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

          <p>Ikuti bentuk Kanji lalu tulis mengikuti garis panduan.</p>
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

            <div className="writing-hint">Ikuti bentuk Kanji yang samar ✍️</div>
          </div>

          {checked === 'correct' && (
            <div className="check-feedback correct-feedback">
              <strong>✓ Benar! Tulisanmu sudah mengikuti bentuk Kanji.</strong>

              <span>Mantap! Lanjut ke Kanji berikutnya.</span>
            </div>
          )}

          {checked === 'wrong' && (
            <div className="check-feedback wrong-feedback">
              <strong>✕ Belum benar.</strong>

              <span>Tulisanmu masih keluar dari bentuk Kanji. Coba hapus lalu ikuti area Kanji yang samar.</span>
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
