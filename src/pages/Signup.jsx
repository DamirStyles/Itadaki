import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMessage('');
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      setResendMessage('Confirmation email sent! Check your inbox.');
    } catch (err) {
      setResendMessage('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Check Your Email!</h2>
            <p className="text-gray-400">
              We've sent a confirmation link to <span className="text-orange-500">{email}</span>
            </p>
            <p className="text-gray-400 mt-4">
              Click the link in the email to activate your account.
            </p>
            <p className="text-orange-500 font-semibold mt-4">
              After confirming, you'll be able to link your MyAnimeList account for personalized recommendations!
            </p>

            <div className="mt-8">
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-gray-400 hover:text-white underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? 'Sending...' : "Didn't receive the email? Resend"}
              </button>
              
              {resendMessage && (
                <p className={`mt-2 text-sm ${resendMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                  {resendMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="mb-12">
        <a href="/" className="inline-flex items-center gap-3">
          <img src="/Logo.png" alt="Itadaki Logo" className="w-16 h-16" />
          <span className="text-orange-500 text-4xl font-logo tracking-wide">Itadaki</span>
        </a>
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">Create Account</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

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
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-transparent text-white border-b-2 border-orange-500 pb-2 focus:outline-none focus:border-orange-400 transition"
            />
            <p className="text-gray-500 text-xs mt-2">Use at least 6 characters, do not use empty spaces</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white font-semibold py-3 rounded-full transition mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="text-center mt-8 text-white">
          Already have an account?{' '}
          <a href="/login" className="text-orange-500 hover:text-orange-400 font-semibold transition">
            LOG IN
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;