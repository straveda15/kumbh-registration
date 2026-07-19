import { useMutation } from '@tanstack/react-query';
import { verifyPass } from '@/api/operator.api';

export const useVerifyPass = () => useMutation({ mutationFn: verifyPass });

export default useVerifyPass;
