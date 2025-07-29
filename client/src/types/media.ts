export interface MediaItem {
  id: number;
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  budget: number;
  location: string;
  duration: number;
  year: number;
}
