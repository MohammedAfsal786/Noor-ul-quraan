import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import api from '../utils/api';

const AudioContext = createContext(null);

const RECITERS = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'sudais', name: 'Abdul Rahman Al-Sudais (Abdul Basit)' }
];

export function AudioProvider({ children }) {
  const [playing, setPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(null);
  const [reciter, setReciter] = useState(RECITERS[0]);
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch { return []; }
  });
  const audioRef = useRef(null);
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  const playAyah = useCallback(async (surahNum, ayahInSurah) => {
    try {
      const { data } = await api.get(`/quran/audio/${surahNum}/${ayahInSurah}?reciter=${reciter.id}`);
      const url = data.data?.url || data.url;
      if (!url) throw new Error('No audio');
      const audio = audioRef.current;
      audio.src = url;
      await audio.play();
      setPlaying(true);
      setCurrentAyah({ surahNum, ayahNum: ayahInSurah });
    } catch (err) {
      console.error('Audio error:', err);
      setCurrentAyah(null);
    }
  }, [reciter]);

  const toggleBookmark = useCallback((surahNumber, ayahNumber, surahName) => {
    setBookmarks(prev => {
      const key = `${surahNumber}-${ayahNumber}`;
      const exists = prev.some(b => `${b.surahNumber}-${b.ayahNumber}` === key);
      const next = exists ? prev.filter(b => `${b.surahNumber}-${b.ayahNumber}` !== key) : [...prev, { surahNumber, ayahNumber, surahName }];
      localStorage.setItem('bookmarks', JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((surahNumber, ayahNumber) => {
    return bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
  }, [bookmarks]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(console.error);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
    setCurrentAyah(null);
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    const onEnd = () => setPlaying(false);
    a.addEventListener('ended', onEnd);
    return () => a.removeEventListener('ended', onEnd);
  }, []);

  return (
    <AudioContext.Provider value={{
      playing, currentAyah, reciter, RECITERS, setReciter,
      playAyah, pause, resume, stop, toggleBookmark, isBookmarked, bookmarks
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
