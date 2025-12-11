import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      alert('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      setError((err as Error).message);
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
        <h1 className="text-4xl font-bold text-white mb-12 text-center">Reset Password</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-gray-400 text-sm mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              required
              className="w-full bg-transparent text-white border-b-2 border-orange-500 pb-2 focus:outline-none focus:border-orange-400 transition"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-transparent text-white border-b-2 border-orange-500 pb-2 focus:outline-none focus:border-orange-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white font-semibold py-3 rounded-full transition mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'RESETTING...' : 'RESET PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;