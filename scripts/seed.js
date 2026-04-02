/**
 * Seed script for Firebase emulators
 * Run with: npm run seed:docker (while Docker emulators are running)
 * Or: npm run seed (starts local emulators + seeds)
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (connects to emulator automatically via FIRESTORE_EMULATOR_HOST)
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

if (getApps().length === 0) {
  initializeApp({
    projectId: 'aws-ai-practitioner-dev',
  });
}

const db = getFirestore();

const domains = [
  {
    id: 1,
    domainNumber: 1,
    name: 'Fundamentals of AI & ML',
    weight: 20,
    color: '#00D4FF',
    weeks: '1–2',
    topics: [
      'AI vs ML vs Deep Learning definitions',
      'Supervised, Unsupervised, Reinforcement Learning',
      'Training, validation, test datasets',
      'Overfitting, underfitting, bias-variance tradeoff',
      'Model evaluation metrics',
      'Common ML algorithms',
      'Neural networks & deep learning basics',
      'AWS ML stack overview',
      'Data preprocessing & feature engineering',
      'MLOps concepts',
    ],
    order: 1,
  },
  {
    id: 2,
    domainNumber: 2,
    name: 'Fundamentals of Generative AI',
    weight: 24,
    color: '#FF6B35',
    weeks: '3–4',
    topics: [
      'What is Generative AI & LLMs',
      'Transformers architecture basics',
      'Tokens, embeddings, context windows',
      'Prompt engineering techniques',
      'Temperature, top-p, top-k parameters',
      'Hallucinations and mitigation',
      'Multimodal models',
      'Amazon Bedrock overview',
      'Amazon Titan models',
      'Claude, Llama, Mistral on Bedrock',
      'Amazon Q',
      'AWS PartyRock',
    ],
    order: 2,
  },
  {
    id: 3,
    domainNumber: 3,
    name: 'Applications of Foundation Models',
    weight: 28,
    color: '#FFD700',
    weeks: '5–7',
    topics: [
      'RAG architecture',
      'Amazon Bedrock Knowledge Bases',
      'Vector databases & embeddings',
      'Fine-tuning vs RAG vs prompt engineering',
      'Amazon Bedrock Agents',
      'Amazon Bedrock Guardrails',
      'Model customization',
      'Inference parameters',
      'Cost optimization',
      'Choosing the right foundation model',
      'Amazon SageMaker JumpStart',
      'Integration patterns',
    ],
    order: 3,
  },
  {
    id: 4,
    domainNumber: 4,
    name: 'Guidelines for Responsible AI',
    weight: 14,
    color: '#00FF88',
    weeks: '8',
    topics: [
      'Fairness, bias, and discrimination',
      'Transparency and explainability',
      'AWS AI Service Cards',
      'Human-in-the-loop design',
      'Amazon SageMaker Clarify',
      'Model fairness metrics',
      'Environmental impact',
      'AWS Responsible AI principles',
      'Identifying and mitigating risks',
      'Ethical use cases',
    ],
    order: 4,
  },
  {
    id: 5,
    domainNumber: 5,
    name: 'Security, Compliance & Governance',
    weight: 14,
    color: '#FF4D8D',
    weeks: '9',
    topics: [
      'AWS IAM for AI/ML services',
      'Data encryption',
      'Amazon Macie',
      'AWS PrivateLink & VPC endpoints',
      'Compliance frameworks',
      'AWS Artifact',
      'Amazon Bedrock data privacy',
      'Audit logging with CloudTrail',
      'AWS Config for governance',
      'Data lineage and provenance',
    ],
    order: 5,
  },
];

const resources = [
  { type: 'FREE', name: 'Andrew Brown – FreeCodeCamp 15hr Course', url: 'https://youtube.com', note: 'Best free full course', order: 1 },
  { type: 'PAID', name: 'Stephane Maarek – Udemy Course', url: 'https://udemy.com', note: '~$15 on sale', order: 2 },
  { type: 'PRACTICE', name: 'Tutorials Dojo Practice Exams', url: 'https://tutorialsdojo.com', note: '135 questions', order: 3 },
  { type: 'FREE', name: 'AWS Skill Builder', url: 'https://skillbuilder.aws', note: 'Official AWS content', order: 4 },
  { type: 'OFFICIAL', name: 'AWS Exam Guide AIF-C01', url: 'https://docs.aws.amazon.com', note: 'Read this FIRST', order: 5 },
];

const studyWeeks = [
  { week: 1, phase: 'Foundation', domainNumber: 1, daily: ['Study AI/ML fundamentals', 'Watch videos', 'Take notes'], milestone: 'Complete Domain 1 basics', order: 1 },
  { week: 2, phase: 'Foundation', domainNumber: 1, daily: ['Deep dive ML algorithms', 'Practice questions', 'Review notes'], milestone: 'Domain 1 mastery', order: 2 },
  { week: 3, phase: 'GenAI Core', domainNumber: 2, daily: ['Learn GenAI concepts', 'Explore Bedrock', 'Hands-on labs'], milestone: 'Understand LLMs', order: 3 },
  { week: 4, phase: 'GenAI Core', domainNumber: 2, daily: ['Prompt engineering', 'Model parameters', 'Practice'], milestone: 'Domain 2 complete', order: 4 },
  { week: 5, phase: 'Applications', domainNumber: 3, daily: ['RAG architecture', 'Knowledge bases', 'Agents'], milestone: 'RAG understanding', order: 5 },
  { week: 6, phase: 'Applications', domainNumber: 3, daily: ['Fine-tuning', 'Guardrails', 'Integration'], milestone: 'Domain 3 progress', order: 6 },
  { week: 7, phase: 'Applications', domainNumber: 3, daily: ['Cost optimization', 'Model selection', 'Review'], milestone: 'Domain 3 complete', order: 7 },
  { week: 8, phase: 'Responsible AI', domainNumber: 4, daily: ['Ethics & fairness', 'Clarify', 'Best practices'], milestone: 'Domain 4 complete', order: 8 },
  { week: 9, phase: 'Security', domainNumber: 5, daily: ['IAM & security', 'Compliance', 'Governance'], milestone: 'Domain 5 complete', order: 9 },
  { week: 10, phase: 'Full Review', domainNumber: null, daily: ['Full review', 'Practice exams', 'Weak areas'], milestone: 'Ready for exam', order: 10 },
];

async function seed() {
  console.log('🌱 Seeding Firestore...\n');

  // Seed domains
  console.log('📚 Seeding domains...');
  for (const domain of domains) {
    const { id, ...data } = domain;
    await db.collection('domains').doc(String(id)).set({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`   ✓ Added domain: ${domain.name}`);
  }

  // Seed resources
  console.log('\n📖 Seeding resources...');
  for (let i = 0; i < resources.length; i++) {
    await db.collection('resources').doc(`resource-${i + 1}`).set({
      ...resources[i],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`   ✓ Added resource: ${resources[i].name}`);
  }

  // Seed study weeks
  console.log('\n📅 Seeding study weeks...');
  for (const week of studyWeeks) {
    await db.collection('studyWeeks').doc(`week-${week.week}`).set({
      ...week,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`   ✓ Added week ${week.week}: ${week.phase}`);
  }

  console.log('\n✅ Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
