// Run this from your backend folder with:  node check-duplicates.js
// It uses your existing mongoose dependency, no mongosh install needed.

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'PASTE_YOUR_URI_HERE';

async function main() {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;

    console.log('\n--- registrations indexes ---');
    console.log(await db.collection('registrations').indexes());

    console.log('\n--- duplicate registrationNumbers ---');
    console.log(
        await db
            .collection('registrations')
            .aggregate([
                { $match: { registrationNumber: { $ne: null } } },
                { $group: { _id: '$registrationNumber', count: { $sum: 1 }, ids: { $push: '$_id' } } },
                { $match: { count: { $gt: 1 } } },
            ])
            .toArray()
    );

    console.log('\n--- digitalpasses indexes ---');
    console.log(await db.collection('digitalpasses').indexes());

    console.log('\n--- duplicate passNumbers ---');
    console.log(
        await db
            .collection('digitalpasses')
            .aggregate([
                { $match: { passNumber: { $ne: null } } },
                { $group: { _id: '$passNumber', count: { $sum: 1 }, ids: { $push: '$_id' } } },
                { $match: { count: { $gt: 1 } } },
            ])
            .toArray()
    );

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});