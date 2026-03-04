import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Quran from './pages/Quran';
import QuranSurah from './pages/QuranSurah';
import Duas from './pages/Duas';
import Dhikr from './pages/Dhikr';
import PrayerTimes from './pages/PrayerTimes';
import IslamicCalendar from './pages/IslamicCalendar';
import Audio from './pages/Audio';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import AudioPlayer from './components/AudioPlayer';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-islamic-cream dark:bg-gray-900">
      <Navbar />
      <AudioPlayer />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/quran/:surahNumber" element={<QuranSurah />} />
          <Route path="/duas" element={<Duas />} />
          <Route path="/dhikr" element={<Dhikr />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/calendar" element={<IslamicCalendar />} />
          <Route path="/audio" element={<Audio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
