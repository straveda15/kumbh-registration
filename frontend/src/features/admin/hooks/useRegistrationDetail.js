import { useQuery } from '@tanstack/react-query';
import {
  getRegistration,
  getRegistrationAudit,
  getRegistrationDocuments,
  getRegistrationActivity,
} from '@/api/adminRegistration.api';

export const useRegistrationDetail = (id) =>
  useQuery({
    queryKey: ['admin', 'registration', id],
    queryFn: () => getRegistration(id),
    enabled: Boolean(id),
  });

export const useRegistrationAudit = (id) =>
  useQuery({
    queryKey: ['admin', 'registration', id, 'audit'],
    queryFn: () => getRegistrationAudit(id),
    enabled: Boolean(id),
  });

export const useRegistrationDocuments = (id) =>
  useQuery({
    queryKey: ['admin', 'registration', id, 'documents'],
    queryFn: () => getRegistrationDocuments(id),
    enabled: Boolean(id),
  });

export const useRegistrationActivity = (id) =>
  useQuery({
    queryKey: ['admin', 'registration', id, 'activity'],
    queryFn: () => getRegistrationActivity(id),
    enabled: Boolean(id),
  });

export default {
  useRegistrationDetail,
  useRegistrationAudit,
  useRegistrationDocuments,
  useRegistrationActivity,
};
