# Itadaki - Anime Recipe Discovery Platform

A full-stack web application that helps anime fans discover and cook iconic dishes from their favorite series. Features personalized recipe recommendations powered by MyAnimeList integration.

**Live Demo:** https://itadaki-ochre.vercel.app/

## Overview

Itadaki addresses a common problem in the anime community: fans want to recreate the amazing food they see on screen, but recipes are scattered across blogs, Reddit threads, and YouTube videos. This platform curates 32+ authentic recipes from popular anime series and provides personalized recommendations based on users' MyAnimeList viewing history.

## Features

* **Curated Recipe Database:** 32 meticulously researched dishes from Naruto, Demon Slayer, My Hero Academia, Food Wars, and other popular series
* **MyAnimeList Integration:** OAuth 2.0 authentication with personalized recommendations based on viewing history
* **Advanced Search & Filtering:** Search by anime title, meal type, or ingredients
* **User Interactions:** Save favorites, rate recipes, and leave comments
* **Responsive Design:** Optimized for desktop and mobile viewing

## Technical Stack

**Frontend**
* React 18 with React Router for navigation
* Tailwind CSS for styling
* Custom hooks for state management
* Vite for fast development and optimized builds

**Backend**
* Supabase (PostgreSQL database)
* Supabase Edge Functions (Deno runtime) for OAuth handling
* Row-Level Security for data protection

**External APIs**
* MyAnimeList API v2 with PKCE OAuth flow

**Deployment**
* Vercel for frontend hosting with automatic deployments
* Supabase Cloud for managed database and Edge Functions

## Local Development

**Prerequisites**
* Node.js 18+
* Supabase account
* MyAnimeList API credentials

**Setup**

1. Clone the repository
   ```bash
   git clone https://github.com/DamirStyles/Itadaki.git
   cd Itadaki
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_MAL_CLIENT_ID=your_mal_client_id
   VITE_MAL_REDIRECT_URI=http://localhost:5173/mal/callback
   ```

4. Set up the database
   
   Run the SQL migration files in your Supabase project (located in `/supabase/migrations/`)

5. Deploy Edge Function
   ```bash
   supabase functions deploy mal-oauth
   ```

6. Run the development server
   ```bash
   npm run dev
   ```

7. Open http://localhost:5173

## Project Structure

```
Itadaki/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Configuration (Supabase client)
│   ├── pages/            # Route components
│   ├── services/         # API integration layer
│   └── utils/            # Helper functions
├── public/
│   └── anime-recipes-images/  # Recipe images
├── supabase/
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database schema
└── README.md
```

## Future Roadmap

* User-submitted recipes with moderation workflow
* Nutritional information API integration
* Recipe difficulty ratings and user reviews
* Cooking time estimates based on skill level
* Social features: follow users and share recipe collections
* Mobile app using React Native

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning purposes.

## Contact

Damir - [GitHub](https://github.com/DamirStyles)

Project Link: [https://github.com/DamirStyles/Itadaki](https://github.com/DamirStyles/Itadaki)

---

Built with ❤️ for anime fans and home cooks everywhere