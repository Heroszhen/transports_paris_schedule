import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { getRequestHeaders } from '../services/data';
import { ApiPlatformContext, IMovie } from '../models/interfaces';

const useMovieStore = create(() => ({}));
export default useMovieStore;

export const useMovies = (params: null | Record<string, string | number> = null) => {
  return useQuery({
    queryKey: ['list-movies', params],
    queryFn: async (): Promise<ApiPlatformContext<IMovie>> => {
      let query: null | URLSearchParams = null;
      if (params) {
        query = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value && value !== '') query.set(key, String(value));
        }
      }
      const response = await fetch(`/api/movies${query === null ? '' : `?${query.toString()}`}`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    },
  });
};
