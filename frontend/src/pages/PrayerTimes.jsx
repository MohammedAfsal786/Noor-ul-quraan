import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const PRAYER_NAMES = { Fajr: 'Fajr', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' };

function getStorageKey() {
  const today = new Date().toLocaleDateString('en-CA');
  return `noor_prayer_tracker_${today}`;
}

function loadTracker() {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveTracker(tracker) {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(tracker));
  } catch {
    // ignore
  }
}

function getNextPrayer(timings) {
  const now = new Date();
  const fmt = t => {
    const [h, m] = t.split(':').map(Number);
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  };
  const entries = Object.entries(timings).filter(([k]) => Object.keys(PRAYER_NAMES).includes(k));
  for (const [name, time] of entries) {
    const d = fmt(time);
    if (d > now) return { name, time, date: d };
  }
  return entries[0] ? { name: entries[0][0], time: entries[0][1], date: fmt(entries[0][1]) } : null;
}

function countdown(to) {
  const diff = to - Date.now();
  if (diff <= 0) return 'Now';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function PrayerTimes() {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [data, setData] = useState(null);
  const [hijri, setHijri] = useState(null);
  const [countdownStr, setCountdownStr] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tracker, setTracker] = useState(() => loadTracker());

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        try {
          const [pt, h] = await Promise.all([
            fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}`).then(r => r.json()),
            fetch(`https://api.aladhan.com/v1/gToH?date=${new Date().toLocaleDateString('en-CA')}`).then(r => r.json())
          ]);
          setData(pt.data);
          setHijri(h?.data?.hijri);
        } catch (e) {
          setError('Failed to fetch prayer times');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Please allow location access');
        setLoading(false);
      }
    );
  }, []);

  // Load per-user tracker from API when logged in
  useEffect(() => {
    if (!user) return;
    api.get('/prayer/today')
      .then(res => {
        if (res.data?.prayers) {
          setTracker(res.data.prayers);
        }
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!data?.timings) return;
    const next = getNextPrayer(data.timings);
    if (!next) return;
    const upd = () => setCountdownStr(countdown(next.date));
    upd();
    const id = setInterval(upd, 60000);
    return () => clearInterval(id);
  }, [data]);

  const togglePrayer = async (name) => {
    if (user) {
      const res = await api.post('/prayer/mark', { name });
      setTracker(res.data.prayers || {});
    } else {
      setTracker((prev) => {
        const next = { ...prev, [name]: !prev[name] };
        saveTracker(next);
        return next;
      });
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8 text-center">Loading prayer times...</div>;
  if (error) return <div className="max-w-2xl mx-auto px-4 py-8 text-center text-red-500">{error}</div>;

  const nextPrayer = data ? getNextPrayer(data.timings) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-arabic text-3xl font-bold text-islamic-green dark:text-islamic-gold mb-6">
        🕌 Prayer Times
      </h1>
      {hijri && (
        <div className="mb-6 p-4 rounded-xl bg-islamic-green/10 dark:bg-islamic-green/20 text-center">
          <p className="text-islamic-green dark:text-islamic-gold font-semibold">
            {hijri.day} {hijri.month?.en} {hijri.year} AH
          </p>
        </div>
      )}
      {nextPrayer && (
        <div className="mb-6 p-4 rounded-xl border-2 border-islamic-gold bg-islamic-gold/10 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Next prayer</p>
          <p className="text-xl font-bold text-islamic-green dark:text-islamic-gold">{nextPrayer.name}</p>
          <p className="text-2xl">{countdownStr}</p>
        </div>
      )}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Prayer Tracker (Today)</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mark each prayer after you pray it. This is stored only on this device.
        </p>
      </div>
      <div className="space-y-2">
        {data?.timings && Object.entries(data.timings)
          .filter(([k]) => Object.keys(PRAYER_NAMES).includes(k))
          .map(([name, time]) => {
            const done = !!tracker[name];
            const isNext = nextPrayer?.name === name;
            return (
              <div
                key={name}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  done
                    ? 'bg-green-100 border-green-400 dark:bg-green-900/40 dark:border-green-500'
                    : isNext
                    ? 'bg-islamic-gold/20 border-islamic-gold'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{time}</p>
                </div>
                <button
                  onClick={() => togglePrayer(name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    done
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-islamic-green text-white hover:bg-islamic-green-dark'
                  }`}
                >
                  {done ? 'Prayed ✓' : 'Mark as prayed'}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
