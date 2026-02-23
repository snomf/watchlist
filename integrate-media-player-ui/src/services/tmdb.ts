import { MediaItem } from '../types';

const BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  media_type?: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
}

export const getTmdbImage = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://placehold.co/500x750/1e293b/white?text=No+Image';
};

const mapTmdbToMediaItem = (item: TMDBMedia, typeOverride?: 'movie' | 'tv'): MediaItem => {
  const isMovie = item.media_type === 'movie' || typeOverride === 'movie' || !!item.title;
  const title = item.title || item.name || 'Unknown Title';
  const date = item.release_date || item.first_air_date || '';
  const year = date ? parseInt(date.split('-')[0]) : new Date().getFullYear();
  
  return {
    id: item.id,
    tmdbId: item.id,
    title,
    type: isMovie ? 'movie' : 'tv',
    year,
    duration: '', // Duration requires extra details call usually, leaving empty for list view
    rating: parseFloat(item.vote_average.toFixed(1)),
    description: item.overview,
    poster: getTmdbImage(item.poster_path, 'w500'),
    backdrop: getTmdbImage(item.backdrop_path, 'original'),
    status: 'want-to-watch', // Default status for new fetches
  };
};

export const fetchTrending = async (apiKey: string): Promise<MediaItem[]> => {
  if (!apiKey) return [];
  try {
    const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${apiKey}`);
    const data = await response.json();
    return (data.results || []).map((item: TMDBMedia) => mapTmdbToMediaItem(item));
  } catch (error) {
    console.error("Error fetching trending:", error);
    return [];
  }
};

export const searchMedia = async (apiKey: string, query: string): Promise<MediaItem[]> => {
  if (!apiKey || !query) return [];
  try {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return (data.results || [])
      .filter((item: TMDBMedia) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item: TMDBMedia) => mapTmdbToMediaItem(item));
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
};

export const fetchDetails = async (apiKey: string, id: number, type: 'movie' | 'tv'): Promise<MediaItem | null> => {
    if (!apiKey) return null;
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${apiKey}`);
        const data = await response.json();
        
        const item = mapTmdbToMediaItem(data, type);
        
        // Add runtime if available
        if (data.runtime) {
            const h = Math.floor(data.runtime / 60);
            const m = data.runtime % 60;
            item.duration = `${h}h ${m}m`;
        } else if (data.episode_run_time && data.episode_run_time.length > 0) {
            item.duration = `${data.episode_run_time[0]}m`;
        }

        return item;
    } catch (error) {
        console.error("Error fetching details:", error);
        return null;
    }
};
