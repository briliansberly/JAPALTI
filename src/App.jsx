import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import KanjiPractice from './pages/KanjiPractice';
import KatakanaPractice from './pages/KatakanaPractice';
import HiraganaPractice from './pages/HiraganaPractice';
import './darkMode.css';
import Roadmap from './pages/Roadmap';
import Settings from './pages/Settings';
import Review from './pages/Review';
import DailyQuest from './pages/DailyQuest';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import GrammarQuiz from './pages/GrammarQuiz';
import Grammar from './pages/Grammar';
import VocabularyQuiz from './pages/VocabularyQuiz';
import Vocabulary from './pages/Vocabulary';
import KanjiQuiz from './pages/KanjiQuiz';
import Kanji from './pages/Kanji';
import KatakanaQuiz from './pages/KatakanaQuiz';
import HiraganaQuiz from './pages/HiraganaQuiz';
import Hiragana from './pages/Hiragana';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Learning from './pages/Learning';
import Katakana from './pages/Katakana';

function App() {
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('japalti_dark_mode') === 'true';

    document.documentElement.classList.toggle('dark-mode', savedDarkMode);

    document.body.classList.toggle('dark-mode', savedDarkMode);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/learning"
          element={<Learning />}
        />

        <Route
          path="/hiragana"
          element={<Hiragana />}
        />
        <Route
          path="/hiragana-quiz"
          element={<HiraganaQuiz />}
        />

        <Route
          path="/katakana"
          element={<Katakana />}
        />
        <Route
          path="/katakana-quiz"
          element={<KatakanaQuiz />}
        />

        <Route
          path="/kanji"
          element={<Kanji />}
        />
        <Route
          path="/kanji-quiz"
          element={<KanjiQuiz />}
        />

        <Route
          path="/vocabulary"
          element={<Vocabulary />}
        />
        <Route
          path="/vocabulary-quiz"
          element={<VocabularyQuiz />}
        />

        <Route
          path="/grammar"
          element={<Grammar />}
        />
        <Route
          path="/grammar-quiz"
          element={<GrammarQuiz />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

        <Route
          path="/quiz"
          element={<Quiz />}
        />

        <Route
          path="/daily-quest"
          element={<DailyQuest />}
        />

        <Route
          path="/review"
          element={<Review />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/roadmap"
          element={<Roadmap />}
        />

        <Route
          path="/hiragana-practice"
          element={<HiraganaPractice />}
        />

        <Route
          path="/kanji-practice"
          element={<KanjiPractice />}
        />

        <Route
          path="/katakana-practice"
          element={<KatakanaPractice />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
