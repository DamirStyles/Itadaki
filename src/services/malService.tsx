const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface MALAnimeNode {
  node: {
    id: number;
  };
}

interface MALResponse {
  data: {
    data: MALAnimeNode[];
  };
}

export const malService = {
  async getUserAnimeList(userId: string): Promise<number[]> {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/get-mal-animelist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY
          },
          body: JSON.stringify({ userId })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch MAL anime list');
      }
      
      const result: MALResponse = await response.json();
      
      return result.data.data.map(item => item.node.id);
    } catch (error) {
      console.error('Error fetching MAL list:', error);
      return [];
    }
  }
};