import { create } from 'zustand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRequestHeaders } from '../services/data';
import { ApiPlatformContext, IActor } from '../models/interfaces';
import { IActorForm } from '../components/actor/ActorForm';

const useActorStore = create(() => ({}));
export default useActorStore;

export const useActors = (params: null | Record<string, string | number> = null) => {
  return useQuery({
    queryKey: ['list-actors', params],
    queryFn: async (): Promise<ApiPlatformContext<IActor>> => {
      let query: null | URLSearchParams = null;
      if (params) {
        query = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value && value !== '') query.set(key, String(value));
        }
      }
      const response = await fetch(`/api/actors${query === null ? '' : `?${query.toString()}`}`, {
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

export const useEditActor = (actor: IActor | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newActor: IActorForm) => {
      const url = `/api/actors${actor ? '/' + actor.id : ''}`;
      const response = await fetch(url, {
        method: actor ? 'PATCH' : 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(newActor),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-actors'] });
    },
  });
};
