
export interface UserProfile {
  id: string; // uuid
  username: string | null;
  is_contributor: boolean;
  display_language: string;
  measurement_unit: string;
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
  mal_access_token: string | null;
  mal_refresh_token: string | null;
  mal_token_expires_at: string | null; // timestamptz
  mal_username: string | null;
}

export interface Anime {
  id: number;
  mal_id: number;
  title: string;
  cover_image_url: string | null;
  created_at: string; // timestamptz
}


export interface Recipe {
  id: number;
  title: string;
  description: string;
  hero_image_url: string;
  meal_type: string;
  rating: number;
  rating_count: number;
  created_by_user_id: string | null; // uuid, null = original recipe
  created_at: string; // timestamptz
  view_count: number;
  popularity_score: number;
  updated_at: string; // timestamptz
  anime_id: number | null;
}

export interface Ingredient {
  id: number;
  recipe_id: number;
  name: string;
  amount_imperial: string;
  amount_metric: string;
  order_index: number;
}

export interface Instruction {
  id: number;
  recipe_id: number;
  step_number: number;
  instruction_text: string;
}

export interface CustomRecipe {
  id: number;
  user_id: string; // uuid
  original_recipe_id: number;
  title: string;
  description: string;
  hero_image_url: string;
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
}

export interface SavedRecipe {
  id: number;
  user_id: string; // uuid
  recipe_id: number;
  saved_at: string; // timestamptz
  custom_ingredients: string | null;
  custom_instructions: string | null;
  custom_notes: string | null;
  created_at: string; // timestamptz
}

export interface Rating {
  id: number;
  user_id: string; // uuid
  recipe_id: number;
  rating: number;
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
}

export interface RecipeView {
  id: number;
  user_id: string; // uuid
  recipe_id: number;
  viewed_at: string; // timestamptz
}

export interface RecipeHistory {
  id: string; // uuid
  user_id: string; // uuid
  recipe_id: number;
  viewed_at: string; // timestamptz
}

export interface ContributorApplication {
  id: number;
  user_id: string; // uuid
  application_text: string;
  status: string;
  submitted_at: string; // timestamptz
  reviewed_at: string | null; // timestamptz
  reviewed_by_admin_id: string | null; // uuid
}

export interface RecipeWithDetails extends Recipe {
  ingredients: Ingredient[];
  instructions: Instruction[];
  anime?: Anime;
}

export interface RecipeWithInteractions extends Recipe {
  user_rating?: number;
  is_saved?: boolean;
  ingredients: Ingredient[];
  instructions: Instruction[];
}