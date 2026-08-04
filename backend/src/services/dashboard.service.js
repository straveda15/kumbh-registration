import { Dashboard } from '../models/dashboard.model.js';

// userId is optional for now since user authentication does not exist yet.
// Passing null returns/creates the shared placeholder dashboard record.
// Uses atomic findOneAndUpdate + upsert to eliminate race conditions between
// concurrent calls for the same userId (preventing Mongo E11000 duplicate key errors).
export const getOrCreateDashboard = async (userId = null) => {
  return Dashboard.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

export const updateDashboard = async (userId, payload) => {
  const dashboard = await Dashboard.findOneAndUpdate(
    { userId },
    { $set: payload },
    { new: true, upsert: true, runValidators: true }
  );

  return dashboard;
};

export default { getOrCreateDashboard, updateDashboard };
