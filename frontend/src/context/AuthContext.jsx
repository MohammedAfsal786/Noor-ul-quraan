import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/profile').then(res => setUser(res.data.user)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const fetchProfile = async () => {
    const res = await api.get('/auth/profile');
    setUser(res.data.user);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    await fetchProfile();
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    await fetchProfile();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateLastRead = async (surahNumber, ayahNumber) => {
    if (user) {
      await api.put('/auth/last-read', { surahNumber, ayahNumber });
      setUser(u => ({ ...u, lastRead: { surahNumber, ayahNumber } }));
    }
  };

  const addBookmark = async (surahNumber, ayahNumber, surahName) => {
    await api.post('/bookmarks', { surahNumber, ayahNumber, surahName });
    setUser(u => ({ ...u, bookmarks: [...(u.bookmarks || []), { surahNumber, ayahNumber, surahName }] }));
  };

  const removeBookmark = async (surahNumber, ayahNumber) => {
    await api.delete(`/bookmarks/${surahNumber}/${ayahNumber}`);
    setUser(u => ({ ...u, bookmarks: (u.bookmarks || []).filter(b => !(b.surahNumber == surahNumber && b.ayahNumber == ayahNumber)) }));
  };

  const isBookmarked = (surahNumber, ayahNumber) =>
    (user?.bookmarks || []).some(b => b.surahNumber == surahNumber && b.ayahNumber == ayahNumber);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateLastRead, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
