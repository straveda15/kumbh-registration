import { HelpCircle, Mail, Phone } from 'lucide-react';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';
import { FAQ_ITEMS } from '@/utils/faqItems';

// No "back to home" button here — PublicLayout's header (which wraps this
// page) already provides one consistently across every public page.
export const HelpPage = () => (
  <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
    <div className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
        <HelpCircle className="size-4.5" />
      </span>
      <h1 className="text-2xl font-semibold text-foreground">Help &amp; FAQ</h1>
    </div>

    <SummaryCard title="Frequently Asked Questions" icon={HelpCircle}>
      <div className="flex flex-col gap-4">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question}>
            <p className="text-sm font-medium text-foreground">{item.question}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>
    </SummaryCard>

    <div id="contact">
      <SummaryCard title="Contact Support" icon={Mail}>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="size-4" /> support@example.com
          </div>
          <div className="flex items-center gap-2">
            <Phone className="size-4" /> +91 00000 00000
          </div>
        </div>
      </SummaryCard>
    </div>
  </div>
);

export default HelpPage;
