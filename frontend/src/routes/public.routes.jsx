import { Route } from 'react-router-dom';
import { AnimatedPage } from '@/components/AnimatedPage';
import { PublicLayout } from '@/layouts/PublicLayout';
import { PilgrimProtectedRoute } from './protected.routes';
import { LandingPage } from '@/pages/public/LandingPage';
import { ScanPage } from '@/pages/public/ScanPage';
import { WizardPage } from '@/pages/public/WizardPage';
import { SubmitSuccessPage } from '@/pages/public/SubmitSuccessPage';
import { DashboardPage } from '@/pages/public/DashboardPage';
import { DigitalPassPage } from '@/pages/public/DigitalPassPage';
import { PassPreviewPage } from '@/pages/public/PassPreviewPage';
import { ProfilePage } from '@/pages/public/ProfilePage';
import { DocumentCenterPage } from '@/pages/public/DocumentCenterPage';
import { NotificationCenterPage } from '@/pages/public/NotificationCenterPage';
import { HelpPage } from '@/pages/public/HelpPage';
import { PrivacyPage } from '@/pages/public/PrivacyPage';
import { PilgrimLoginPage } from '@/pages/public/PilgrimLoginPage';

// Every Public (Pilgrim) page shares the same independent PublicLayout
// (a slim, admin/operator-free nav).
const publicPage = (Page) => (
  <PublicLayout>
    <Page />
  </PublicLayout>
);

// Pages that show a specific pilgrim's own data (registration status,
// pass, profile, documents, notifications) additionally require a
// session — either the anonymous draft token or a real pilgrim login —
// redirecting to /login otherwise (see protected.routes.jsx).
const protectedPage = (Page) => (
  <PilgrimProtectedRoute>
    <PublicLayout>
      <Page />
    </PublicLayout>
  </PilgrimProtectedRoute>
);

// The Wizard and its success screen are deliberately NOT wrapped in
// PublicLayout — they already own a focused, immersive layout
// (WizardLayout), and adding a persistent top nav with links away mid-
// registration would change existing behavior, not just its wrapper. They
// also aren't PilgrimProtectedRoute-gated: the wizard IS how a draft
// session gets created in the first place, and the success screen is the
// one-time landing right after submit.
export const publicRoutes = [
  <Route key="home" path="/" element={<AnimatedPage>{publicPage(LandingPage)}</AnimatedPage>} />,
  <Route key="scan" path="/scan" element={<AnimatedPage>{publicPage(ScanPage)}</AnimatedPage>} />,
  // Bare, like AdminLoginPage/OperatorLoginPage — a login screen doesn't
  // need the persistent top nav the other public pages share.
  <Route key="login" path="/login" element={<AnimatedPage><PilgrimLoginPage /></AnimatedPage>} />,
  <Route
    key="register-success"
    path="/register/success"
    element={<AnimatedPage><SubmitSuccessPage /></AnimatedPage>}
  />,
  <Route
    key="register"
    path="/register/:code"
    element={<AnimatedPage><WizardPage /></AnimatedPage>}
  />,
  <Route
    key="dashboard"
    path="/dashboard"
    element={<AnimatedPage>{protectedPage(DashboardPage)}</AnimatedPage>}
  />,
  <Route key="pass" path="/pass" element={<AnimatedPage>{protectedPage(DigitalPassPage)}</AnimatedPage>} />,
  <Route
    key="pass-preview"
    path="/pass-preview"
    element={<AnimatedPage>{protectedPage(PassPreviewPage)}</AnimatedPage>}
  />,
  <Route
    key="profile"
    path="/profile"
    element={<AnimatedPage>{protectedPage(ProfilePage)}</AnimatedPage>}
  />,
  <Route
    key="documents"
    path="/documents"
    element={<AnimatedPage>{protectedPage(DocumentCenterPage)}</AnimatedPage>}
  />,
  <Route
    key="notifications"
    path="/notifications"
    element={<AnimatedPage>{protectedPage(NotificationCenterPage)}</AnimatedPage>}
  />,
  <Route key="help" path="/help" element={<AnimatedPage>{publicPage(HelpPage)}</AnimatedPage>} />,
  <Route key="privacy" path="/privacy" element={<AnimatedPage>{publicPage(PrivacyPage)}</AnimatedPage>} />,
];

export default publicRoutes;
