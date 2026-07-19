import { Users } from 'lucide-react';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';

// Placeholder: the backend has no operator-account management endpoints
// today (backend/src/constants/roles.js only defines admin/superadmin —
// there's no separate operator identity to list, invite, or revoke). Gate
// operators currently sign in with an admin account (see routes/
// operator.routes.jsx's OperatorLoginPage comment). This page is a real,
// working route rather than a 404, but intentionally doesn't fabricate a
// CRUD UI against an API that doesn't exist.
export const AdminOperatorsPage = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Operators</h1>
      <p className="text-sm text-muted-foreground">Manage gate-operator access.</p>
    </div>

    <SummaryCard title="Operator accounts" icon={Users}>
      <p className="text-sm text-muted-foreground">
        Operator-account management isn't available yet — gate operators currently sign in with an
        admin account at <code className="rounded bg-white/10 px-1 py-0.5 text-xs">/operator/login</code>.
        Dedicated operator accounts (invite, list, revoke) would require a new backend role and
        endpoints.
      </p>
    </SummaryCard>
  </div>
);

export default AdminOperatorsPage;
