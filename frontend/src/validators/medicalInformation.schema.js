import { z } from 'zod';

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "Don't Know"];

export const MEDICAL_CONDITIONS_OPTIONS = [
  'None',
  'Acid Reflux (GERD)',
  "Alzheimer's / Dementia",
  'Anemia',
  'Anxiety Disorder',
  'Arthritis',
  'Asthma',
  'Autoimmune Disorder',
  'Bleeding Disorder',
  'Blood Clotting Disorder',
  'Cancer',
  'Cataract',
  'Chronic Back Pain',
  'Chronic Migraine',
  'COPD',
  'Depression',
  'Diabetes',
  'Eczema',
  'Epilepsy',
  'Gastric Ulcer',
  'Glaucoma',
  'Hearing Impairment',
  'Heart Disease',
  'High Cholesterol',
  'Hypertension (High Blood Pressure)',
  'Kidney Disease',
  'Liver Disease',
  'Obesity',
  'Osteoporosis',
  'Panic Disorder',
  'Paralysis',
  "Parkinson's Disease",
  'Pregnancy',
  'Psoriasis',
  'Sleep Apnea',
  'Stroke History',
  'Thyroid Disorder',
  'Tuberculosis (TB)',
  'Vision Impairment',
  'Other',
];

export const MEDICAL_ALLERGIES_OPTIONS = [
  'None',
  'Aspirin',
  'Dust',
  'Egg',
  'Food Allergy',
  'Insect Bite',
  'Latex',
  'Milk',
  'NSAIDs',
  'Peanut',
  'Penicillin',
  'Pollen',
  'Seafood',
  'Sulfa Drugs',
  'Other',
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
