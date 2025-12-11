import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { malService } from '../services/malService';
import { recipeService } from '../services/recipeService';
import RecipeCard from './RecipeCard';
import { Recipe } from '../types';

function MALRecipesCarousel() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadMALRecipes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadMALRecipes = async () => {
    if (!user) return;
    try {
      const malIds = await malService.getUserAnimeList(user.id);

      if (malIds.length === 0) {
        setLoading(false);
        return;
      }

      const recipeData = await recipeService.getRecipesFromMALList(malIds);
      setRecipes(recipeData);
    } catch (error) {
      console.error('Error loading MAL recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 320;
    const gap = 24;
    const scrollAmount = (cardWidth + gap) * 4;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="mb-12">
        <div className="max-w-[1400px] mx-auto px-12">
          <h2 className="text-3xl font-bold text-white mb-6">From Your MAL</h2>
          <div className="text-gray-400">Loading personalized recommendations...</div>
        </div>
      </div>
    );
  }

  // Only show if user has enough recipes for a meaningful carousel
  if (recipes.length < 8) {
    return null;
  }

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-12 mb-4">
        <h2 className="text-3xl font-bold text-white">From Your MAL</h2>
      </div>
      
      <div className="relative group max-w-[1400px] mx-auto px-12">
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="overflow-x-hidden overflow-y-hidden scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="w-80 flex-shrink-0">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MALRecipesCarousel;