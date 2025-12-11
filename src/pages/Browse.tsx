import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Recipe } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecipeCard from '../components/RecipeCard';

type MealType = 'All' | 'Appetizer' | 'Main' | 'Dessert' | 'Snack' | 'Drink' | 'Soup' | 'Breakfast';

interface CategoryCounts {
  [key: string]: number;
}

function Browse() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MealType>('All');
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({});

  const categories: MealType[] = ['All', 'Appetizer', 'Main', 'Dessert', 'Snack', 'Drink', 'Soup', 'Breakfast'];

  useEffect(() => {
    fetchRecipes();
    fetchCategoryCounts();
  }, [selectedCategory]);

  async function fetchCategoryCounts() {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('meal_type');

      if (error) throw error;

      const counts: CategoryCounts = (data as any[]).reduce((acc: CategoryCounts, recipe: any) => {
        acc[recipe.meal_type] = (acc[recipe.meal_type] || 0) + 1;
        return acc;
      }, {});

      counts['All'] = (data as any[]).length;
      setCategoryCounts(counts);
    } catch (error) {
      console.error('Error fetching category counts:', error);
    }
  }

  async function fetchRecipes() {
    setLoading(true);
    try {
      let query = supabase
        .from('recipes')
        .select('*, anime(title, cover_image_url)');

      if (selectedCategory !== 'All') {
        query = query.eq('meal_type', selectedCategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes((data as Recipe[]) || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <aside className="w-64 bg-black border-r border-gray-800">
          <div className="sticky top-24 p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Categories
            </h2>
            <nav className="space-y-1">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2 transition-colors flex items-center justify-between ${
                    selectedCategory === category
                      ? 'bg-orange-500/10 text-orange-500 border-l-4 border-orange-500'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{category}</span>
                  {categoryCounts[category] !== undefined && categoryCounts[category] > 0 && (
                    <span className="text-xs text-gray-500">
                      {categoryCounts[category]}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-12">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            {selectedCategory === 'All' ? 'All Recipes' : selectedCategory}
          </h1>
          <p className="text-gray-400 mb-8">
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} found
          </p>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-orange-500 mb-4"></div>
              <div className="text-gray-400 text-lg">Loading recipes...</div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 opacity-20">🍜</div>
              <div className="text-gray-400 text-xl mb-2">No recipes found</div>
              <div className="text-gray-500 text-sm">Try selecting a different category</div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Browse;