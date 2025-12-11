import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface RecipeInteractions {
  isSaved: boolean;
  userRating: number | null;
  loading: boolean;
  toggleSave: () => Promise<void>;
  rateRecipe: (rating: number) => Promise<void>;
}

export function useRecipeInteractions(recipeId: number | undefined): RecipeInteractions {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkInteractions() {
      if (!user || !recipeId) {
        setLoading(false);
        return;
      }

      try {
        const { data: savedData } = await supabase
          .from('saved_recipes')
          .select('id')
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId)
          .single();

        setIsSaved(!!savedData);

        const { data: ratingData } = await supabase
          .from('ratings')
          .select('rating')
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId)
          .single();

        setUserRating(ratingData?.rating || null);
      } catch (error) {
        console.error('Error checking interactions:', error);
      } finally {
        setLoading(false);
      }
    }

    checkInteractions();
  }, [user, recipeId]);

  const toggleSave = async (): Promise<void> => {
    if (!user || !recipeId) return;

    try {
      if (isSaved) {
        await supabase
          .from('saved_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
        setIsSaved(false);
      } else {
        await supabase
          .from('saved_recipes')
          .insert({ user_id: user.id, recipe_id: recipeId });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const rateRecipe = async (rating: number): Promise<void> => {
    if (!user || !recipeId) return;

    try {
      const { error } = await supabase
        .from('ratings')
        .upsert(
          {
            user_id: user.id,
            recipe_id: recipeId,
            rating: rating,
          },
          { onConflict: 'user_id,recipe_id' }
        );

      if (!error) {
        setUserRating(rating);
        
        // Recalculate average rating for the recipe
        const { data: allRatings } = await supabase
          .from('ratings')
          .select('rating')
          .eq('recipe_id', recipeId);

        if (allRatings) {
          const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
          await supabase
            .from('recipes')
            .update({ 
              rating: avgRating,
              rating_count: allRatings.length 
            })
            .eq('id', recipeId);
        }
      }
    } catch (error) {
      console.error('Error rating recipe:', error);
    }
  };

  return {
    isSaved,
    userRating,
    loading,
    toggleSave,
    rateRecipe,
  };
}