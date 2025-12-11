import { SyntheticEvent } from 'react';
import Navbar from '../components/Navbar';
import AnimeCarousel from '../components/AnimeCarousel';
import MALRecipesCarousel from '../components/MALRecipesCarousel';
import Footer from '../components/Footer';
import { Recipe } from '../types';

interface FeaturedBannerProps {
  recipe: Recipe;
}

function Home() {
  const trainingArcRecipes: Recipe[] = [
    {
      id: 42,
      title: "Rengoku's Gyunabe Bento",
      description: "Kyojuro Rengoku's legendary feast on the Mugen Train. The Flame Hashira's booming \"UMAI!\" echoed through the train car as he devoured stack after stack of these beef bentos with pure, unbridled joy.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Rengoku's%20Gyunabe%20Bento.jpg",
      meal_type: "Main",
      rating: 4.8,
      rating_count: 245,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 45,
      title: "Tanjiro's Yamakake Udon",
      description: "The hearty udon bowl Tanjiro enjoys between missions. Topped with grated mountain yam and a runny egg yolk, this dish gives demon slayers the strength to keep fighting.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Tanjiros%20Yamakake%20Udon.jpg",
      meal_type: "Main",
      rating: 4.6,
      rating_count: 198,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 54,
      title: "Deku's Victory Katsudon",
      description: "Izuku Midoriya's comfort food and the meal of champions. In Japanese, \"katsu\" means victory - and this crispy pork cutlet over rice has fueled Deku through countless trials.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Deku's%20Victory%20Katsudon.jpg",
      meal_type: "Main",
      rating: 4.7,
      rating_count: 312,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 56,
      title: "Bakugo's Spicy Mapo Tofu",
      description: "Explosive flavor for an explosive hero. Bakugo Katsuki doesn't do mild - and this fiery Sichuan mapo tofu matches his intensity perfectly.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Bakugo's%20Spicy%20Mapo%20Tofu.jpg",
      meal_type: "Main",
      rating: 4.9,
      rating_count: 387,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 59,
      title: "Ichiraku Ramen",
      description: "Naruto Uzumaki's home away from home - the steaming bowl that always welcomes him back. Rich pork broth, tender chashu, perfectly chewy noodles.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Ichiraku%20Ramen.jpg",
      meal_type: "Main",
      rating: 4.8,
      rating_count: 421,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 68,
      title: "Gyoza Hot Pot",
      description: "The perfect camping meal for cold nights under the stars. This steaming hot pot brings warmth and comfort after a day of outdoor adventures.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Gyoza%20Hot%20Pot.jpg",
      meal_type: "Main",
      rating: 4.5,
      rating_count: 176,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 63,
      title: "Senshi's Mushroom Risotto",
      description: "Senshi's welcoming dish for Izutsumi - a shortcut risotto made in the dungeon using walking mushroom monsters. Creamy, earthy, and surprisingly Swiss-cheesy.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Senshi's%20Mushroom%20Risotto.jpg",
      meal_type: "Main",
      rating: 4.6,
      rating_count: 234,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 52,
      title: "Gracia's Quiche",
      description: "Gracia Hughes' warm hospitality made tangible. In a world of alchemy and warfare, her table was a refuge - and this spinach quiche was comfort itself.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Gracia's%20Spinach%20Quiche.jpg",
      meal_type: "Main",
      rating: 4.4,
      rating_count: 189,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    }
  ];

  const festivalRecipes: Recipe[] = [
    {
      id: 57,
      title: "Taiyaki",
      description: "The iconic fish-shaped cake that appears across countless anime - from festival scenes to street vendors to casual snacking. Sweet red bean filling wrapped in golden, waffle-like cake.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Taiyaki.jpg",
      meal_type: "Dessert",
      rating: 4.7,
      rating_count: 356,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 39,
      title: "Anko's Hanami Dango",
      description: "Anko Mitarashi's guilty pleasure from Naruto. The sadistic interrogation expert has a notorious sweet tooth, devouring entire sticks after wrapping up S-rank missions.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Anko's%20Hanami%20Dango.jpg",
      meal_type: "Dessert",
      rating: 4.6,
      rating_count: 289,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 46,
      title: "Haganezuka's Mitarashi Dango",
      description: "Hotaru Haganezuka's obsession - the swordsmith who cares about two things: perfect blades and perfect dango. Chewy, sweet-savory, and worth losing your temper over.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Haganezuka's%20Mitarashi%20Dango.jpg",
      meal_type: "Dessert",
      rating: 4.5,
      rating_count: 267,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 44,
      title: "Mitsuri's Sakura Mochi",
      description: "The reason Mitsuri Kanroji has pink hair - she ate so much sakura mochi as a child that it permanently changed her hair color. Delicate, sweet with a hint of salt.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Mitsuri's%20Sakura%20Mochi.jpg",
      meal_type: "Dessert",
      rating: 4.6,
      rating_count: 298,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 65,
      title: "Bungee Gum Mochi",
      description: "Hisoka's favorite ability made edible - stretchy, chewy mochi that possesses both the properties of rubber and gum. Sweet, stretchy, and surprisingly addictive.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Bungee%20Gum%20Mochi.jpg",
      meal_type: "Dessert",
      rating: 4.4,
      rating_count: 223,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 43,
      title: "Zenitsu's Potato Mochi",
      description: "The comfort snack that calms Zenitsu's nerves in the Swordsmith Village Arc. Crispy-outside, gooey-inside potato mochi glazed with sweet soy sauce.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Zenitsu's%20Potato%20Mochi.jpg",
      meal_type: "Snack",
      rating: 4.5,
      rating_count: 245,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 60,
      title: "Wano's Sweet Red Bean Soup",
      description: "The sweet red bean soup that brought Otama to tears of joy and drove Big Mom into a rampage. Comforting, gently sweet, and worth fighting for.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Wano's%20Sweet%20Red%20Bean%20Soup.jpg",
      meal_type: "Dessert",
      rating: 4.3,
      rating_count: 178,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 41,
      title: "Yuzu's Castella Cake",
      description: "Yuzu's namesake dessert from Demon Slayer. This Portuguese-inspired Japanese sponge cake gets its bright, citrusy twist from yuzu peel.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Yuzu's%20Castella%20Cake.jpg",
      meal_type: "Dessert",
      rating: 4.6,
      rating_count: 312,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    }
  ];

  const comfortFoodRecipes: Recipe[] = [
    {
      id: 38,
      title: "Calcifer's Bacon & Eggs",
      description: "The breakfast that warms Howl's moving castle. Sophie and Markl gather around as Calcifer's flames crackle beneath the pan - crispy bacon, runny eggs, crusty bread.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Calcifer's%20Bacon%20%26%20Eggs.jpg",
      meal_type: "Breakfast",
      rating: 4.5,
      rating_count: 234,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 40,
      title: "Kiki's Herring Pie",
      description: "The grandmother's special delivery that Kiki races through the rain to save. An intricate pot pie decorated with pastry fish, baked with love.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Kiki-Pie.jpg",
      meal_type: "Main",
      rating: 4.4,
      rating_count: 198,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 58,
      title: "Satsuki's Bento",
      description: "The picture-perfect bento Satsuki packed with care - a snapshot of everyday Japanese life in the countryside. Wholesome, nostalgic, and packed with a sister's love.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Satsuki's%20Bento.jpg",
      meal_type: "Main",
      rating: 4.6,
      rating_count: 267,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 61,
      title: "Ponyo's Ramen",
      description: "The simple instant ramen that Sosuke's mother Lisa made during the storm - comfort in a bowl when the world outside was chaos. Humble, nostalgic.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Ponyo's%20Ramen.jpg",
      meal_type: "Main",
      rating: 4.7,
      rating_count: 298,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 62,
      title: "Rosso's Spaghetti Bolognese",
      description: "The hearty Italian comfort food of the Adriatic coast where Porco calls home. Rich meat sauce represents the rustic, authentic flavors of the region.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Rosso's%20Spaghetti%20Bolognese.jpg",
      meal_type: "Main",
      rating: 4.8,
      rating_count: 345,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 52,
      title: "Gracia's Quiche",
      description: "Gracia Hughes' warm hospitality made tangible. Simple, nourishing, and made with love, it's the kind of meal that reminds you what you're fighting for.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Gracia's%20Spinach%20Quiche.jpg",
      meal_type: "Main",
      rating: 4.4,
      rating_count: 189,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 53,
      title: "Winry's Apple Pie",
      description: "The pie that means \"home\" to the Elric brothers. After everything - the alchemy, the battles, the loss - this classic apple pie is what waits at the end of the journey.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Winry's%20Apple%20Pie.jpg",
      meal_type: "Dessert",
      rating: 4.7,
      rating_count: 312,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    },
    {
      id: 69,
      title: "Mukoda's Japanese Spaghetti",
      description: "Mukoda's nostalgic taste of home, recreated in another world. Sometimes you just need the comfort of familiar Japanese-style pasta. Sweet, savory.",
      hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Mukoda's%20Japanese%20Spaghetti.jpg",
      meal_type: "Main",
      rating: 4.5,
      rating_count: 223,
      created_by_user_id: null,
      created_at: new Date().toISOString(),
      view_count: 0,
      popularity_score: 0,
      updated_at: new Date().toISOString(),
      anime_id: null
    }
  ];

  const featured1: Recipe = {
    id: 42,
    title: "Rengoku's Gyunabe Bento",
    description: "Kyojuro Rengoku's legendary feast on the Mugen Train. The Flame Hashira's booming \"UMAI!\" echoed through the train car as he devoured stack after stack of these beef bentos with pure, unbridled joy. Rich, savory, and worth shouting about - this is what victory tastes like.",
    hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Rengoku's%20Gyunabe%20Bento.jpg",
    meal_type: "Main",
    rating: 4.8,
    rating_count: 245,
    created_by_user_id: null,
    created_at: new Date().toISOString(),
    view_count: 0,
    popularity_score: 0,
    updated_at: new Date().toISOString(),
    anime_id: null
  };

  const featured2: Recipe = {
    id: 39,
    title: "Anko's Hanami Dango",
    description: "Anko Mitarashi's guilty pleasure from Naruto. The sadistic interrogation expert has a notorious sweet tooth, devouring entire sticks after wrapping up S-rank missions. These tri-colored dumplings are dangerously addictive - sweet, chewy, and gone before you know it.",
    hero_image_url: "https://cisfzmzssszldaueuovi.supabase.co/storage/v1/object/public/recipe-images/Anko's%20Hanami%20Dango.jpg",
    meal_type: "Dessert",
    rating: 4.6,
    rating_count: 289,
    created_by_user_id: null,
    created_at: new Date().toISOString(),
    view_count: 0,
    popularity_score: 0,
    updated_at: new Date().toISOString(),
    anime_id: null
  };

  const FeaturedBanner = ({ recipe }: FeaturedBannerProps) => {
    const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      target.style.display = 'none';
      if (target.parentElement) {
        target.parentElement.innerHTML += '<div class="text-6xl opacity-20">🍜</div>';
      }
    };

    return (
      <a href={`/recipe/${recipe.id}`} className="block hover:opacity-90 transition-opacity">
        <div className="max-w-[1400px] mx-auto px-12 py-6">
          <div className="grid grid-cols-2 gap-8 items-center">
            <div className="relative h-[280px] overflow-hidden bg-gradient-to-br from-orange-900/40 to-orange-950/60 rounded-lg flex items-center justify-center">
              <img 
                src={recipe.hero_image_url} 
                alt={recipe.title}
                className="w-full h-full object-cover rounded-lg"
                onError={handleImageError}
              />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-orange-500 mb-3">{recipe.title}</h3>
              <p className="text-base text-gray-300 mb-3 leading-relaxed">{recipe.description}</p>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                This highly-rated dish combines authentic anime-inspired flavors with practical cooking techniques. 
                Perfect for fans looking to bring their favorite shows to life in the kitchen.
              </p>
              
              <div className="flex items-center gap-2 text-white text-base mb-5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(recipe.rating) ? '' : 'opacity-30'}>★</span>
                  ))}
                </div>
                <span className="font-semibold">{recipe.rating.toFixed(1)}</span>
                <span className="text-gray-400">({recipe.rating_count} ratings)</span>
              </div>

              <span className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 text-sm transition">
                View Recipe
              </span>
            </div>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <div className="bg-black pt-12 pb-32">
        <div className="max-w-[1100px] mx-auto px-12">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6 leading-tight">
                Taste the World of <span className="text-orange-500">Anime Cuisine</span>
              </h1>
              <p className="text-base text-gray-300 mb-8 leading-relaxed">
                Itadaki is your ultimate companion for managing and exploring iconic anime food recipes. Discover dishes that jump straight out of your favorite animated worlds!
              </p>
              <a 
                href="/browse"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 text-sm transition"
              >
                Explore Recipes Now
              </a>
            </div>

            <div className="relative">
              <img 
                src="/Hero Banner.png" 
                alt="Anime Food" 
                className="w-full h-[450px] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 pt-4 pb-12 bg-black space-y-20">
        <div>
          <div className="max-w-[1400px] mx-auto px-12 mb-4">
            <h2 className="text-3xl font-bold">Training Arc Fuel</h2>
          </div>
          <AnimeCarousel recipes={trainingArcRecipes} />
        </div>

        <div>
          <div className="max-w-[1400px] mx-auto px-12 mb-4">
            <h2 className="text-3xl font-bold">Festival & Street Food</h2>
          </div>
          <AnimeCarousel recipes={festivalRecipes} />
        </div>

        <MALRecipesCarousel />

        <FeaturedBanner recipe={featured1} />

        <div>
          <div className="max-w-[1400px] mx-auto px-12 mb-4">
            <h2 className="text-3xl font-bold">Comfort Food Classics</h2>
          </div>
          <AnimeCarousel recipes={comfortFoodRecipes} />
        </div>

        <FeaturedBanner recipe={featured2} />
      </div>

      <Footer />
    </div>
  );
}

export default Home;