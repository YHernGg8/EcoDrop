'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Mail, Key, User } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function AuthPage() {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // On success, the onAuthStateChanged listener in useAuth will handle the redirect
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">EcoDrop</h1>
        <p className="text-center text-gray-500 mb-8">{isLogin ? t.auth.welcomeBack : t.auth.createAccount}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder={t.auth.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder={t.auth.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:bg-green-300 flex items-center justify-center"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isLogin ? t.auth.login : t.auth.signup)}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? t.auth.noAccount : t.auth.alreadyAccount}
          <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-green-600 hover:underline ml-1">
            {isLogin ? t.auth.signup : t.auth.login}
          </button>
        </p>
      </div>
    </div>
  );
}
