import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin for seeding
// This uses the service account credentials or emulator
if (!admin.apps.length) {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    admin.initializeApp({ projectId: 'aws-ai-practitioner-dev' });
  } else {
    admin.initializeApp();
  }
}

const db = getFirestore();

// ============================================
// Seed Data
// ============================================

const domains = [
  {
    domainNumber: 1,
    name: 'Fundamentals of AI & ML',
    weight: 20,
    color: '#00D4FF',
    weeks: '1–2',
    order: 1,
    topics: [
      'AI vs ML vs Deep Learning definitions',
      'Supervised, Unsupervised, Reinforcement Learning',
      'Training, validation, test datasets',
      'Overfitting, underfitting, bias-variance tradeoff',
      'Model evaluation metrics (accuracy, precision, recall, F1, AUC)',
      'Common ML algorithms (regression, classification, clustering)',
      'Neural networks & deep learning basics',
      'AWS ML stack overview: SageMaker, Rekognition, Comprehend, Polly, Transcribe, Translate',
      'Data preprocessing & feature engineering',
      'MLOps concepts',
    ],
  },
  {
    domainNumber: 2,
    name: 'Fundamentals of Generative AI',
    weight: 24,
    color: '#FF6B35',
    weeks: '3–4',
    order: 2,
    topics: [
      'What is Generative AI & Large Language Models (LLMs)',
      'Transformers architecture basics',
      'Tokens, embeddings, context windows',
      'Prompt engineering techniques (zero-shot, few-shot, chain-of-thought)',
      'Temperature, top-p, top-k parameters',
      'Hallucinations and mitigation strategies',
      'Text-to-image, text-to-video, multimodal models',
      'Amazon Bedrock overview & foundation models',
      'Amazon Titan models',
      'Anthropic Claude, Meta Llama, Mistral on Bedrock',
      'Amazon Q Business & Developer',
      'AWS PartyRock',
    ],
  },
  {
    domainNumber: 3,
    name: 'Applications of Foundation Models',
    weight: 28,
    color: '#FFD700',
    weeks: '5–7',
    order: 3,
    topics: [
      'RAG (Retrieval-Augmented Generation) architecture',
      'Amazon Bedrock Knowledge Bases',
      'Vector databases & embeddings (Amazon OpenSearch, Aurora pgvector)',
      'Fine-tuning vs RAG vs prompt engineering trade-offs',
      'Amazon Bedrock Agents',
      'Amazon Bedrock Guardrails',
      'Model customization: fine-tuning, continued pre-training',
      'Inference parameters and their effects',
      'Cost optimization for FM usage',
      'Choosing the right foundation model for a use case',
      'Amazon SageMaker JumpStart',
      'Integration patterns with AWS services',
    ],
  },
  {
    domainNumber: 4,
    name: 'Guidelines for Responsible AI',
    weight: 14,
    color: '#00FF88',
    weeks: '8',
    order: 4,
    topics: [
      'Fairness, bias, and discrimination in AI',
      'Transparency and explainability (XAI)',
      'AWS AI Service Cards',
      'Human-in-the-loop (HITL) design',
      'Amazon SageMaker Clarify',
      'Model fairness metrics',
      'Environmental impact of AI',
      'AWS Responsible AI principles',
      'Identifying and mitigating AI risks',
      'Ethical use cases and red flags',
    ],
  },
  {
    domainNumber: 5,
    name: 'Security, Compliance & Governance',
    weight: 14,
    color: '#FF4D8D',
    weeks: '9',
    order: 5,
    topics: [
      'AWS IAM for AI/ML services',
      'Data encryption at rest and in transit',
      'Amazon Macie for data classification',
      'AWS PrivateLink & VPC endpoints for AI services',
      'Compliance frameworks (GDPR, HIPAA) in AI context',
      'AWS Artifact for compliance reports',
      'Amazon Bedrock data privacy & model isolation',
      'Audit logging with AWS CloudTrail',
      'AWS Config for AI resource governance',
      'Data lineage and provenance',
    ],
  },
];

const resources = [
  {
    type: 'FREE',
    name: 'Andrew Brown – FreeCodeCamp 15hr Course',
    url: 'https://youtube.com',
    note: 'Best free full course, by AWS Community Hero',
    order: 1,
  },
  {
    type: 'PAID',
    name: 'Stephane Maarek – Udemy Course',
    url: 'https://udemy.com',
    note: '~$15 on sale. Most popular paid option',
    order: 2,
  },
  {
    type: 'PRACTICE',
    name: 'Tutorials Dojo AIF-C01 Practice Exams',
    url: 'https://tutorialsdojo.com',
    note: '135 Qs, section-based & timed modes',
    order: 3,
  },
  {
    type: 'PRACTICE',
    name: 'Stephane Maarek Practice Tests (Udemy)',
    url: 'https://udemy.com',
    note: '260 Qs, co-authored with Abhishek Singh',
    order: 4,
  },
  {
    type: 'FREE',
    name: 'AWS Skill Builder – Official Course',
    url: 'https://skillbuilder.aws',
    note: 'Official AWS content, free tier available',
    order: 5,
  },
  {
    type: 'FREE',
    name: 'ExamTopics AIF-C01 (free Qs)',
    url: 'https://examtopics.com',
    note: '20 free questions + community discussions',
    order: 6,
  },
  {
    type: 'OFFICIAL',
    name: 'AWS Official Exam Guide AIF-C01',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/examguides/ai-practitioner-01.html',
    note: 'Read this FIRST — defines exact scope',
    order: 7,
  },
];

