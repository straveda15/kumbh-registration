import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { publicRoutes } from './public.routes';
import { adminRoutes } from './admin.routes';

// The app behaves like two independent applications (Public/Admin) sharing
// one backend — each owns its own route module, layout, and auth guard
// (see public.routes.jsx, admin.routes.jsx, protected.routes.jsx). This
// file only composes them; it holds no route definitions of its own
// besides the catch-all.
export const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {publicRoutes}
        {adminRoutes}
        <Route path="*" element={<AnimatedPage><NotFoundPage /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRouter;
