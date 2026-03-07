/**
 * Seed script for Firebase emulators
 * Run with: npm run seed
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'aws-ai-practitioner-dev',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulator
connectFirestoreEmulator(db, 'localhost', 8080);

const domains = [
  {
    id: 1,
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
  },
  {
    id: 2,
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
  },
  {
    id: 3,
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
  },
  {
    id: 4,
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
  },
  {
    id: 5,
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
  },
];

const resources = [
  { type: 'FREE', name: 'Andrew Brown – FreeCodeCamp 15hr Course', url: 'https://youtube.com', note: 'Best free full course' },
  { type: 'PAID', name: 'Stephane Maarek – Udemy Course', url: 'https://udemy.com', note: '~$15 on sale' },
  { type: 'PRACTICE', name: 'Tutorials Dojo Practice Exams', url: 'https://tutorialsdojo.com', note: '135 questions' },
  { type: 'FREE', name: 'AWS Skill Builder', url: 'https://skillbuilder.aws', note: 'Official AWS content' },
  { type: 'OFFICIAL', name: 'AWS Exam Guide AIF-C01', url: 'https://docs.aws.amazon.com', note: 'Read this FIRST' },
];

async function seed() {
  console.log('Seeding Firestore...');

  // Seed domains
  for (const domain of domains) {
    await setDoc(doc(db, 'domains', String(domain.id)), domain);
    console.log(`  Added domain: ${domain.name}`);
  }

  // Seed resources
  for (let i = 0; i < resources.length; i++) {
    await setDoc(doc(db, 'resources', `resource-${i + 1}`), resources[i]);
    console.log(`  Added resource: ${resources[i].name}`);
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
