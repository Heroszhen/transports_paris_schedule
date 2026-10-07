import { useMutation } from '@tanstack/react-query';
import { getRequestHeaders } from '../services/data';
import { IMediaObject } from '../models/interfaces';

export const useAddfile = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<IMediaObject> => {
      const formData = new FormData();
      formData.append('file', file);
      const url = `/api/media_objects`;
      const response = await fetch(url, {
        method: 'POST',
        headers: getRequestHeaders(true),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return response.json();
    },
  });
};

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: async (mediaObjectId: string): Promise<void> => {
      await fetch(`/api/media_objects/${mediaObjectId}`, {
        method: 'DELETE',
        headers: getRequestHeaders(),
      });
    },
  });
};
