import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleLogin() {
    navigate('/dashboard');
  }

  return (
    <div className="login-page">
      {/* BACKGROUND DECORATION */}
      <div className="japan-scene">
        <div className="sun"></div>

        <div className="mountain mountain-back"></div>
        <div className="mountain mountain-front"></div>

        <div className="torii-scene">
          <div className="torii-top"></div>
          <div className="torii-top-small"></div>
          <div className="torii-pillar left"></div>
          <div className="torii-pillar right"></div>
          <div className="torii-lower"></div>
        </div>

        <div className="sakura sakura-left">🌸</div>
        <div className="sakura sakura-right">🌸</div>

        <div className="japanese-house house-one"></div>
        <div className="japanese-house house-two"></div>
      </div>

      {/* LOGIN CARD */}
      <div className="login-card">
        {/* LOGO */}
        <div className="login-brand">
          <div className="login-logo">
            <svg
              viewBox="0 0 100 100"
              className="torii-logo"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="47"
                fill="#fff1f1"
              />

              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#c62828"
                strokeWidth="3"
              />

              {/* torii */}
              <path
                d="M23 29 Q50 22 77 29"
                fill="none"
                stroke="#c62828"
                strokeWidth="6"
                strokeLinecap="round"
              />

              <path
                d="M27 36 Q50 31 73 36"
                fill="none"
                stroke="#c62828"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <rect
                x="31"
                y="34"
                width="7"
                height="42"
                rx="2"
                fill="#c62828"
              />

              <rect
                x="62"
                y="34"
                width="7"
                height="42"
                rx="2"
                fill="#c62828"
              />

              <path
                d="M35 47 H65"
                stroke="#c62828"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Fuji */}
              <path
                d="M39 74 L50 52 L61 74 Z"
                fill="#d9e1e8"
              />

              <path
                d="M46 60 L50 52 L54 60"
                fill="white"
              />
            </svg>
          </div>

          <h1>JAPALTI</h1>

          <p className="login-subtitle">Japanese Learning Platform</p>
        </div>

        {/* WELCOME */}
        <div className="login-welcome">
          <span className="welcome-label">ようこそ • YŌKOSO</span>

          <h2>Selamat Datang 👋</h2>

          <p>Masuk untuk melanjutkan perjalanan belajar bahasa Jepangmu.</p>
        </div>

        {/* FORM */}
        <div className="login-form">
          <label htmlFor="email">Email</label>

          <div className="input-wrapper">
            <span className="input-icon">✉</span>

            <input
              id="email"
              type="email"
              placeholder="Masukkan email"
            />
          </div>

          <label htmlFor="password">Password</label>

          <div className="input-wrapper">
            <span className="input-icon">🔒</span>

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Tampilkan password"
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
          >
            <span>Masuk</span>
            <span className="login-arrow">→</span>
          </button>
        </div>

        <p className="register-text">
          Belum punya akun?
          <span> Daftar</span>
        </p>

        {/* BOTTOM LANDSCAPE */}
        <div className="card-landscape">
          <div className="card-sun"></div>

          <div className="card-mountain mountain-one"></div>
          <div className="card-mountain mountain-two"></div>

          <div className="card-torii">
            <div className="card-torii-top"></div>
            <div className="card-torii-bar"></div>
            <div className="card-torii-pillar left"></div>
            <div className="card-torii-pillar right"></div>
          </div>

          <div className="card-pagoda">
            <div className="pagoda-roof roof-one"></div>
            <div className="pagoda-body"></div>
            <div className="pagoda-roof roof-two"></div>
            <div className="pagoda-body small"></div>
          </div>

          <div className="card-sakura sakura-one">🌸</div>
          <div className="card-sakura sakura-two">🌸</div>

          <div className="landscape-ground"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
