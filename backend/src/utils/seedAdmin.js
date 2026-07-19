import config from '../config/env.js';
import logger from '../config/logger.js';
import { connectDatabase, disconnectDatabase } from '../database/connect.js';
import { Admin } from '../models/admin.model.js';
import { ADMIN_ROLES } from '../constants/roles.js';

const run = async () => {
  const { name, email, password } = config.seedAdmin;

  if (!name || !email || !password) {
    logger.error(
      'SEED_ADMIN_NAME, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env to seed an admin'
    );
    process.exit(1);
  }

  await connectDatabase();

  const existing = await Admin.findOne({ email });
  if (existing) {
    logger.info(`Admin with email ${email} already exists. Skipping seed.`);
    await disconnectDatabase();
    process.exit(0);
  }

  await Admin.create({ name, email, password, role: ADMIN_ROLES.SUPER_ADMIN });

  logger.info(`Seed admin created: ${email}`);
  await disconnectDatabase();
  process.exit(0);
};

run().catch(async (err) => {
  logger.error(`Failed to seed admin: ${err.stack}`);
  await disconnectDatabase();
  process.exit(1);
});
