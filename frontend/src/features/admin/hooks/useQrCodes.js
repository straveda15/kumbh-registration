import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as qrApi from '@/api/qr.api';

export const QR_CODES_QUERY_KEY = ['admin', 'qr-codes'];

export const useQrCodes = (params = {}) =>
  useQuery({ queryKey: [...QR_CODES_QUERY_KEY, params], queryFn: () => qrApi.listQR(params) });

export const useQrCodeMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: QR_CODES_QUERY_KEY });
  return {
    regenerate: useMutation({ mutationFn: qrApi.regenerateQR, onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, payload }) => qrApi.updateQR(id, payload), onSuccess: invalidate }),
  };
};
