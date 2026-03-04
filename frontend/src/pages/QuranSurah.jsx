import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { SkeletonAyah } from '../components/LoadingSkeleton';

export default function QuranSurah() {
  const { surahNumber } = useParams();
  const { user, updateLastRead, addBookmark: addBk, removeBookmark: removeBk, isBookmarked: isBkAuth } = useAuth();
  const { playAyah, pause, currentAyah, toggleBookmark, isBookmarked: isBkLocal } = useAudio();
  const isBookmarked = user ? isBkAuth : isBkLocal;
  const toggleBk = (surahNum, ayahNum, surahName) => {
    if (user) {
      if (isBkAuth(surahNum, ayahNum)) removeBk(surahNum, ayahNum);
      else addBk(surahNum, ayahNum, surahName);
    } else toggleBookmark(surahNum, ayahNum, surahName);
  };
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const refs = useRef({});

  useEffect(() => {
    api.get(`/quran/surah/${surahNumber}`).then(res => setSurah(res.data.surah)).finally(() => setLoading(false));
  }, [surahNumber]);

  useEffect(() => {
    if (user?.lastRead?.surahNumber == surahNumber) {
      const ayahNum = user.lastRead.ayahNumber;
      setTimeout(() => refs.current[ayahNum]?.scrollIntoView({ behavior: 'smooth' }), 500);
    }
  }, [surah, user, surahNumber]);

  const handleAyahClick = (ayah) => {
    const isCurrent = currentAyah?.surahNum == surahNumber && currentAyah?.ayahNum === ayah.numberInSurah;
    if (isCurrent) pause();
    else playAyah(parseInt(surahNumber), ayah.numberInSurah);
  };

  const savePosition = (surahNum, ayahNum) => {
    updateLastRead(surahNum, ayahNum);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8" />
        {[...Array(7)].map((_, i) => <SkeletonAyah key={i} />)}
      </div>
    );
  }

  if (!surah) return <div className="max-w-3xl mx-auto px-4 py-8">Surah not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
      <div className="text-center mb-8">
        <h1 className="font-arabic text-3xl text-islamic-green dark:text-islamic-gold">{surah.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{surah.englishName} – {surah.revelationType}</p>
      </div>
      <div className="space-y-6">
        {surah.ayahs?.map((ayah) => {
          const playing = currentAyah?.surahNum == surahNumber && currentAyah?.ayahNum === ayah.numberInSurah;
          const bookmarked = isBookmarked(parseInt(surahNumber), ayah.numberInSurah);
          return (
            <div
              key={ayah.number}
              id={`ayah-${ayah.numberInSurah}`}
              ref={el => refs.current[ayah.numberInSurah] = el}
              className={`p-4 rounded-xl border transition ${playing ? 'border-islamic-gold bg-islamic-gold/10' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleAyahClick(ayah)}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-islamic-green/20 text-islamic-green flex items-center justify-center hover:bg-islamic-green/30"
                >
                  {playing ? '⏸' : '▶'}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-arabic text-2xl leading-loose text-right mb-2" dir="rtl">
                    {ayah.text}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{ayah.english}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-islamic-gold">Ayah {ayah.numberInSurah}</span>
                    <span className="text-xs text-gray-500">Juz {ayah.juz}</span>
                    {user && (
                      <button onClick={() => savePosition(parseInt(surahNumber), ayah.numberInSurah)} className="text-xs text-islamic-green hover:underline">
                        Save position
                      </button>
                    )}
                    <button
                      onClick={() => toggleBk(parseInt(surahNumber), ayah.numberInSurah, surah.englishName)}
                      className="ml-auto"
                    >
                      {bookmarked ? '🔖' : '☆'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
