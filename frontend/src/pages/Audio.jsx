import { useAudio } from '../context/AudioContext';
import { Link } from 'react-router-dom';

const RECITATIONS = [
  { surah: 1, name: 'Al-Fatiha' },
  { surah: 2, name: 'Al-Baqarah' },
  { surah: 36, name: 'Yaseen' },
  { surah: 67, name: 'Al-Mulk' },
  { surah: 78, name: 'An-Naba' }
];

export default function Audio() {
  const { RECITERS, reciter, setReciter, playAyah } = useAudio();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-arabic text-3xl font-bold text-islamic-green dark:text-islamic-gold mb-6">
        🎧 Islamic Audio
      </h1>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Reciter</label>
        <select
          value={reciter.id}
          onChange={e => setReciter(RECITERS.find(r => r.id === e.target.value))}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        >
          {RECITERS.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <h2 className="font-bold mb-2">Quick Listen</h2>
        {RECITATIONS.map(({ surah, name }) => (
          <div
            key={surah}
            className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <span>{name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => playAyah(surah, 1)}
                className="px-4 py-2 rounded-lg bg-islamic-green text-white hover:bg-islamic-green-dark"
              >
                Play
              </button>
              <Link to={`/quran/${surah}`} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                Read
              </Link>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Audio continues playing while you browse. Use the player at the bottom to control playback.
      </p>
    </div>
  );
}
