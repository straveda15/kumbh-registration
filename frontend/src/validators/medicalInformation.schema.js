import { z } from 'zod';

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "Don't Know"];

export const MEDICAL_CONDITIONS_OPTIONS = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Heart Disease',
  'Kidney Disease',
  'Liver Disease',
  'Epilepsy',
  'Arthritis',
  'Cancer',
  'Thyroid Disorder',
  'Tuberculosis',
  'COPD',
  'Migraine',
  'Mental Health Condition',
  'Other',
  'None',
];

export const MEDICAL_ALLERGIES_OPTIONS = [
  'Penicillin',
  'Sulfa Drugs',
  'Aspirin',
  'NSAIDs',
  'Peanut',
  'Milk',
  'Egg',
  'Seafood',
  'Dust',
  'Pollen',
  'Latex',
  'Insect Bite',
  'Food Allergy',
  'Other',
  'None',
];

export const medicalInformationSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS, { message: 'Please select your blood group.' }),
  medicalConditions: z.array(z.string()).optional().default([]),
  medicalConditionsOther: z.string().trim().optional(),
  currentMedicines: z.string().trim().optional(),
  allergies: z.array(z.string()).optional().default([]),
  allergiesOther: z.string().trim().optional(),
  doctorName: z.string().trim().optional(),
  emergencyNotes: z.string().trim().optional(),
});

export const medicalInformationDefaults = {
  bloodGroup: '',
  medicalConditions: [],
  medicalConditionsOther: '',
  currentMedicines: '',
  allergies: [],
  allergiesOther: '',
  doctorName: '',
  emergencyNotes: '',
};

export default medicalInformationSchema;
