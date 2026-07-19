import { Users } from 'lucide-react';
import { SummaryCard } from './SummaryCard';
import { FamilyMemberTable } from '@/features/registration-wizard/components/FamilyMemberTable';
import { FamilyMemberCard as FamilyMemberMobileCard } from '@/features/registration-wizard/components/FamilyMemberCard';

export const FamilyMembersCard = ({ familyMembers = [] }) => (
  <SummaryCard title="Family Members" icon={Users} className="md:col-span-2">
    {familyMembers.length === 0 ? (
      <p className="text-xs text-muted-foreground">No family members were added.</p>
    ) : (
      <>
        <FamilyMemberTable members={familyMembers} />
        <FamilyMemberMobileCard members={familyMembers} />
      </>
    )}
  </SummaryCard>
);

export default FamilyMembersCard;
