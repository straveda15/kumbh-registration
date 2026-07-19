import { Dashboard } from '../models/dashboard.model.js';

// userId is optional for now since user authentication does not exist yet.
// Passing null returns/creates the shared placeholder dashboard record.
export const getOrCreateDashboard = async (userId = null) => {
  let dashboard = await Dashboard.findOne({ userId });

  if (!dashboard) {
    dashboard = await Dashboard.create({ userId });
  }

  return dashboard;
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
