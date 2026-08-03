// Run from backend folder: node cleanup-orphans.js
// Deletes DigitalPass docs whose registrationId no longer points to any
// existing Registration. Safe: these can never be reached by any live
// registration, and they're the reason old passNumbers appear "free" to
// the number generator while actually still being held by the unique index.

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

async function main() {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;

    const passes = await db.collection('digitalpasses').find({}).toArray();
    const registrations = await db.collection('registrations').find({}).toArray();
    const regIds = new Set(registrations.map((r) => String(r._id)));

    const orphanIds = passes
        .filter((p) => !regIds.has(String(p.registrationId)))
        .map((p) => p._id);

    console.log(`Found ${orphanIds.length} orphaned DigitalPass docs to delete.`);

    if (orphanIds.length > 0) {
        const result = await db.collection('digitalpasses').deleteMany({ _id: { $in: orphanIds } });
        console.log(`Deleted ${result.deletedCount} orphaned DigitalPass docs.`);
    }

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});