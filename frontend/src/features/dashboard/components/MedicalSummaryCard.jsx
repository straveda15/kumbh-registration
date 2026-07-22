import { HeartPulse } from 'lucide-react';
import { SummaryCard, DataRow } from './SummaryCard';

export const MedicalSummaryCard = ({ data = {}, detailed = false, className, action }) => (
  <SummaryCard title="Medical Summary" icon={HeartPulse} className={className} action={action}>
    <DataRow label="Blood Group" value={data.bloodGroup} />
    <DataRow label="Allergies" value={data.allergies} />
    <DataRow label="Doctor" value={data.doctorName} />
    {detailed && (
      <>
        <DataRow label="Medical Conditions" value={data.medicalConditions} />
        <DataRow label="Current Medicines" value={data.currentMedicines} />
        <DataRow label="Emergency Notes" value={data.emergencyNotes} />
      </>
    )}
  </SummaryCard>
);

export default MedicalSummaryCard;
