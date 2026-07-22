import { z } from 'zod';

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "Don't Know"];

export const medicalInformationSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS, { message: 'Please select your blood group.' }),
  medicalConditions: z.string().trim().optional(),
  currentMedicines: z.string().trim().optional(),
  allergies: z.string().trim().optional(),
  doctorName: z.string().trim().optional(),
  emergencyNotes: z.string().trim().optional(),
});

export const medicalInformationDefaults = {
  // See personalInformation.schema.js's gender default for why '' and not
  // undefined — same controlled-<Select> requirement.
  bloodGroup: '',
  medicalConditions: '',
  currentMedicines: '',
  allergies: '',
  doctorName: '',
  emergencyNotes: '',
};

export default medicalInformationSchema;
