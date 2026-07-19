import { UserRound } from 'lucide-react';
import { SummaryCard, DataRow } from './SummaryCard';

// Shared by DashboardPage (compact) and ProfilePage (detailed) — extracted
// so the two pages don't duplicate the same field-reading JSX.
export const ProfileSummaryCard = ({ data = {}, detailed = false, className, action }) => (
  <SummaryCard title="Profile Summary" icon={UserRound} className={className} action={action}>
    <DataRow label="Full Name" value={data.fullName} />
    <DataRow label="Gender" value={data.gender} />
    <DataRow label="Mobile" value={data.mobile} />
    <DataRow label="Email" value={data.email} />
    <DataRow label="Village / Town" value={data.village} />
    {detailed && (
      <>
        <DataRow label="Date of Birth" value={data.dob} />
        <DataRow label="Nationality" value={data.nationality} />
        <DataRow label="Preferred Language" value={data.language} />
        <DataRow label="Address" value={data.address} />
        <DataRow label="State" value={data.state} />
        <DataRow label="District" value={data.district} />
        <DataRow label="Taluka" value={data.taluka} />
        <DataRow label="PIN Code" value={data.pinCode} />
      </>
    )}
  </SummaryCard>
);

export default ProfileSummaryCard;
