import { supabase } from '../lib/supabaseClient';

export const recipeService = {
  async getRecipesFromMALList(malIds) {
    if (!malIds || malIds.length === 0) {
      return [];
    }

    try {
      const { data: animeData, error: animeError } = await supabase
        .from('anime')
        .select('id, mal_id, title')
        .in('mal_id', malIds);

      if (animeError) throw animeError;
      
      if (!animeData || animeData.length === 0) {
        return [];
      }

      const animeIds = animeData.map(anime => anime.id);

      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          anime:anime_id (
            id,
            mal_id,
            title
          )
        `)
        .in('anime_id', animeIds)
        .limit(20);

      if (recipesError) throw recipesError;

      return recipes || [];
    } catch (error) {
      console.error('Error fetching recipes from MAL list:', error);
      return [];
    }
  }
};