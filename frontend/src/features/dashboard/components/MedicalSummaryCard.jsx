import { HeartPulse } from 'lucide-react';
import { SummaryCard, DataRow } from './SummaryCard';

const formatList = (val, otherVal) => {
  let list = [];
  if (Array.isArray(val)) {
    list = [...val];
  } else if (typeof val === 'string' && val.trim()) {
    list = [val];
  }
  if (list.includes('Other') && otherVal) {
    list = list.map((item) => (item === 'Other' ? `Other (${otherVal})` : item));
  }
  return list.length > 0 ? list.join(', ') : 'None';
};

export const MedicalSummaryCard = ({ data = {}, detailed = false, className, action }) => (
  <SummaryCard title="Medical Summary" icon={HeartPulse} className={className} action={action}>
    <DataRow label="Blood Group" value={data.bloodGroup} />
    <DataRow label="Allergies" value={formatList(data.allergies, data.allergiesOther)} />
    <DataRow label="Family Doctor Name" value={data.doctorName} />
    {detailed && (
      <>
        <DataRow label="Medical Conditions" value={formatList(data.medicalConditions, data.medicalConditionsOther)} />
        <DataRow label="Current Medicines" value={data.currentMedicines} />
        <DataRow label="Emergency Notes" value={data.emergencyNotes} />
      </>
    )}
  </SummaryCard>
);

export default MedicalSummaryCard;
