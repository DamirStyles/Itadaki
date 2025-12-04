import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResetSent(false);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="mb-12">
        <a href="/" className="inline-flex items-center gap-3">
          <img src="/Logo.png" alt="Itadaki Logo" className="w-16 h-16" />
          <span className="text-orange-500 text-4xl font-logo tracking-wide">Itadaki</span>
        </a>
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          {showForgotPassword ? 'Reset Password' : 'Log In'}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded text-green-500 text-sm">
            Password reset email sent! Check your inbox.
          </div>
        )}

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-8">
            <p className="text-gray-400 text-sm mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-white border-b-2 border-orange-500 pb-2 focus:outline-none focus:border-orange-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white font-semibold py-3 rounded-full transition mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setError('');
                setResetSent(false);
              }}
              className="w-full text-orange-500 hover:text-orange-400 font-semibold transition mt-4"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-white border-b-2 border-orange-500 pb-2 focus:outline-none focus:border-orange-400 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-400 text-sm">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-orange-500 hover:text-orange-400 text-sm font-semibold transition"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent text-white border-b-2 border-orange-500 pb-2 focus:outline-none focus:border-orange-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white font-semibold py-3 rounded-full transition mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'LOGGING IN...' : 'LOG IN'}
            </button>
          </form>
        )}

        {!showForgotPassword && (
          <p className="text-center mt-8 text-white">
            Don't have an account?{' '}
            <a href="/signup" className="text-orange-500 hover:text-orange-400 font-semibold transition">
              SIGN UP
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;