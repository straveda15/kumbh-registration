import mongoose from 'mongoose';

const dashboardSchema = new mongoose.Schema(
  {
    // Nullable/unique-sparse until user authentication exists.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      unique: true,
      sparse: true,
    },
    widgets: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Dashboard = mongoose.model('Dashboard', dashboardSchema);

export default Dashboard;
