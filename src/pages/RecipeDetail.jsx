import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

function RecipeDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const [isCustomized, setIsCustomized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [displayIngredients, setDisplayIngredients] = useState([]);
  const [displayInstructions, setDisplayInstructions] = useState([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [slug]);

  useEffect(() => {
    if (recipe && user && ingredients.length > 0 && instructions.length > 0) {
      checkUserInteractions();
      trackView();
    }
  }, [recipe, user, ingredients, instructions]);

  async function trackView() {
    if (!user || !recipe) return;
    try {
      await supabase.from('recipe_views').insert({
        user_id: user.id,
        recipe_id: recipe.id
      });
    } catch (error) {
      console.log('View tracking:', error.message);
    }
  }

  async function fetchRecipe() {
    try {
      const recipeId = slug;

      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select('*, anime(title, mal_id, cover_image_url)')
        .eq('id', recipeId)
        .single();

      if (recipeError) throw recipeError;
      setRecipe(recipeData);

      const { data: ingredientsData } = await supabase
        .from('ingredients')
        .select('*')
        .eq('recipe_id', recipeData.id)
        .order('order_index');

      setIngredients(ingredientsData || []);

      const { data: instructionsData } = await supabase
        .from('instructions')
        .select('*')
        .eq('recipe_id', recipeData.id)
        .order('step_number');

      setInstructions(instructionsData || []);

      if (!user) {
        const displayIngs = (ingredientsData || []).map(i => ({ 
          text: `${i.amount_imperial || ''} ${i.name}`.trim() 
        }));
        const displayInsts = (instructionsData || []).map(inst => ({ 
          step: inst.step_number,
          text: inst.instruction_text 
        }));
        setDisplayIngredients(displayIngs);
        setDisplayInstructions(displayInsts);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkUserInteractions() {
    if (!user || !recipe) return;

    try {
      const { data: savedData } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .eq('recipe_id', recipe.id)
        .maybeSingle();

      setIsSaved(!!savedData);
      
      if (savedData) {
        const hasCustom = !!(savedData.custom_ingredients || savedData.custom_instructions || savedData.custom_notes);
        setIsCustomized(hasCustom);
        
        if (hasCustom) {
          const customIngredients = savedData.custom_ingredients?.map(text => ({ text })) || [];
          const customInstructions = savedData.custom_instructions?.map((text, idx) => ({ 
            step: idx + 1, 
            text 
          })) || [];
          
          setDisplayIngredients(customIngredients);
          setDisplayInstructions(customInstructions);
          setNotes(savedData.custom_notes || '');
        } else {
          loadOriginalRecipe();
        }
      } else {
        loadOriginalRecipe();
      }

      const { data: ratingData } = await supabase
        .from('ratings')
        .select('rating')
        .eq('user_id', user.id)
        .eq('recipe_id', recipe.id)
        .maybeSingle();

      setUserRating(ratingData?.rating || 0);
    } catch (error) {
      console.error('Error checking interactions:', error);
    }
  }

  function loadOriginalRecipe() {
    if (ingredients.length === 0 || instructions.length === 0) return;
    
    setDisplayIngredients(ingredients.map(i => ({ 
      text: `${i.amount_imperial || ''} ${i.name}`.trim() 
    })));
    setDisplayInstructions(instructions.map(inst => ({ 
      step: inst.step_number,
      text: inst.instruction_text 
    })));
    setNotes('');
  }

  async function handleSaveToggle() {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await supabase
          .from('saved_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipe.id);
        setIsSaved(false);
        setIsCustomized(false);
        setIsEditing(false);
        loadOriginalRecipe();
      } else {
        await supabase
          .from('saved_recipes')
          .insert({ user_id: user.id, recipe_id: recipe.id });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  }

  async function handleRatingClick(rating) {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await supabase
        .from('ratings')
        .upsert({
          user_id: user.id,
          recipe_id: recipe.id,
          rating: rating,
        }, { onConflict: 'user_id,recipe_id' });

      setUserRating(rating);
      
      const { data: allRatings } = await supabase
        .from('ratings')
        .select('rating')
        .eq('recipe_id', recipe.id);

      if (allRatings) {
        const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        await supabase
          .from('recipes')
          .update({ 
            rating: avgRating,
            rating_count: allRatings.length 
          })
          .eq('id', recipe.id);

        setRecipe(prev => ({
          ...prev,
          rating: avgRating,
          rating_count: allRatings.length
        }));
      }
    } catch (error) {
      console.error('Error rating recipe:', error);
    }
  }

  function handleStartEditing() {
    if (!isSaved) {
      alert('Please save this recipe first before customizing it!');
      return;
    }
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    if (isCustomized) {
      checkUserInteractions();
    } else {
      loadOriginalRecipe();
    }
  }

  async function handleSaveChanges() {
    if (!user || !recipe) return;

    setSaving(true);
    try {
      const customIngredientsArray = displayIngredients.map(ing => ing.text).filter(text => text.trim());
      const customInstructionsArray = displayInstructions.map(inst => inst.text).filter(text => text.trim());

      await supabase
        .from('saved_recipes')
        .update({
          custom_ingredients: customIngredientsArray,
          custom_instructions: customInstructionsArray,
          custom_notes: notes
        })
        .eq('user_id', user.id)
        .eq('recipe_id', recipe.id);

      setIsCustomized(true);
      setIsEditing(false);
      alert('Your changes have been saved!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  async function handleResetToOriginal() {
    if (!confirm('Reset to original recipe? This will delete your customizations.')) return;

    try {
      await supabase
        .from('saved_recipes')
        .update({
          custom_ingredients: null,
          custom_instructions: null,
          custom_notes: null
        })
        .eq('user_id', user.id)
        .eq('recipe_id', recipe.id);

      setIsCustomized(false);
      loadOriginalRecipe();
      alert('Recipe reset to original!');
    } catch (error) {
      console.error('Error resetting:', error);
      alert('Failed to reset recipe');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-orange-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-20">🍜</div>
            <div className="text-2xl text-gray-400 mb-4">Recipe not found</div>
            <a href="/browse" className="text-orange-500 hover:text-orange-400">
              Browse all recipes
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="relative h-[500px] bg-black">
          <img 
            src={recipe.hero_image_url}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-8 pb-12">
            <h1 className="text-6xl font-bold mb-4 drop-shadow-2xl leading-tight">
              {recipe.title}
              {isCustomized && (
                <span className="text-orange-500 text-2xl ml-4">(My Version)</span>
              )}
            </h1>
            {recipe.anime && (
              <div className="flex items-center gap-3">
                <div className="text-xs text-orange-400 uppercase tracking-wide">From</div>
                <div className="text-white text-lg font-medium">{recipe.anime.title}</div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="mb-12">
            {(() => {
              const descriptionParts = recipe.description.split(/(?=Prep:)/);
              const mainDescription = descriptionParts[0].trim();
              const timingInfo = descriptionParts[1] || '';
              
              return (
                <>
                  <p className="text-xl text-gray-300 leading-relaxed mb-4">
                    {mainDescription}
                  </p>
                  {timingInfo && (
                    <p className="text-base text-gray-400 mb-8 italic">
                      {timingInfo}
                    </p>
                  )}
                </>
              );
            })()}
            
            
            <div className="flex gap-8 mb-8">
              {recipe.prep_time && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Prep Time</div>
                  <div className="text-white text-xl font-bold">{recipe.prep_time} min</div>
                </div>
              )}
              {recipe.cook_time && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Cook Time</div>
                  <div className="text-white text-xl font-bold">{recipe.cook_time} min</div>
                </div>
              )}
              {recipe.servings && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Servings</div>
                  <div className="text-white text-xl font-bold">{recipe.servings}</div>
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <button 
                onClick={handleSaveToggle}
                className={`${
                  isSaved 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white px-6 py-3 flex items-center gap-2 transition font-medium`}
              >
                <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isSaved ? 'Saved' : 'Save Recipe'}
              </button>

              {isSaved && !isEditing && (
                <button 
                  onClick={handleStartEditing}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 flex items-center gap-2 transition font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Customize
                </button>
              )}

              {isCustomized && !isEditing && (
                <button 
                  onClick={handleResetToOriginal}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 flex items-center gap-2 transition font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              )}

              {isEditing && (
                <>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 flex items-center gap-2 transition font-medium disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 transition font-medium"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-12 mb-16">
            <div className="col-span-4">
              {displayIngredients.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-orange-500">
                    Ingredients
                  </h2>
                  
                  <ul className="space-y-3">
                    {displayIngredients.map((item, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-3">
                        <span className="text-orange-500 text-lg mt-1">•</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => {
                              const newIngredients = [...displayIngredients];
                              newIngredients[index] = { text: e.target.value };
                              setDisplayIngredients(newIngredients);
                            }}
                            className="flex-1 bg-gray-900 text-white px-3 py-2 border border-gray-700 focus:border-orange-500 focus:outline-none"
                          />
                        ) : (
                          <span className="flex-1">{item.text}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(isEditing || (isCustomized && notes)) && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-4 text-orange-500">
                    My Notes
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full bg-gray-900 text-white px-4 py-3 border border-gray-700 focus:border-orange-500 focus:outline-none"
                      placeholder="Add your tips..."
                    />
                  ) : (
                    <p className="text-gray-300 leading-relaxed">{notes}</p>
                  )}
                </div>
              )}
            </div>

            <div className="col-span-8">
              {displayInstructions.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-orange-500">
                    Instructions
                  </h2>
                  
                  <div className="space-y-6">
                    {displayInstructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {instruction.step}
                        </div>
                        {isEditing ? (
                          <textarea
                            value={instruction.text}
                            onChange={(e) => {
                              const newInstructions = [...displayInstructions];
                              newInstructions[index] = { ...instruction, text: e.target.value };
                              setDisplayInstructions(newInstructions);
                            }}
                            rows={3}
                            className="flex-1 bg-gray-900 text-white px-4 py-2 border border-gray-700 focus:border-orange-500 focus:outline-none"
                          />
                        ) : (
                          <p className="text-gray-300 leading-relaxed pt-2 flex-1">{instruction.text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-16 pt-12 border-t border-gray-800">
            <h3 className="text-3xl font-bold mb-6">Rate This Recipe</h3>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`text-5xl transition ${
                      star <= (hoveredRating || userRating)
                        ? 'text-orange-500'
                        : 'text-gray-800'
                    } hover:text-orange-400 hover:scale-110`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            {userRating > 0 && (
              <p className="text-orange-400 text-lg mb-3">You rated this {userRating} out of 5</p>
            )}
            <p className="text-gray-400">
              {recipe.rating?.toFixed(1) || 'No rating yet'} • {recipe.rating_count || 0} {recipe.rating_count === 1 ? 'rating' : 'ratings'}
            </p>
          </div>

          <div className="text-center py-12 border-t border-gray-800">
            <h3 className="text-4xl font-bold mb-4">Hungry for more?</h3>
            <p className="text-gray-400 mb-10 text-lg">Discover more anime-inspired dishes</p>
            <div className="flex gap-4 justify-center">
              <a href="/browse" className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 text-lg transition font-medium">
                Browse Recipes
              </a>
              <a href="/my-recipes" className="bg-gray-800 hover:bg-gray-700 text-white px-10 py-4 text-lg transition font-medium">
                My Collection
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default RecipeDetail;