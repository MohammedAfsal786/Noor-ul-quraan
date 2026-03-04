import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      navigate('/');
    } catch (res) {
      setErr(res.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-islamic-green dark:text-islamic-gold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
        <button type="submit" className="w-full py-3 rounded-lg bg-islamic-green text-white font-semibold hover:bg-islamic-green-dark">
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
        Don't have an account? <Link to="/register" className="text-islamic-gold hover:underline">Register</Link>
      </p>
    </div>
  );
}
