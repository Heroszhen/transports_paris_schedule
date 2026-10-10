import { create } from 'zustand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRequestHeaders } from '../services/data';
import { ApiPlatformContext, IMovie } from '../models/interfaces';
import { IMovieForm } from '../pages/admin/movie/Movie';

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

export const getMovie = async (movieId: string): Promise<IMovie | null> => {
  try {
    const response = await fetch(`/api/movies/${movieId}`, {
      method: 'GET',
      headers: getRequestHeaders(),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
};

export const useEditMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ movie, movieId }: { movie: IMovieForm; movieId?: string | null }): Promise<IMovie> => {
      const url = `/api/movies${movieId ? '/' + movieId : ''}`;
      const response = await fetch(url, {
        method: movieId ? 'PATCH' : 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(movie),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-movies'] });
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId: string): Promise<void> => {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'DELETE',
        headers: getRequestHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-movies'] });
    },
  });
};
