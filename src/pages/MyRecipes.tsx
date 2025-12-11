import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Recipe } from '../types';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import Footer from '../components/Footer';

type TabType = 'Saved' | 'History';

interface CustomizedRecipe extends Recipe {
  isCustomized?: boolean;
}

function MyRecipes() {
  const [activeTab, setActiveTab] = useState<TabType>('Saved');
  const [savedRecipes, setSavedRecipes] = useState<CustomizedRecipe[]>([]);
  const [historyRecipes, setHistoryRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAllRecipes();
  }, [user, navigate]);

  async function fetchAllRecipes() {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: saved, error: savedError } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (savedError) throw savedError;

      const recipeIds = saved?.map(s => s.recipe_id).filter(id => id != null) || [];
      
      if (recipeIds.length === 0) {
        setSavedRecipes([]);
        setHistoryRecipes([]);
        setLoading(false);
        return;
      }
      
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds);

      if (recipesError) throw recipesError;

      const recipesWithCustom = saved?.map(item => {
        const recipe = recipesData?.find(r => r.id === item.recipe_id);
        if (!recipe) return null;

        return {
          ...recipe,
          isCustomized: !!(item.custom_ingredients || item.custom_instructions || item.custom_notes)
        } as CustomizedRecipe;
      }).filter((r): r is CustomizedRecipe => r !== null);

      setSavedRecipes(recipesWithCustom || []);

      const { data: history, error: historyError } = await supabase
        .from('recipe_views')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(20);

      if (historyError) throw historyError;

      const historyRecipeIds = [...new Set(history?.map(h => h.recipe_id))];
      const { data: historyRecipesData, error: historyRecipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', historyRecipeIds);

      if (historyRecipesError) throw historyRecipesError;

      const uniqueHistory: Recipe[] = [];
      const seenRecipeIds = new Set<number>();
      
      history?.forEach(item => {
        if (!seenRecipeIds.has(item.recipe_id)) {
          seenRecipeIds.add(item.recipe_id);
          const recipe = historyRecipesData?.find(r => r.id === item.recipe_id);
          if (recipe) uniqueHistory.push(recipe);
        }
      });

      setHistoryRecipes(uniqueHistory);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }

  const currentRecipes = activeTab === 'Saved' ? savedRecipes : historyRecipes;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-gray-400">Loading your recipes...</div>
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
          <h1 className="text-4xl font-bold mb-8 text-center">My Recipes</h1>

          <div className="flex gap-4 mb-12 border-b border-gray-700">
            {(['Saved', 'History'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition border-b-2 ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab} ({tab === 'Saved' ? savedRecipes.length : historyRecipes.length})
              </button>
            ))}
          </div>

          {currentRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentRecipes.map((recipe, index) => (
                <div key={recipe.id || index} className="relative">
                  <RecipeCard recipe={recipe} />
                  {('isCustomized' in recipe) && recipe.isCustomized && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modified
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              {activeTab === 'Saved' && (
                <div className="text-center text-gray-400 py-12">
                  <p className="text-xl mb-2">No saved recipes yet</p>
                  <p className="text-sm mb-6">Start exploring and save your favorites!</p>
                  <a href="/browse" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition">
                    Browse Recipes
                  </a>
                </div>
              )}

              {activeTab === 'History' && (
                <div className="text-center text-gray-400 py-12">
                  <p className="text-xl mb-2">No viewing history yet</p>
                  <p className="text-sm mb-6">Start exploring recipes to build your history!</p>
                  <a href="/browse" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition">
                    Browse Recipes
                  </a>
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

export default MyRecipes;