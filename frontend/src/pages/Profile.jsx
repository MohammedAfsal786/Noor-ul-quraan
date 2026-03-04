import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/auth/profile').then(res => setProfile(res.data.user)).catch(() => {});
  }, []);

  const u = profile || user;
  const bmarks = profile?.bookmarks || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-islamic-green dark:text-islamic-gold mb-6">Profile</h1>
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6">
        <p className="text-lg font-semibold">{u?.name}</p>
        <p className="text-gray-600 dark:text-gray-400">{u?.email}</p>
        {u?.lastRead && (
          <p className="mt-2 text-sm">
            Last read: Surah {u.lastRead.surahNumber}, Ayah {u.lastRead.ayahNumber}
            <Link to={`/quran/${u.lastRead.surahNumber}`} className="ml-2 text-islamic-gold hover:underline">Continue</Link>
          </p>
        )}
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Bookmarks</h2>
        {bmarks?.length > 0 ? (
          <ul className="space-y-2">
            {bmarks.map((b, i) => (
              <li key={i}>
                <Link
                  to={`/quran/${b.surahNumber}#ayah-${b.ayahNumber}`}
                  className="block p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {b.surahName} – Ayah {b.ayahNumber}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No bookmarks yet. Bookmark ayahs while reading the Quran.</p>
        )}
      </div>
    </div>
  );
}
