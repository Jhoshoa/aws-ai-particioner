import { AchievementCategory, AchievementConditionType } from '../../types';

interface AchievementSeedData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  points: number;
  condition: {
    type: AchievementConditionType;
    value: number;
  };
  order: number;
}

export const achievementsData: AchievementSeedData[] = [
  // Getting Started
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first topic',
    icon: 'footprints',
    category: 'getting_started',
    points: 10,
    condition: { type: 'topics_completed', value: 1 },
    order: 1,
  },
  {
    id: 'quiz-starter',
    name: 'Quiz Starter',
    description: 'Complete your first quiz',
    icon: 'clipboard-check',
    category: 'getting_started',
    points: 10,
    condition: { type: 'quizzes_completed', value: 1 },
    order: 2,
  },
  {
    id: 'note-taker',
    name: 'Note Taker',
    description: 'Save your first note',
    icon: 'pencil',
    category: 'getting_started',
    points: 10,
    condition: { type: 'notes_created', value: 1 },
    order: 3,
  },

  // Domain Mastery
  {
    id: 'ai-ml-scholar',
    name: 'AI/ML Scholar',
    description: 'Complete all Domain 1 topics',
    icon: 'brain',
    category: 'domain_mastery',
    points: 100,
    condition: { type: 'domain_completed', value: 1 },
    order: 10,
  },
  {
    id: 'genai-expert',
    name: 'GenAI Expert',
    description: 'Complete all Domain 2 topics',
    icon: 'sparkles',
    category: 'domain_mastery',
    points: 100,
    condition: { type: 'domain_completed', value: 2 },
    order: 11,
  },
  {
    id: 'fm-guru',
    name: 'FM Guru',
    description: 'Complete all Domain 3 topics',
    icon: 'layers',
    category: 'domain_mastery',
    points: 100,
    condition: { type: 'domain_completed', value: 3 },
    order: 12,
  },
  {
    id: 'ethics-champion',
    name: 'Ethics Champion',
    description: 'Complete all Domain 4 topics',
    icon: 'shield-check',
    category: 'domain_mastery',
    points: 100,
    condition: { type: 'domain_completed', value: 4 },
    order: 13,
  },
  {
    id: 'security-pro',
    name: 'Security Pro',
    description: 'Complete all Domain 5 topics',
    icon: 'lock',
    category: 'domain_mastery',
    points: 100,
    condition: { type: 'domain_completed', value: 5 },
    order: 14,
  },

  // Streaks
  {
    id: 'streak-3',
    name: 'Getting Consistent',
    description: 'Study 3 days in a row',
    icon: 'flame',
    category: 'streaks',
    points: 25,
    condition: { type: 'streak_days', value: 3 },
    order: 20,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Study 7 days in a row',
    icon: 'flame',
    category: 'streaks',
    points: 50,
    condition: { type: 'streak_days', value: 7 },
    order: 21,
  },
  {
    id: 'streak-14',
    name: 'Two Week Champion',
    description: 'Study 14 days in a row',
    icon: 'flame',
    category: 'streaks',
    points: 100,
    condition: { type: 'streak_days', value: 14 },
    order: 22,
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Study 30 days in a row',
    icon: 'flame',
    category: 'streaks',
    points: 200,
    condition: { type: 'streak_days', value: 30 },
    order: 23,
  },

  // Quiz Performance
  {
    id: 'perfect-10',
    name: 'Perfect Score',
    description: 'Get 100% on a 10+ question quiz',
    icon: 'trophy',
    category: 'quiz_performance',
    points: 75,
    condition: { type: 'perfect_quiz', value: 10 },
    order: 30,
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Answer 100 questions correctly',
    icon: 'check-circle',
    category: 'quiz_performance',
    points: 100,
    condition: { type: 'correct_answers', value: 100 },
    order: 31,
  },
  {
    id: 'question-master',
    name: 'Question Master',
    description: 'Answer 500 questions correctly',
    icon: 'award',
    category: 'quiz_performance',
    points: 300,
    condition: { type: 'correct_answers', value: 500 },
    order: 32,
  },

  // Study Time
  {
    id: 'hour-power',
    name: 'Hour Power',
    description: 'Study for 1 hour total',
    icon: 'clock',
    category: 'study_time',
    points: 20,
    condition: { type: 'study_minutes', value: 60 },
    order: 40,
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Study for 10 hours total',
    icon: 'clock',
    category: 'study_time',
    points: 75,
    condition: { type: 'study_minutes', value: 600 },
    order: 41,
  },
  {
    id: 'marathon-runner',
    name: 'Marathon Runner',
    description: 'Study for 50 hours total',
    icon: 'clock',
    category: 'study_time',
    points: 250,
    condition: { type: 'study_minutes', value: 3000 },
    order: 42,
  },

  // Mock Exams
  {
    id: 'first-mock',
    name: 'First Mock',
    description: 'Complete your first mock exam',
    icon: 'file-text',
    category: 'mock_exams',
    points: 50,
    condition: { type: 'mock_exams_completed', value: 1 },
    order: 50,
  },
  {
    id: 'passing-grade',
    name: 'Passing Grade',
    description: 'Score 700+ on a mock exam',
    icon: 'target',
    category: 'mock_exams',
    points: 150,
    condition: { type: 'mock_score', value: 700 },
    order: 51,
  },
  {
    id: 'excellence',
    name: 'Excellence',
    description: 'Score 850+ on a mock exam',
    icon: 'star',
    category: 'mock_exams',
    points: 250,
    condition: { type: 'mock_score', value: 850 },
    order: 52,
  },

  // Completion
  {
    id: 'halfway-there',
    name: 'Halfway There',
    description: 'Complete 50% of all topics',
    icon: 'percent',
    category: 'completion',
    points: 150,
    condition: { type: 'total_progress', value: 50 },
    order: 60,
  },
  {
    id: 'fully-prepared',
    name: 'Fully Prepared',
    description: 'Complete 100% of all topics',
    icon: 'check-circle-2',
    category: 'completion',
    points: 500,
    condition: { type: 'total_progress', value: 100 },
    order: 61,
  },
];
