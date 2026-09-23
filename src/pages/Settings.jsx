import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Settings.css';

function Settings() {
  const navigate = useNavigate();

  const [name, setName] = useState('Siswa');
  const [dailyGoal, setDailyGoal] = useState('10');
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [saved, setSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('japalti_user_name');

    const savedGoal = localStorage.getItem('japalti_daily_goal');

    const savedNotifications = localStorage.getItem('japalti_notifications');

    const savedSound = localStorage.getItem('japalti_sound');

    const savedDarkMode = localStorage.getItem('japalti_dark_mode');

    if (savedName) {
      setName(savedName);
    }

    if (savedGoal) {
      setDailyGoal(savedGoal);
    }

    if (savedNotifications !== null) {
      setNotifications(savedNotifications === 'true');
    }

    if (savedSound !== null) {
      setSound(savedSound === 'true');
    }

    const isDark = savedDarkMode === 'true';

    setDarkMode(isDark);

    document.documentElement.classList.toggle('dark-mode', isDark);

    document.body.classList.toggle('dark-mode', isDark);
  }, []);

  function applyDarkMode(isDark) {
    document.documentElement.classList.toggle('dark-mode', isDark);

    document.body.classList.toggle('dark-mode', isDark);
  }

  function handleDarkModeToggle() {
    const newDarkMode = !darkMode;

    setDarkMode(newDarkMode);

    localStorage.setItem('japalti_dark_mode', String(newDarkMode));

    applyDarkMode(newDarkMode);
  }

  function handleSave() {
    const cleanName = name.trim() || 'Siswa';

    localStorage.setItem('japalti_user_name', cleanName);

    localStorage.setItem('japalti_daily_goal', dailyGoal);

    localStorage.setItem('japalti_notifications', String(notifications));

    localStorage.setItem('japalti_sound', String(sound));

    localStorage.setItem('japalti_dark_mode', String(darkMode));

    applyDarkMode(darkMode);

    setName(cleanName);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button
          className="settings-back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>

        <div className="settings-header-content">
          <span className="settings-label">JAPALTI • SETTINGS</span>

          <h1>Pengaturan ⚙️</h1>

          <p>Atur pengalaman belajar JAPALTI sesuai kebutuhanmu.</p>
        </div>
      </header>

      <main className="settings-main">
        <section className="settings-section">
          <div className="settings-section-title">
            <div className="settings-section-icon">👤</div>

            <div>
              <span>PROFIL</span>
              <h2>Profil Siswa</h2>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-avatar">{name.charAt(0).toUpperCase()}</div>

            <div className="settings-field">
              <label>Nama</label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Masukkan nama"
                maxLength={30}
              />

              <small>Nama ini digunakan untuk profil belajar kamu.</small>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-title">
            <div className="settings-section-icon">🎯</div>

            <div>
              <span>BELAJAR</span>
              <h2>Target Belajar</h2>
            </div>
          </div>

          <div className="settings-card settings-options">
            <div className="settings-option">
              <div>
                <strong>Target belajar harian</strong>

                <p>Tentukan berapa menit kamu ingin belajar setiap hari.</p>
              </div>

              <select
                value={dailyGoal}
                onChange={(event) => setDailyGoal(event.target.value)}
              >
                <option value="5">5 menit</option>

                <option value="10">10 menit</option>

                <option value="15">15 menit</option>

                <option value="20">20 menit</option>

                <option value="30">30 menit</option>
              </select>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-title">
            <div className="settings-section-icon">🌙</div>

            <div>
              <span>TAMPILAN</span>
              <h2>Tampilan</h2>
            </div>
          </div>

          <div className="settings-card settings-options">
            <div className="settings-option">
              <div>
                <strong>Dark Mode</strong>

                <p>Gunakan tampilan gelap agar lebih nyaman saat belajar.</p>
              </div>

              <button
                type="button"
                className={`toggle ${darkMode ? 'active' : ''}`}
                onClick={handleDarkModeToggle}
                aria-label="Toggle dark mode"
              >
                <span />
              </button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-title">
            <div className="settings-section-icon">🔔</div>

            <div>
              <span>PREFERENSI</span>
              <h2>Preferensi</h2>
            </div>
          </div>

          <div className="settings-card settings-options">
            <div className="settings-option">
              <div>
                <strong>Pengingat belajar</strong>

                <p>Aktifkan pengingat agar kamu tidak lupa belajar.</p>
              </div>

              <button
                type="button"
                className={`toggle ${notifications ? 'active' : ''}`}
                onClick={() => setNotifications(!notifications)}
                aria-label="Toggle notifikasi"
              >
                <span />
              </button>
            </div>

            <div className="settings-divider" />

            <div className="settings-option">
              <div>
                <strong>Suara</strong>

                <p>Gunakan efek suara saat mengerjakan latihan.</p>
              </div>

              <button
                type="button"
                className={`toggle ${sound ? 'active' : ''}`}
                onClick={() => setSound(!sound)}
                aria-label="Toggle suara"
              >
                <span />
              </button>
            </div>
          </div>
        </section>

        <div className="settings-save-area">
          <button
            className="settings-save-button"
            onClick={handleSave}
          >
            {saved ? '✓ Tersimpan' : 'Simpan Pengaturan'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;
