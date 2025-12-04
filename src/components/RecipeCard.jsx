import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  const slug = recipe.id;
  const rating = recipe.rating || 0;
  const ratingCount = recipe.rating_count || 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`}>★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="opacity-30">★</span>);
    }
    return stars;
  };

  return (
    <Link to={`/recipe/${slug}`} className="bg-[#2C2C2C] overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer block">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.hero_image_url} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-orange-500 text-xl font-bold mb-2 truncate">
          {recipe.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center gap-2 text-white text-sm">
          <div className="flex">
            {renderStars(rating)}
          </div>
          <span className="font-semibold">{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
          <span className="text-gray-400">({ratingCount})</span>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;