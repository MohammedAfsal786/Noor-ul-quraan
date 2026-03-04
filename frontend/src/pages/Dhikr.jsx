import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const INITIAL_DHIKR = ['SubhanAllah', 'Alhamdulillah', 'Allahu Akbar', 'La ilaha illallah'];

function getDhikrKey() {
  const today = new Date().toLocaleDateString('en-CA');
  return `noor_dhikr_tracker_${today}`;
}

export default function Dhikr() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [activeDhikr, setActiveDhikr] = useState('SubhanAllah');
  const [customDhikr, setCustomDhikr] = useState('');
  const [dhikrList, setDhikrList] = useState(INITIAL_DHIKR);
  const [history, setHistory] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(100);
  const [todayTotal, setTodayTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);

  useEffect(() => {
    if (user) {
      api.get('/dhikr/history').then(res => setHistory(res.data.records || [])).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    try {
      const todayKey = getDhikrKey();
      const raw = localStorage.getItem(todayKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setTodayTotal(parsed.todayTotal || 0);
        setDailyGoal(parsed.dailyGoal || 100);
        setCompletedToday(!!parsed.completedToday);
      }
      const streakRaw = localStorage.getItem('noor_dhikr_streak');
      if (streakRaw) setStreak(parseInt(streakRaw, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  const increment = () => {
    setCount(c => c + 1);
  };

  const reset = () => {
    if (count > 0) {
      const newTotal = todayTotal + count;
      setTodayTotal(newTotal);
      const goalReachedNow = !completedToday && newTotal >= dailyGoal;
      if (goalReachedNow) {
        setCompletedToday(true);
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        localStorage.setItem('noor_dhikr_streak', String(nextStreak));
      }
      try {
        localStorage.setItem(
          getDhikrKey(),
          JSON.stringify({ todayTotal: newTotal, dailyGoal, completedToday: goalReachedNow || completedToday })
        );
      } catch {
        // ignore
      }
    }

    if (count > 0 && user) {
      api.post('/dhikr', { dhikrText: activeDhikr, count }).catch(() => {});
      setHistory(prev => [{ dhikrText: activeDhikr, count, date: new Date() }, ...prev]);
    }
    setCount(0);
  };

  const addCustom = () => {
    const txt = customDhikr.trim();
    if (txt && !dhikrList.includes(txt)) {
      setDhikrList(prev => [...prev, txt]);
      setActiveDhikr(txt);
      setCustomDhikr('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-arabic text-3xl font-bold text-islamic-green dark:text-islamic-gold mb-6">
        📿 Dhikr Counter
      </h1>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {dhikrList.map((text) => (
          <button
            key={text}
            onClick={() => { setActiveDhikr(text); setCount(0); }}
            className={`px-4 py-3 rounded-xl border ${activeDhikr === text ? 'border-islamic-gold bg-islamic-gold/10' : 'border-gray-200 dark:border-gray-700'}`}
          >
            {text}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add custom dhikr..."
          value={customDhikr}
          onChange={e => setCustomDhikr(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustom()}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        />
        <button onClick={addCustom} className="px-4 py-2 rounded-lg bg-islamic-green text-white">
          Add
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
          <h2 className="text-lg font-semibold mb-2">Daily Dhikr Goal</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Set a daily target and track how much dhikr you complete today.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={10}
              step={10}
              value={dailyGoal}
              onChange={e => {
                const val = parseInt(e.target.value || '0', 10);
                setDailyGoal(val);
                try {
                  localStorage.setItem(
                    getDhikrKey(),
                    JSON.stringify({ todayTotal, dailyGoal: val, completedToday })
                  );
                } catch {
                  // ignore
                }
              }}
              className="w-28 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
            />
            <div className="text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                Today: <span className="font-semibold text-islamic-gold">{todayTotal}</span> / {dailyGoal}
              </p>
              {completedToday && (
                <p className="text-green-600 dark:text-green-400 font-semibold">Alhamdulillah, goal reached today!</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-52 p-4 rounded-2xl bg-islamic-green text-white shadow flex flex-col justify-center items-center">
          <p className="text-sm opacity-80 mb-1">Dhikr Streak</p>
          <p className="text-4xl font-bold mb-1">{streak}</p>
          <p className="text-xs opacity-80 text-center">
            Days you have reached your daily goal (on this device).
          </p>
        </div>
      </div>
      <div className="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg mb-6">
        <p className="text-2xl text-islamic-green dark:text-islamic-gold mb-4">{activeDhikr}</p>
        <p className="text-6xl font-bold text-islamic-gold mb-6">{count}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={increment}
            className="px-8 py-4 rounded-xl bg-islamic-green text-white text-xl hover:bg-islamic-green-dark transition"
          >
            Tap
          </button>
          <button
            onClick={reset}
            className="px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Reset & Save
          </button>
        </div>
      </div>
      {user && history.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-2">Recent History</h2>
          <ul className="space-y-2">
            {history.slice(0, 10).map((r, i) => (
              <li key={i} className="flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-800">
                <span>{r.dhikrText}</span>
                <span className="text-islamic-gold">{r.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
