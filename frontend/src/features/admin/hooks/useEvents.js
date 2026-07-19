import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as eventApi from '@/api/event.api';

export const EVENTS_QUERY_KEY = ['admin', 'events'];

export const useEvents = (params = {}) =>
  useQuery({ queryKey: [...EVENTS_QUERY_KEY, params], queryFn: () => eventApi.listEvents(params) });

export const useEvent = (id) =>
  useQuery({ queryKey: [...EVENTS_QUERY_KEY, id], queryFn: () => eventApi.getEvent(id), enabled: Boolean(id) });

export const useEventMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
  return {
    create: useMutation({ mutationFn: eventApi.createEvent, onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, payload }) => eventApi.updateEvent(id, payload), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: eventApi.deleteEvent, onSuccess: invalidate }),
  };
};
