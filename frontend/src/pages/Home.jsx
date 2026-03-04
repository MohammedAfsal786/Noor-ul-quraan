import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const features = [
  { to: '/quran', icon: '📖', title: 'Quran', desc: 'Read full Quran with translation, transliteration & audio' },
  { to: '/duas', icon: '🤲', title: 'Duas', desc: 'Daily duas, morning & evening, and situational supplications' },
  { to: '/dhikr', icon: '📿', title: 'Dhikr Counter', desc: 'Digital tasbeeh with custom dhikr and history' },
  { to: '/prayer-times', icon: '🕌', title: 'Prayer Times', desc: 'Accurate prayer times with countdown & notifications' },
  { to: '/calendar', icon: '🗓', title: 'Islamic Calendar', desc: 'Hijri calendar, Ramadan & Eid countdown' },
  { to: '/audio', icon: '🎧', title: 'Islamic Audio', desc: 'Quran recitations, lectures & nasheeds' }
];

export default function Home() {
  const [dailyDuas, setDailyDuas] = useState([]);

  useEffect(() => {
    api
      .get('/duas?category=daily')
      .then(res => {
        const list = res.data?.duas || [];
        setDailyDuas(list.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-islamic-pattern min-h-[60vh]">
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="font-arabic text-4xl md:text-5xl font-bold text-islamic-green dark:text-islamic-gold-light mb-4">
          Noor-ul-Quran
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Islamic Learning Platform – Your gateway to the Quran, Duas, Prayer Times, Dhikr, and more.
        </p>
        {dailyDuas.length > 0 && (
          <div className="max-w-3xl mx-auto mt-8 text-left bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow border border-islamic-gold/40 p-6">
            <h2 className="text-lg font-semibold text-islamic-green dark:text-islamic-gold mb-3">
              Today&apos;s Recommended Duas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Reflect on these daily supplications. You can find more in the Duas section.
            </p>
            <div className="space-y-3">
              {dailyDuas.map((dua) => (
                <div key={dua._id || dua.title} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                  <p className="font-arabic text-xl text-right mb-1" dir="rtl">
                    {dua.arabic}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic mb-1">{dua.transliteration}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{dua.english}</p>
                </div>
              ))}
            </div>
            <div className="text-right mt-3">
              <Link to="/duas" className="text-sm text-islamic-green dark:text-islamic-gold hover:underline">
                View all duas →
              </Link>
            </div>
          </div>
        )}
      </section>
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ to, icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="block p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition border border-gray-100 dark:border-gray-700 hover:border-islamic-gold/50 group"
            >
              <span className="text-4xl block mb-3 group-hover:scale-110 transition">{icon}</span>
              <h2 className="text-xl font-bold text-islamic-green dark:text-islamic-gold mb-2">{title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
