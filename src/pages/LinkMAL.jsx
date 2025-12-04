import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { initiateMALLogin } from '../services/malOAuth';

function LinkMAL() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('mal_access_token')
        .eq('id', user.id)
        .single();

      if (profile?.mal_access_token) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking MAL connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Itadaki Logo" className="w-16 h-16" />
            <span className="text-orange-500 text-4xl font-logo tracking-wide">Itadaki</span>
          </div>
        </div>

        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-white mb-4">Already Connected!</h1>
            <p className="text-gray-400">Your MyAnimeList account is linked.</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-full transition"
          >
            GO TO HOME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="mb-12">
        <div className="flex items-center gap-3">
          <img src="/Logo.png" alt="Itadaki Logo" className="w-16 h-16" />
          <span className="text-orange-500 text-4xl font-logo tracking-wide">Itadaki</span>
        </div>
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">Link Your MAL Account</h1>
        <p className="text-gray-400 text-center mb-12">
          Connect your MyAnimeList to get personalized recipe recommendations from anime you've watched!
        </p>

        <div className="space-y-6">
          <button
            onClick={initiateMALLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-full transition text-lg"
          >
            LINK ACCOUNT
          </button>

          <button
            onClick={handleSkip}
            className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white font-semibold py-3 rounded-full transition"
          >
            Skip
          </button>
        </div>

        <p className="text-gray-500 text-sm text-center mt-8">
          You'll be redirected to MyAnimeList to authorize Itadaki. Your login credentials are never shared with us.
        </p>
      </div>
    </div>
  );
}

export default LinkMAL;