import mongoose from 'mongoose';

/**
 * Checks if the current MongoDB connection topology supports multi-document transactions
 * (ReplicaSet or Sharded).
 */
export const isTransactionSupported = () => {
  const client = mongoose.connection?.client;
  const topologyType = client?.topology?.description?.type;
  return topologyType && topologyType !== 'Single' && topologyType !== 'Unknown';
};

/**
 * Helper to check if an error is a transient MongoDB transaction error.
 */
const isTransientError = (error) => {
  if (!error) return false;
  return (
    error.hasErrorLabel?.('TransientTransactionError') ||
    error.hasErrorLabel?.('UnknownTransactionCommitResult')
  );
};

/**
 * Executes a work function inside a MongoDB transaction session if supported,
 * with automatic retries for transient transaction errors (up to 3 retries).
 * Falls back gracefully to non-transactional execution on standalone MongoDB instances.
 *
 * @param {Function} workFn - Async callback receiving (session)
 * @param {Object} options - Options object
 * @param {number} options.maxRetries - Maximum retry attempts for transient errors (default: 3)
 * @returns {Promise<any>} Result of workFn
 */
export const withTransaction = async (workFn, { maxRetries = 3 } = {}) => {
  if (!isTransactionSupported()) {
    return workFn(null);
  }

  let attempt = 0;

  while (attempt < maxRetries) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const result = await workFn(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction().catch(() => {});
      if (isTransientError(error) && attempt < maxRetries - 1) {
        attempt += 1;
        continue;
      }
      throw error;
    } finally {
      session.endSession().catch(() => {});
    }
  }
};

export default { isTransactionSupported, withTransaction };
