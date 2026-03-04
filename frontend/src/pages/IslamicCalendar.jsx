import { useState, useEffect } from 'react';

const IMPORTANT_DATES = [
  { month: 1, day: 10, name: 'Ashura' },
  { month: 3, day: 12, name: "Mawlid al-Nabi" },
  { month: 7, day: 27, name: 'Isra and Mi\'raj' },
  { month: 8, day: 15, name: 'Shab-e-Barat' },
  { month: 9, day: 1, name: 'Ramadan begins' },
  { month: 9, day: 27, name: 'Laylat al-Qadr' },
  { month: 10, day: 1, name: 'Eid al-Fitr' },
  { month: 12, day: 10, name: 'Eid al-Adha' }
];

function daysUntil(month, day) {
  const now = new Date();
  let d = new Date(now.getFullYear(), month - 1, day);
  if (d < now) d.setFullYear(d.getFullYear() + 1);
  return Math.ceil((d - now) / 86400000);
}

export default function IslamicCalendar() {
  const [hijri, setHijri] = useState(null);

  useEffect(() => {
    fetch(`https://api.aladhan.com/v1/gToH?date=${new Date().toLocaleDateString('en-CA')}`)
      .then(r => r.json())
      .then(res => setHijri(res?.data?.hijri))
      .catch(() => {});
  }, []);

  const ramadanDays = hijri?.month?.number === 9 ? hijri.day : (hijri?.month?.number === 10 ? 0 : null);
  const daysToRamadan = daysUntil(9, 1);
  const daysToEidFitr = daysUntil(10, 1);
  const daysToEidAdha = daysUntil(12, 10);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-arabic text-3xl font-bold text-islamic-green dark:text-islamic-gold mb-6">
        🗓 Islamic Calendar
      </h1>
      {hijri && (
        <div className="mb-8 p-6 rounded-2xl bg-islamic-green/10 dark:bg-islamic-green/20 text-center">
          <p className="text-2xl font-bold text-islamic-green dark:text-islamic-gold">
            {hijri.day} {hijri.month?.en} {hijri.year} AH
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{hijri.weekday?.en}</p>
        </div>
      )}
      <div className="space-y-4 mb-8">
        <div className="p-4 rounded-xl border border-islamic-gold bg-islamic-gold/10">
          <h3 className="font-bold text-islamic-green">Ramadan Countdown</h3>
          <p className="text-2xl">
            {ramadanDays !== null ? `Day ${ramadanDays} of Ramadan` : daysToRamadan > 0 ? `${daysToRamadan} days to Ramadan` : 'Ramadan has passed'}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold">Eid al-Fitr</h3>
          <p className="text-xl text-islamic-gold">{daysToEidFitr} days</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold">Eid al-Adha</h3>
          <p className="text-xl text-islamic-gold">{daysToEidAdha} days</p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Important Islamic Dates</h2>
      <ul className="space-y-2">
        {IMPORTANT_DATES.map((d, i) => (
          <li key={i} className="flex justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <span>{d.name}</span>
            <span className="text-islamic-gold">Month {d.month}, Day {d.day}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
