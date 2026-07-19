import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, CircleCheck, CircleAlert } from 'lucide-react';

// status: 'idle' | 'pending' | 'success' | 'error' (matches TanStack
// Query's useMutation().status directly).
export const AutosaveIndicator = ({ status }) => (
  <AnimatePresence mode="wait">
    {status === 'pending' && (
      <motion.span
        key="pending"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Loader2 className="size-3.5 animate-spin" /> Saving draft…
      </motion.span>
    )}
    {status === 'success' && (
      <motion.span
        key="success"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="inline-flex items-center gap-1.5 text-xs text-primary"
      >
        <CircleCheck className="size-3.5" /> Draft saved
      </motion.span>
    )}
    {status === 'error' && (
      <motion.span
        key="error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="inline-flex items-center gap-1.5 text-xs text-destructive"
      >
        <CircleAlert className="size-3.5" /> Couldn't save, retrying on next edit
      </motion.span>
    )}
  </AnimatePresence>
);

export default AutosaveIndicator;
