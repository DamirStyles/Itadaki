import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Debounced search: wait 300ms after user stops typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .rpc('search_recipes', { search_term: searchQuery });

        if (error) throw error;
        
        const formattedResults = (data || []).slice(0, 5).map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          hero_image_url: recipe.hero_image_url,
          anime: recipe.anime
        }));
        
        setSearchResults(formattedResults);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = (recipe) => {
    const slug = recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    navigate(`/recipe/${slug}`);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  return (
    <nav className="bg-[#2C2C2C] text-white border-b border-gray-700">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center h-16 -mb-px">
          <a href="/" className="group flex items-center gap-3 px-6 hover:bg-[#1a1a1a] transition h-full">
            <img src="/Logo.png" alt="Itadaki Logo" className="w-10 h-10" />
            <span className="text-orange-500 group-hover:text-white text-2xl font-logo tracking-wide transition">
              Itadaki
            </span>
          </a>

          <a href="/browse" className="text-gray-400 hover:text-white hover:bg-[#1a1a1a] px-6 flex items-center transition-all text-lg h-full">
            Browse
          </a>
          <a href="/search" className="text-gray-400 hover:text-white hover:bg-[#1a1a1a] px-6 flex items-center transition-all text-lg h-full">
            Search
          </a>
          <a href="/my-recipes" className="text-gray-400 hover:text-white hover:bg-[#1a1a1a] px-6 flex items-center transition-all text-lg h-full">
            My Recipes
          </a>

          <div className="flex-1"></div>

          <div className="flex items-center gap-4 pr-6">
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchDropdown(true)}
                  className="bg-[#1a1a1a] text-white px-4 py-2 pr-10 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Search">
                  <svg className="w-5 h-5 text-gray-400 hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>

              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-gray-700 shadow-xl z-50">
                  {isSearching ? (
                    <div className="px-4 py-3 text-gray-400 text-center">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((recipe) => (
                        <div
                          key={recipe.id}
                          onClick={() => handleResultClick(recipe)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#2C2C2C] cursor-pointer transition border-b border-gray-800 last:border-b-0"
                        >
                          <img 
                            src={recipe.hero_image_url} 
                            alt={recipe.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="text-white font-semibold">{recipe.title}</div>
                            <div className="text-gray-400 text-sm">{recipe.anime?.title}</div>
                          </div>
                        </div>
                      ))}
                      <div className="px-4 py-3 text-center border-t border-gray-700">
                        <button
                          onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="text-orange-500 hover:text-orange-400 text-sm font-semibold"
                        >
                          View all results →
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-3 text-gray-400 text-center">
                      No recipes found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className={`px-3 h-16 flex items-center transition cursor-pointer ${isDropdownOpen ? 'bg-[#1a1a1a]' : ''}`}>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full w-56 bg-[#1a1a1a] border-l border-b border-gray-700 shadow-lg py-2 z-50">
                  {user ? (
                    <>
                      <a href="/account-settings" className="block px-4 py-3 text-gray-300 hover:bg-[#2C2C2C] hover:text-white transition">
                        Account Settings
                      </a>
                      <hr className="border-gray-700 my-2" />
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left block px-4 py-3 text-gray-300 hover:bg-[#2C2C2C] hover:text-white transition"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <a href="/login" className="block px-4 py-3 text-gray-300 hover:bg-[#2C2C2C] hover:text-white transition">
                        Login
                      </a>
                      <a href="/signup" className="block px-4 py-3 text-gray-300 hover:bg-[#2C2C2C] hover:text-white transition">
                        Create Account
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;