import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { SkeletonList } from '../components/LoadingSkeleton';

const JUZ_RANGES = [
  [1, 2], [2, 142], [2, 253], [3, 93], [4, 24], [4, 148], [5, 82], [6, 111], [7, 88], [8, 41],
  [9, 93], [11, 6], [12, 53], [15, 1], [17, 1], [18, 75], [21, 1], [23, 1], [25, 21], [27, 56],
  [29, 46], [33, 31], [36, 28], [39, 32], [41, 47], [46, 1], [51, 31], [58, 1], [67, 1], [78, 1]
];

export default function Quran() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('surah');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/quran/meta').then(res => setSurahs(res.data.surahs || [])).finally(() => setLoading(false));
  }, []);

  const filtered = surahs.filter(s =>
    s.englishName?.toLowerCase().includes(search.toLowerCase()) ||
    s.name?.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-arabic text-3xl font-bold text-islamic-green dark:text-islamic-gold mb-6">
        📖 The Holy Quran
      </h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setView('surah')}
          className={`px-4 py-2 rounded-lg ${view === 'surah' ? 'bg-islamic-green text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Surah
        </button>
        <button
          onClick={() => setView('juz')}
          className={`px-4 py-2 rounded-lg ${view === 'juz' ? 'bg-islamic-green text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Juz
        </button>
      </div>
      <input
        type="search"
        placeholder="Search by Surah name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full md:w-80 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 mb-6"
      />
      {loading ? (
        <SkeletonList count={15} />
      ) : view === 'surah' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <Link
              key={s.number}
              to={`/quran/${s.number}`}
              className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-islamic-gold hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-arabic text-lg text-islamic-green dark:text-islamic-gold">{s.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.englishName}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-islamic-green/10 text-islamic-green">
                  {s.numberOfAyahs} ayahs
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {JUZ_RANGES.map(([surah, ayah], i) => (
            <Link
              key={i}
              to={`/quran/${surah}#ayah-${ayah}`}
              className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-islamic-gold text-center"
            >
              <span className="text-2xl font-bold text-islamic-green">Juz {i + 1}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
