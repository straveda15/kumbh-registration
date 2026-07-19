import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  QrCode,
  ScanLine,
  UserRound,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  IdCard,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';
import { useDraftSessionStore } from '@/store/useDraftSessionStore';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';
import { getDraft } from '@/api/registration.api';
import { DRAFT_QUERY_KEY } from '@/features/registration-wizard/hooks/useStartOrResumeDraft';
import { FAQ_ITEMS } from '@/utils/faqItems';

// The three cards below are literally the three independent apps (Public/
// Admin/Operator) the routing refactor separated — the landing page is the
// one place all three are allowed to appear side by side, since it only
// links *into* each section rather than exposing any of their functionality.
const PortalCard = ({ icon: Icon, title, description, children }) => (
  <Card className="glass-card flex flex-col border-none transition-shadow hover:shadow-lg hover:shadow-primary/5">
    <CardHeader>
      <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <CardTitle className="mt-3">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="mt-auto flex flex-wrap gap-2">{children}</CardContent>
  </Card>
);

const HOW_IT_WORKS_STEPS = [
  { step: 1, title: 'Scan QR', description: 'Scan the event QR code at the entrance, or from the home page.' },
  { step: 2, title: 'Complete Registration', description: 'Fill in your personal, medical, travel, and accommodation details.' },
  { step: 3, title: 'Approval', description: 'An event administrator reviews and approves your registration.' },
  { step: 4, title: 'Download Digital Pass', description: 'Your digital pass is generated automatically once approved.' },
  { step: 5, title: 'Verification at Event', description: 'Gate operators scan your pass to verify entry.' },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const code = useDraftSessionStore((state) => state.code);
  const hasSession = useHasCitizenSession();

  // Prefetch so /register/:code or /dashboard feel instant when the
  // citizen clicks through, instead of showing a loading state on arrival.
  useEffect(() => {
    if (hasSession) {
      queryClient.prefetchQuery({ queryKey: [...DRAFT_QUERY_KEY, code || 'pilgrim-session'], queryFn: getDraft });
    }
  }, [hasSession, code, queryClient]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-4 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <QrCode className="size-7" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Kumbh Registration Portal
        </h1>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          Welcome to the official Kumbh Registration Platform.
        </p>
      </motion.div>

      {/* Three Portal Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid w-full grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3"
      >
        <PortalCard
          icon={UserRound}
          title="Pilgrim"
          description="Register for the event, continue your registration, track your application, and access your digital pass."
        >
          <Button onClick={() => navigate('/scan')} className="gap-1.5" aria-label="Scan QR to register">
            <ScanLine className="size-3.5" aria-hidden="true" /> Scan QR
          </Button>
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="gap-1.5"
            aria-label="Pilgrim login"
          >
            <UserRound className="size-3.5" aria-hidden="true" /> Pilgrim Login
          </Button>
        </PortalCard>

        <PortalCard
          icon={ShieldCheck}
          title="Admin Portal"
          description="Manage events, registrations, approvals, analytics, operators, notifications and reports."
        >
          <Button asChild variant="outline" className="gap-1.5">
            <Link to="/admin/login" aria-label="Admin login">
              <ShieldCheck className="size-3.5" aria-hidden="true" /> Admin Login
            </Link>
          </Button>
        </PortalCard>

        <PortalCard
          icon={Smartphone}
          title="Operator Portal"
          description="Verify pilgrim passes, manage entry verification, view verification history."
        >
          <Button asChild variant="outline" className="gap-1.5">
            <Link to="/operator/login" aria-label="Operator login">
              <Smartphone className="size-3.5" aria-hidden="true" /> Operator Login
            </Link>
          </Button>
        </PortalCard>
      </motion.div>

      {/* How It Works */}
      <div className="flex flex-col gap-6">
        <h2 className="text-center text-xl font-semibold text-foreground">How It Works</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div key={item.step} className="glass-card flex flex-col gap-2 rounded-2xl p-5 text-center">
              <span className="mx-auto flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {item.step}
              </span>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="flex flex-col gap-6">
        <h2 className="text-center text-xl font-semibold text-foreground">
          Frequently Asked Questions
        </h2>
        <SummaryCard title="FAQ" icon={CheckCircle2} className="mx-auto w-full max-w-2xl">
          <div className="flex flex-col gap-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <p className="text-sm font-medium text-foreground">{item.question}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </SummaryCard>
      </div>

      {/* Contact Information */}
      <div id="contact" className="flex flex-col gap-6">
        <h2 className="text-center text-xl font-semibold text-foreground">Contact Information</h2>
        <SummaryCard title="Contact Support" icon={IdCard} className="mx-auto w-full max-w-2xl">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="size-4" aria-hidden="true" /> support@example.com
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4" aria-hidden="true" /> +91 00000 00000
            </div>
          </div>
        </SummaryCard>
      </div>

      {/* Footer */}
      <div className="mt-auto flex flex-col items-center gap-2 pt-4 text-sm text-muted-foreground">
        <span>Need Help?</span>
        <div className="flex items-center gap-3">
          <Link to="/help" className="hover:text-foreground">
            FAQ
          </Link>
          <span aria-hidden="true">·</span>
          <a href="#contact" className="hover:text-foreground">
            Contact
          </a>
          <span aria-hidden="true">·</span>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
