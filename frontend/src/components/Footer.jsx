import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-islamic-green dark:bg-islamic-green-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-arabic text-lg font-bold mb-2 flex items-center gap-2">
              <span>🕌</span> Noor-ul-Quran
            </h3>
            <p className="text-sm opacity-90">
              Islamic Learning Platform – Quran, Duas, Prayer Times, Dhikr &amp; more.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/quran" className="hover:text-islamic-gold-light">Quran</Link></li>
              <li><Link to="/duas" className="hover:text-islamic-gold-light">Duas</Link></li>
              <li><Link to="/dhikr" className="hover:text-islamic-gold-light">Dhikr Counter</Link></li>
              <li><Link to="/prayer-times" className="hover:text-islamic-gold-light">Prayer Times</Link></li>
              <li><Link to="/calendar" className="hover:text-islamic-gold-light">Islamic Calendar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <p className="text-sm opacity-90">
              Prayer times from Aladhan API. Quran data from Al Quran Cloud API.
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-6 pt-6 text-center text-sm opacity-80">
          © {year} Noor-ul-Quran – Islamic Learning Platform. Barakallahu feekum.
        </div>
      </div>
    </footer>
  );
}
