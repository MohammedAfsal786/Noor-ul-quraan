import { useState, useEffect } from 'react';
import api from '../utils/api';
import { SkeletonList } from '../components/LoadingSkeleton';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'daily', label: 'Daily Duas' },
  { value: 'morning_evening', label: 'Morning & Evening' },
  { value: 'quran', label: 'From Quran' },
  { value: 'situations', label: 'Situations' }
];

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem('noor_dua_favorites') || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(favs) {
  try {
    localStorage.setItem('noor_dua_favorites', JSON.stringify(favs));
  } catch {
    // ignore
  }
}

export default function Duas() {
  const [duas, setDuas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = category ? `/duas?category=${category}` : '/duas';
    api
      .get(url)
      .then(res => setDuas(res.data.duas || []))
      .finally(() => setLoading(false));
  }, [category]);

  const toggleFavorite = (dua) => {
    const id = dua._id || dua.title;
    setFavorites(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(x => x !== id) : [...prev, id];
      saveFavorites(next);
      return next;
    });
  };

  const filtered = duas.filter(dua => {
    const q = search.trim().toLowerCase();
    const id = dua._id || dua.title;
    if (showOnlyFavorites && !favorites.includes(id)) return false;
    if (!q) return true;
    return (
      dua.title?.toLowerCase().includes(q) ||
      dua.english?.toLowerCase().includes(q) ||
      dua.transliteration?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-arabic text-3xl font-bold text-islamic-green dark:text-islamic-gold mb-2">
        🤲 Duas
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Browse daily, Quranic, and situational duas. Use the search box or mark your favorites for quick access.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={`px-4 py-2 rounded-lg text-sm ${
              (!category && !value) || category === value
                ? 'bg-islamic-green text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="search"
          placeholder="Search duas by title or meaning..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        />
        <button
          onClick={() => setShowOnlyFavorites(v => !v)}
          className={`px-4 py-2 rounded-lg text-sm border ${
            showOnlyFavorites
              ? 'bg-yellow-400 text-black border-yellow-500'
              : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'
          }`}
        >
          {showOnlyFavorites ? 'Showing Favorites ★' : 'Show Favorites'}
        </button>
      </div>

      {loading ? (
        <SkeletonList count={5} />
      ) : (
        <div className="space-y-6">
          {filtered.map((dua, i) => {
            const id = dua._id || dua.title || i;
            const fav = favorites.includes(dua._id || dua.title);
            return (
              <div
                key={id}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-islamic-green dark:text-islamic-gold mb-1">{dua.title}</h2>
                    {dua.category && (
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-islamic-green/10 text-islamic-green dark:bg-islamic-gold/10 dark:text-islamic-gold">
                        {dua.category.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(dua)}
                    className="text-xl"
                    aria-label="Toggle favorite dua"
                  >
                    {fav ? '★' : '☆'}
                  </button>
                </div>

                <p className="font-arabic text-2xl leading-loose text-right mb-3" dir="rtl">
                  {dua.arabic}
                </p>
                {dua.transliteration && (
                  <p className="text-gray-600 dark:text-gray-400 italic mb-2">{dua.transliteration}</p>
                )}
                <p className="text-gray-700 dark:text-gray-300 mb-3">{dua.english}</p>
                {dua.audioUrl && (
                  <audio controls className="w-full mt-1">
                    <source src={dua.audioUrl} />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-gray-500">
              No duas match your filters. Try clearing the search or category, or run <code>npm run seed</code> to
              load sample duas.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
