import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Import seed data from separate files
import {
  domainsData,
  resourcesData,
  studyPlanData,
  questionsData,
} from './data';

// ============================================
// Firebase Initialization
// ============================================

if (!admin.apps.length) {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    admin.initializeApp({ projectId: 'aws-ai-practitioner-dev' });
  } else {
    admin.initializeApp();
  }
}

const db = getFirestore();

// ============================================
// Collection Names
// ============================================

const COLLECTIONS = {
  DOMAINS: 'domains',
  RESOURCES: 'resources',
  STUDY_PLANS: 'studyPlans',
  QUESTIONS: 'questions',
} as const;

// ============================================
// Seed Functions
// ============================================

async function seedDomains() {
  console.log('Seeding domains...');
  const batch = db.batch();

  for (const domain of domainsData) {
    const ref = db.collection(COLLECTIONS.DOMAINS).doc(`domain-${domain.domainNumber}`);
    batch.set(ref, {
      ...domain,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`  ✓ Seeded ${domainsData.length} domains`);
}

async function seedResources() {
  console.log('Seeding resources...');
  const batch = db.batch();

  resourcesData.forEach((resource, index) => {
    const ref = db.collection(COLLECTIONS.RESOURCES).doc(`resource-${index + 1}`);
    batch.set(ref, {
      ...resource,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(`  ✓ Seeded ${resourcesData.length} resources`);
}

async function seedStudyPlan() {
  console.log('Seeding study plan...');
  const batch = db.batch();

  for (const week of studyPlanData) {
    const ref = db.collection(COLLECTIONS.STUDY_PLANS).doc(`week-${week.week}`);
    batch.set(ref, {
      ...week,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`  ✓ Seeded ${studyPlanData.length} study plan weeks`);
}

async function seedQuestions() {
  console.log('Seeding questions...');
  const batch = db.batch();

  questionsData.forEach((question, index) => {
    const ref = db.collection(COLLECTIONS.QUESTIONS).doc(`question-${index + 1}`);
    batch.set(ref, {
      ...question,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(`  ✓ Seeded ${questionsData.length} questions`);
}

// ============================================
// Utility Functions
// ============================================

async function clearCollections() {
  console.log('Clearing existing data...');

  const collectionNames = Object.values(COLLECTIONS);

  for (const collectionName of collectionNames) {
    const snapshot = await db.collection(collectionName).get();

    if (snapshot.docs.length === 0) {
      continue;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`  ✓ Cleared ${snapshot.docs.length} documents from ${collectionName}`);
  }
}

// ============================================
// Main Entry Point
// ============================================

async function main() {
  console.log('\n🌱 Starting database seeding...\n');

  try {
    await clearCollections();
    await seedDomains();
    await seedResources();
    await seedStudyPlan();
    await seedQuestions();

    console.log('\n✅ Seeding completed successfully!\n');
    console.log('Summary:');
    console.log(`  • ${domainsData.length} domains`);
    console.log(`  • ${resourcesData.length} resources`);
    console.log(`  • ${studyPlanData.length} study plan weeks`);
    console.log(`  • ${questionsData.length} questions`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
