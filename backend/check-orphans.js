// Run from backend folder: node check-orphans.js
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

async function main() {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;

    const passes = await db.collection('digitalpasses').find({}).toArray();
    const registrations = await db.collection('registrations').find({}).toArray();
    const regById = new Map(registrations.map((r) => [String(r._id), r]));

    console.log(`\nTotal digitalpasses: ${passes.length}`);
    console.log(`Total registrations: ${registrations.length}`);

    console.log('\n--- DigitalPass docs with no matching Registration (orphans) ---');
    const orphans = passes.filter((p) => !regById.has(String(p.registrationId)));
    console.log(orphans.map((p) => ({ _id: p._id, registrationId: p.registrationId, passNumber: p.passNumber })));

    console.log('\n--- DigitalPass docs whose passNumber does NOT match their Registration.registrationNumber ---');
    const mismatched = passes
        .filter((p) => regById.has(String(p.registrationId)))
        .filter((p) => regById.get(String(p.registrationId)).registrationNumber !== p.passNumber)
        .map((p) => ({
            digitalPassId: p._id,
            registrationId: p.registrationId,
            passNumber: p.passNumber,
            linkedRegistrationNumber: regById.get(String(p.registrationId)).registrationNumber,
        }));
    console.log(mismatched);

    console.log('\n--- Registrations whose digitalPassId points to a non-existent DigitalPass ---');
    const passById = new Set(passes.map((p) => String(p._id)));
    const badLinks = registrations
        .filter((r) => r.digitalPassId && !passById.has(String(r.digitalPassId)))
        .map((r) => ({ registrationId: r._id, registrationNumber: r.registrationNumber, digitalPassId: r.digitalPassId }));
    console.log(badLinks);

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});