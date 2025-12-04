import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import Footer from '../components/Footer';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchRecipes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .rpc('search_recipes', { search_term: searchQuery });

        if (error) {
          console.log('Full error object:', error);
          throw error;
        }
        setSearchResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce: wait 300ms after user stops typing
    const timeoutId = setTimeout(() => {
      searchRecipes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 py-12">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-white text-lg pl-10 pb-3 border-b-2 border-orange-500 focus:outline-none focus:border-orange-400 transition"
              />
            </div>
          </div>

          {searchQuery && (
            <>
              {loading ? (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-xl">Searching...</div>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">
                    Top Results
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {searchResults.map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <p className="text-xl mb-2">No recipes found for "{searchQuery}"</p>
                  <p className="text-sm">Try searching for an anime title or recipe name</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Search;