const studyPlan = [
  { week: 1, phase: 'Foundation', domainNumber: 1, daily: ['Read AWS AI/ML overview docs (20 min)', 'Watch 1 SageMaker intro video (20 min)', 'Take notes in your repo (20 min)'], milestone: 'Understand the AI/ML landscape', order: 1 },
  { week: 2, phase: 'Foundation', domainNumber: 1, daily: ['Study ML algorithms & metrics (20 min)', 'AWS Free Tier: explore SageMaker Studio (20 min)', 'Practice 10 questions on Domain 1 (20 min)'], milestone: 'Score 70%+ on Domain 1 mock', order: 2 },
  { week: 3, phase: 'GenAI Core', domainNumber: 2, daily: ['Study LLM concepts & transformers (20 min)', 'Explore Amazon Bedrock console (20 min)', 'Take notes + 10 practice Qs (20 min)'], milestone: 'Understand GenAI fundamentals', order: 3 },
  { week: 4, phase: 'GenAI Core', domainNumber: 2, daily: ['Deep dive: prompt engineering (20 min)', 'Hands-on: Amazon Q / PartyRock (20 min)', 'Practice 15 questions Domain 2 (20 min)'], milestone: 'Score 70%+ on Domain 2 mock', order: 4 },
  { week: 5, phase: 'Applications', domainNumber: 3, daily: ['Study RAG architecture (20 min)', 'Explore Bedrock Knowledge Bases (20 min)', 'Diagram RAG flow in notes (20 min)'], milestone: 'Explain RAG end-to-end', order: 5 },
  { week: 6, phase: 'Applications', domainNumber: 3, daily: ['Study Bedrock Agents & Guardrails (20 min)', 'Read fine-tuning vs RAG comparison (20 min)', '20 practice Qs Domain 3 (20 min)'], milestone: 'Master Domain 3 concepts', order: 6 },
  { week: 7, phase: 'Applications', domainNumber: 3, daily: ['Review model selection criteria (20 min)', 'Cost & latency optimization review (20 min)', 'Full Domain 3 mock test (20 min)'], milestone: 'Score 75%+ on Domain 3 mock', order: 7 },
  { week: 8, phase: 'Responsible AI', domainNumber: 4, daily: ['Study responsible AI principles (20 min)', 'Review SageMaker Clarify docs (20 min)', '10 practice Qs + notes (20 min)'], milestone: 'Know all AWS responsible AI tools', order: 8 },
  { week: 9, phase: 'Security', domainNumber: 5, daily: ['Study IAM, encryption for AI (20 min)', 'Review compliance + Bedrock privacy (20 min)', '15 practice Qs Domain 5 (20 min)'], milestone: 'Score 70%+ on Domains 4+5', order: 9 },
  { week: 10, phase: 'Full Review', domainNumber: null, daily: ['Full 65-question mock exam (30 min)', 'Review wrong answers deeply (20 min)', 'Re-read weak domain notes (10 min)'], milestone: 'Score 750+ on full mock', order: 10 },
  { week: 11, phase: 'Exam Prep', domainNumber: null, daily: ['Second full mock exam (30 min)', 'Flashcard review (15 min)', 'AWS whitepapers skim (15 min)'], milestone: 'Consistent 800+ score', order: 11 },
  { week: 12, phase: 'Final Push', domainNumber: null, daily: ['Light review of all domain summaries (30 min)', 'Rest + confidence building (15 min)', 'Schedule & take the exam!'], milestone: 'PASS AIF-C01!', order: 12 },
];

// ============================================
// Seed Functions
// ============================================

async function seedDomains() {
  console.log('Seeding domains...');
  const batch = db.batch();

  for (const domain of domains) {
    const ref = db.collection('domains').doc(`domain-${domain.domainNumber}`);
    batch.set(ref, {
      ...domain,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`  ✓ Seeded ${domains.length} domains`);
}

async function seedResources() {
  console.log('Seeding resources...');
  const batch = db.batch();

  resources.forEach((resource, index) => {
    const ref = db.collection('resources').doc(`resource-${index + 1}`);
    batch.set(ref, {
      ...resource,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(`  ✓ Seeded ${resources.length} resources`);
}

async function seedStudyPlan() {
  console.log('Seeding study plan...');
  const batch = db.batch();

  for (const week of studyPlan) {
    const ref = db.collection('studyPlans').doc(`week-${week.week}`);
    batch.set(ref, {
      ...week,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`  ✓ Seeded ${studyPlan.length} study plan weeks`);
}

async function clearCollections() {
  console.log('Clearing existing data...');

  const collections = ['domains', 'resources', 'studyPlans'];

  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    if (snapshot.docs.length > 0) {
      await batch.commit();
      console.log(`  ✓ Cleared ${snapshot.docs.length} documents from ${collectionName}`);
    }
  }
}

// ============================================
// Main
// ============================================

async function main() {
  console.log('\n🌱 Starting database seeding...\n');

  try {
    await clearCollections();
    await seedDomains();
    await seedResources();
    await seedStudyPlan();

    console.log('\n✅ Seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
