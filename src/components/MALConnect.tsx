import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function MALCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (!code) {
        throw new Error('No authorization code received');
      }

      // CSRF protection: verify state matches what we stored
      const savedState = sessionStorage.getItem('mal_state');
      if (state !== savedState) {
        throw new Error('State mismatch - possible CSRF attack');
      }

      const codeVerifier = sessionStorage.getItem('mal_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found');
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Not authenticated');
      }

      const { data, error: functionError } = await supabase.functions.invoke('mal-oauth', {
        body: {
          code,
          codeVerifier,
          userId: user.id,
        },
      });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      sessionStorage.removeItem('mal_code_verifier');
      sessionStorage.removeItem('mal_state');

      navigate('/', { state: { malConnected: true } });
    } catch (err) {
      console.error('OAuth callback error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setTimeout(() => navigate('/'), 3000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-500 text-2xl font-bold mb-4">Connection Failed</h2>
          <p className="text-white mb-4">{error}</p>
          <p className="text-gray-400">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-white text-xl">Connecting your MyAnimeList...</p>
      </div>
    </div>
  );
}

export default MALCallback;