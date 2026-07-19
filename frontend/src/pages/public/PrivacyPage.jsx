import { ShieldCheck } from 'lucide-react';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';

// No "back to home" button here — PublicLayout's header (which wraps this
// page) already provides one consistently across every public page.
export const PrivacyPage = () => (
  <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
    <div className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
        <ShieldCheck className="size-4.5" />
      </span>
      <h1 className="text-2xl font-semibold text-foreground">Privacy Policy</h1>
    </div>

    <SummaryCard title="How we use your information" icon={ShieldCheck}>
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>
          Information collected during registration (personal details, family members, medical
          information, emergency contacts, travel and accommodation details, and uploaded
          documents) is used solely to process your event registration and issue your digital
          pass.
        </p>
        <p>
          Uploaded documents are stored with our document hosting provider and linked only to your
          registration. Your data is only reviewed by event administrators and gate operators for
          the purpose of approving registrations and verifying passes at entry.
        </p>
        <p>
          For any questions about your data, or to request its removal, contact support using the
          details on the Help page.
        </p>
      </div>
    </SummaryCard>
  </div>
);

export default PrivacyPage;
