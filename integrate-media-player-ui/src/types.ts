export interface MediaItem {
  id: number; // This will be the TMDB ID
  tmdbId: number; // Redundant but keeping for compatibility with existing code if needed
  title: string;
  type: 'movie' | 'tv';
  year: number;
  duration?: string; 
  rating: number; 
  description: string;
  poster: string;
  backdrop: string;
  status: 'watching' | 'want-to-watch' | 'watched';
  progress?: {
    season: number;
    episode: number;
    totalEpisodes: number;
  };
  reactions?: string[];
  userRating?: number;
}

export const sources = [
  { name: 'RiveStream', url: 'https://rivestream.net/embed/docs' },
  { name: '2Embed', url: 'https://www.2embed.cc/embed' },
  { name: 'VidSrc.me', url: 'https://vidsrcme.ru/embed' },
  { name: 'MoviesAPI', url: 'https://moviesapi.club' },
  { name: 'MultiEmbed', url: 'https://multiembed.mov' },
  { name: 'SmashyStream', url: 'https://embed.smashystream.com' },
];
