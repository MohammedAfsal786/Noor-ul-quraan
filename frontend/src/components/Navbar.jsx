import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/quran', label: 'Quran' },
    { to: '/duas', label: 'Duas' },
    { to: '/dhikr', label: 'Dhikr' },
    { to: '/prayer-times', label: 'Prayer' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/audio', label: 'Audio' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-islamic-green dark:bg-islamic-green-dark text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-arabic text-xl font-bold">
            <span className="text-2xl">🕌</span>
            <span>Noor-ul-Quran</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg transition ${isActive ? 'bg-islamic-gold/30 text-islamic-gold-light' : 'hover:bg-white/10'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <div className="relative">
                <Link to="/profile" className="px-4 py-2 rounded-lg bg-islamic-gold/20 hover:bg-islamic-gold/30">
                  {user.name}
                </Link>
                <button onClick={logout} className="ml-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-lg bg-islamic-gold/20 hover:bg-islamic-gold/30">
                Login
              </Link>
            )}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden py-2 animate-fade-in">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${isActive ? 'bg-islamic-gold/30' : 'hover:bg-white/10'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
