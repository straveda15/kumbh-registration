import { Toaster } from '@/components/ui/sonner';

export const AppLayout = ({ children }) => (
  <div className="relative min-h-screen">
    {children}
    <Toaster position="top-center" richColors closeButton />
  </div>
);

export default AppLayout;
