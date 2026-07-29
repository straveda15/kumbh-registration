import { motion } from 'framer-motion';
import { BackButton } from '@/components/shared/BackButton';
import { getRegistrationReturnPath } from '@/utils/registrationReturnPath';

// Shared centered-card chrome for login pages
export const AuthLayout = ({ icon: Icon, title, subtitle, children, backTo, backLabel }) => {
  const returnPath = getRegistrationReturnPath();
  const registrationTarget = backTo || returnPath || '/scan';

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 px-4">
      <BackButton to={registrationTarget} label={backLabel || 'Back to Home'} className="self-start" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full rounded-3xl px-8 py-10"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Icon className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
