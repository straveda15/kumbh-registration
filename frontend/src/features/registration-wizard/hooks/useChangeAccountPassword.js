import { useMutation } from '@tanstack/react-query';
import { changeAccountPassword } from '@/api/registration.api';

// No query invalidation needed — a password change doesn't affect any
// displayed data (unlike useSaveAccountCredentials, which touches
// name/email/mobile shown on the Profile page).
export const useChangeAccountPassword = () => useMutation({ mutationFn: changeAccountPassword });

export default useChangeAccountPassword;
