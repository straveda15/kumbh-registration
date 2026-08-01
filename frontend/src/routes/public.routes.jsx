import { Route } from 'react-router-dom';
import { AnimatedPage } from '@/components/AnimatedPage';
import { PublicLayout } from '@/layouts/PublicLayout';
import { PilgrimProtectedRoute } from './protected.routes';
import { LandingPage } from '@/pages/public/LandingPage';
import { ScanPage } from '@/pages/public/ScanPage';
import { WizardPage } from '@/pages/public/WizardPage';
import { DashboardPage } from '@/pages/public/DashboardPage';
import { DigitalPassPage } from '@/pages/public/DigitalPassPage';
import { MyRegistrationPage } from '@/pages/public/MyRegistrationPage';
import { EditRegistrationPage } from '@/pages/public/EditRegistrationPage';
import { ProfilePage } from '@/pages/public/ProfilePage';
import { DocumentCenterPage } from '@/pages/public/DocumentCenterPage';
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
// pass, profile, documents) additionally require a session — either the
// anonymous draft token or a real pilgrim login — redirecting to /login
// otherwise (see protected.routes.jsx).
const protectedPage = (Page) => (
  <PilgrimProtectedRoute>
    <PublicLayout>
      <Page />
    </PublicLayout>
  </PilgrimProtectedRoute>
);

// The Wizard is deliberately NOT wrapped in PublicLayout — it already owns
// a focused, immersive layout (WizardLayout), and adding a persistent top
// nav with links away mid-registration would change existing behavior, not
// just its wrapper. It also isn't PilgrimProtectedRoute-gated: the wizard
// IS how a draft session gets created in the first place.
//
// There's no longer a separate "/register/success" page — ReviewStep
// navigates straight to /dashboard on submit (the draft token already
// grants access, see useHasCitizenSession), with the freshly generated
// Registration Number passed via route state for a one-time success
// banner there.
//
// "/account" (a standalone Registration Number page) and "/pass-preview"
// (a redacted preview of the Entry Pass) were folded into Dashboard/Profile
// and the Entry Pass page respectively in the mobile-first redesign — kept
// as two separate near-empty pages/routes only duplicated what's now
// directly on the pages that link here, so they're gone rather than left
// as dead routes nothing points to.
export const publicRoutes = [
  <Route key="home" path="/" element={<AnimatedPage>{publicPage(LandingPage)}</AnimatedPage>} />,
  <Route key="scan" path="/scan" element={<AnimatedPage>{publicPage(ScanPage)}</AnimatedPage>} />,
  // Bare, like AdminLoginPage — a login screen doesn't need the
  // persistent top nav the other public pages share.
  <Route key="login" path="/login" element={<AnimatedPage><PilgrimLoginPage /></AnimatedPage>} />,
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
  <Route key="pass-code" path="/pass/:code" element={<AnimatedPage>{publicPage(DigitalPassPage)}</AnimatedPage>} />,
  <Route
    key="my-registration"
    path="/registration"
    element={<AnimatedPage>{protectedPage(MyRegistrationPage)}</AnimatedPage>}
  />,
  <Route
    key="edit-registration"
    path="/registration/edit"
    element={<AnimatedPage>{protectedPage(EditRegistrationPage)}</AnimatedPage>}
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
  <Route key="help" path="/help" element={<AnimatedPage>{publicPage(HelpPage)}</AnimatedPage>} />,
  <Route key="privacy" path="/privacy" element={<AnimatedPage>{publicPage(PrivacyPage)}</AnimatedPage>} />,
];

export default publicRoutes;
