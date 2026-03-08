import { CreateResourceInput } from '../../types';

export const resourcesData: CreateResourceInput[] = [
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
