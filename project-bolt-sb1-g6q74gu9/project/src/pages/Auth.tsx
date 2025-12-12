import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Mail, Lock, User, Chrome } from 'lucide-react';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, signIn, signInWithGoogle, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const validateForm = () => {
    if (!email.includes('@')) {
      setLocalError('有効なメールアドレスを入力してください');
      return false;
    }
    if (password.length < 6) {
      setLocalError('パスワードは6文字以上である必要があります');
      return false;
    }
    if (isSignUp && displayName.trim().length === 0) {
      setLocalError('表示名を入力してください');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
      >
        <Zap className="w-5 h-5" />
        <span className="font-semibold">朝活チャレンジ</span>
      </button>

      <div className="w-full max-w-md">
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'アカウント作成' : 'ログイン'}
            </h2>
            <p className="text-gray-400">
              {isSignUp
                ? '朝活チャレンジを始めましょう'
                : '継続の力を手に入れる'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  表示名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 transition-colors"
                    placeholder="太郎"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 transition-colors"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 transition-colors"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {displayError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-400">
                {displayError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-all transform hover:scale-105 mt-6"
            >
              {loading ? (isSignUp ? '作成中...' : 'ログイン中...') : (isSignUp ? 'アカウント作成' : 'ログイン')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/60 text-gray-400">または</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome className="w-5 h-5" />
            Google でログイン
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'アカウントをお持ちですか？' : 'アカウントをお持ちですか？'}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setLocalError('');
                }}
                disabled={loading}
                className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors disabled:opacity-50"
              >
                {isSignUp ? 'ログイン' : '登録'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          利用することで利用規約およびプライバシーポリシーに同意したものとします
        </p>
      </div>
    </div>
  );
};
