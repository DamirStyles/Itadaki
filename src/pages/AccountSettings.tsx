import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { initiateMALLogin } from '../services/malOAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Section = 'Account' | 'Integrations';

function AccountSettings() {
  const [activeSection, setActiveSection] = useState<Section>('Account');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [malConnected, setMalConnected] = useState(false);
  const [malUsername, setMalUsername] = useState('');
  
  const [isContributor, setIsContributor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  async function loadUserData() {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      if (profile) {
        setUsername((profile as any).username || '');
        setIsContributor((profile as any).is_contributor || false);
        
        if ((profile as any).mal_access_token) {
          setMalConnected(true);
          setMalUsername((profile as any).mal_username || 'Connected');
        }
      }

      setEmail(user!.email || '');
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }

  async function handleUnlinkMAL() {
    if (!confirm('Are you sure you want to unlink your MyAnimeList account? This will remove personalized recommendations.')) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await (supabase
        .from('user_profiles')
        .update as any)({
          mal_access_token: null,
          mal_refresh_token: null,
          mal_token_expires_at: null,
          mal_username: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id);

      if (error) throw error;

      setMalConnected(false);
      setMalUsername('');
      setSuccess('MyAnimeList account unlinked successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error unlinking MAL:', error);
      setError('Failed to unlink MyAnimeList account');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAccount() {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (email !== user!.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email
        });

        if (emailError) throw emailError;
      }

      if (isContributor && username) {
        const { error: profileError } = await (supabase
          .from('user_profiles')
          .update as any)({
            username: username,
            updated_at: new Date().toISOString()
          })
          .eq('id', user!.id);

        if (profileError) throw profileError;
      }

      setSuccess('Account updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving account:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save account changes';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    setError('');
    setSuccess('');

    if (!newPassword) {
      setError('Password field is required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess('Password changed successfully!');
      setNewPassword('');
      setShowPassword(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all your saved recipes, ratings, and customizations. Continue?')) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user!.id);

      if (profileError) throw profileError;

      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please contact support.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-gray-400">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 py-12">
        <div className="max-w-[1400px] mx-auto px-12">
          <h1 className="text-4xl font-bold mb-12">Account Settings</h1>

          <div className="flex gap-8">
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('Account')}
                  className={`w-full text-left px-4 py-3 text-lg transition ${
                    activeSection === 'Account' ? 'text-orange-500 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Account
                </button>
                <button
                  onClick={() => setActiveSection('Integrations')}
                  className={`w-full text-left px-4 py-3 text-lg transition ${
                    activeSection === 'Integrations' ? 'text-orange-500 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Integrations
                </button>
              </nav>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-3xl space-y-16">
                {success && (
                  <div className="p-4 bg-green-500/10 border border-green-500 text-green-500">
                    {success}
                  </div>
                )}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500 text-red-500">
                    {error}
                  </div>
                )}
                
                {activeSection === 'Account' && (
                  <div className="space-y-16">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Account Information</h2>
                      <p className="text-gray-400 mb-8">Manage your account details and password</p>

                      <div className="space-y-6">
                        {isContributor && (
                          <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-300">Username</label>
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Your display name"
                              className="w-full bg-[#0D0D0D] border border-gray-800 text-white px-4 py-3 focus:border-orange-500 focus:outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">This will be displayed on recipes you create</p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-300">Email Address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full bg-[#0D0D0D] border border-gray-800 text-white px-4 py-3 focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <button 
                          onClick={handleSaveAccount}
                          disabled={saving}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>

                    <div className="pt-16 border-t border-gray-800">
                      <h2 className="text-3xl font-bold mb-2">Change Password</h2>
                      <p className="text-gray-400 mb-8">Update your password to keep your account secure</p>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-300">New Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password (min 6 characters)"
                              className="w-full bg-[#0D0D0D] border border-gray-800 text-white px-4 py-3 pr-12 focus:border-orange-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Make sure you can see and verify your password before saving</p>
                        </div>

                        <button 
                          onClick={handleChangePassword}
                          disabled={saving}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </div>
                    </div>

                    <div className="pt-16 border-t border-gray-800">
                      <h2 className="text-3xl font-bold mb-2 text-red-500">Danger Zone</h2>
                      <p className="text-gray-400 mb-8">Once you delete your account, there is no going back. Please be certain.</p>
                      
                      <button 
                        onClick={handleDeleteAccount}
                        disabled={saving}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Deleting...' : 'Delete Account'}
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'Integrations' && (
                  <div className="space-y-16">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Integrations</h2>
                      <p className="text-gray-400 mb-8">Connect external services to enhance your experience</p>
                    </div>

                    <div className="bg-[#0D0D0D] border border-gray-800 p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#2e51a2] flex items-center justify-center text-white font-bold text-xl">
                            MAL
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">MyAnimeList</h3>
                            <p className="text-sm text-gray-400">Get personalized recipe recommendations</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 text-xs font-semibold ${
                          malConnected 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                          {malConnected ? 'Connected' : 'Not Connected'}
                        </div>
                      </div>

                      {malConnected ? (
                        <div>
                          <div className="mb-6 p-4 bg-black border border-gray-800">
                            <p className="text-sm text-gray-500 mb-1">Connected as</p>
                            <p className="text-white font-semibold">{malUsername}</p>
                          </div>
                          <p className="text-sm text-gray-400 mb-6">
                            Your MyAnimeList account is linked. We use your anime list to recommend recipes from shows you've watched!
                          </p>
                          <button 
                            onClick={handleUnlinkMAL}
                            disabled={saving}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? 'Unlinking...' : 'Unlink Account'}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-400 mb-6">
                            Connect your MyAnimeList account to get personalized recipe recommendations based on anime you've watched. Your login credentials are never shared with us.
                          </p>
                          <button 
                            onClick={initiateMALLogin}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 transition"
                          >
                            Link MyAnimeList Account
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AccountSettings;