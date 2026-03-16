import { Session } from '../types';
import { COLORS } from '../theme/theme';

export const ALL_SESSIONS: Session[] = [
  {
    id: '1',
    role: 'Product Manager',
    date: 'Feb 28',
    duration: '24 min',
    score: 84,
    mode: 'Auto',
    questions: [
      { q: 'Tell me about a challenging project you led.', score: 88, feedback: 'Excellent structure with quantified outcomes.' },
      { q: 'How do you prioritize competing features?', score: 82, feedback: 'Good framework, could be more specific with examples.' },
      { q: 'Describe a time you used data to make a decision.', score: 85, feedback: 'Strong analytical mindset, well articulated.' },
      { q: 'How do you handle stakeholder conflicts?', score: 79, feedback: 'Solid approach, more concrete outcomes would strengthen it.' },
    ],
  },
  {
    id: '2',
    role: 'Senior Engineer',
    date: 'Feb 25',
    duration: '31 min',
    score: 91,
    mode: 'Manual',
    questions: [
      { q: 'Walk me through your system design process.', score: 94, feedback: 'Outstanding depth, covered trade-offs clearly.' },
      { q: 'How do you approach debugging in production?', score: 90, feedback: 'Methodical and confident. Great real-world examples.' },
      { q: 'Describe a time you improved team code quality.', score: 88, feedback: 'Good leadership angle, concrete metrics used.' },
      { q: 'How do you handle technical debt?', score: 92, feedback: 'Pragmatic and balanced — impressive.' },
    ],
  },
  {
    id: '3',
    role: 'UX Designer',
    date: 'Feb 20',
    duration: '18 min',
    score: 76,
    mode: 'Auto',
    questions: [
      { q: 'Walk me through your design process.', score: 78, feedback: 'Clear process, but lacked user research depth.' },
      { q: 'How do you handle design critique?', score: 74, feedback: 'Good attitude, could demonstrate more specific examples.' },
      { q: 'Describe a project where you improved conversion.', score: 76, feedback: 'Metrics present but could be more compelling.' },
    ],
  },
  {
    id: '4',
    role: 'Data Scientist',
    date: 'Feb 15',
    duration: '28 min',
    score: 88,
    mode: 'Auto',
    questions: [
      { q: 'Explain a complex model you built end-to-end.', score: 91, feedback: 'Exceptional clarity explaining ML pipeline.' },
      { q: 'How do you validate your models?', score: 87, feedback: 'Solid methodology, mentioned cross-validation and holdout sets.' },
      { q: 'Tell me about a failed experiment and what you learned.', score: 85, feedback: 'Honest and reflective. Growth mindset evident.' },
    ],
  },
  {
    id: '5',
    role: 'Engineering Manager',
    date: 'Feb 10',
    duration: '35 min',
    score: 79,
    mode: 'Manual',
    questions: [
      { q: 'How do you build high-performing teams?', score: 82, feedback: 'Good principles, could use more concrete examples.' },
      { q: 'Describe a time you had to let someone go.', score: 74, feedback: 'Handled sensitively, process was sound.' },
      { q: 'How do you balance shipping speed vs. quality?', score: 80, feedback: 'Pragmatic approach, references to real tradeoffs.' },
      { q: 'How do you run 1:1s effectively?', score: 79, feedback: 'Structured thinking, framework was well-defined.' },
    ],
  },
  {
    id: '6',
    role: 'Marketing Lead',
    date: 'Feb 5',
    duration: '22 min',
    score: 82,
    mode: 'Auto',
    questions: [
      { q: 'Tell me about a campaign you owned end-to-end.', score: 85, feedback: 'Great storytelling with strong results focus.' },
      { q: 'How do you measure marketing ROI?', score: 80, feedback: 'Solid metrics framework, attribution model explained well.' },
      { q: 'Describe how you collaborate with product teams.', score: 81, feedback: 'Cross-functional alignment well described.' },
    ],
  },
];

export const BREAKDOWN_BY_SESSION: Record<string, { label: string; score: number; color: string }[]> = {
  '1': [
    { label: 'Strategic Thinking',    score: 86, color: COLORS.indigo },
    { label: 'Communication Clarity', score: 82, color: COLORS.lavender },
    { label: 'Problem Solving',       score: 84, color: COLORS.green },
    { label: 'Stakeholder Mgmt',      score: 79, color: COLORS.amber },
    { label: 'Data Driven',           score: 88, color: COLORS.pink },
  ],
  '2': [
    { label: 'Technical Knowledge',   score: 94, color: COLORS.indigo },
    { label: 'System Design',         score: 92, color: COLORS.lavender },
    { label: 'Problem Solving',       score: 90, color: COLORS.green },
    { label: 'Leadership',            score: 88, color: COLORS.amber },
    { label: 'Communication',         score: 89, color: COLORS.pink },
  ],
  '3': [
    { label: 'Design Process',        score: 78, color: COLORS.indigo },
    { label: 'User Empathy',          score: 80, color: COLORS.lavender },
    { label: 'Visual Communication',  score: 74, color: COLORS.green },
    { label: 'Critique Handling',     score: 74, color: COLORS.amber },
    { label: 'Results Focus',         score: 76, color: COLORS.pink },
  ],
  '4': [
    { label: 'ML Fundamentals',       score: 91, color: COLORS.indigo },
    { label: 'Model Validation',      score: 87, color: COLORS.lavender },
    { label: 'Data Storytelling',     score: 88, color: COLORS.green },
    { label: 'Problem Framing',       score: 86, color: COLORS.amber },
    { label: 'Learning Agility',      score: 85, color: COLORS.pink },
  ],
  '5': [
    { label: 'Team Building',         score: 82, color: COLORS.indigo },
    { label: 'Difficult Conversations',score: 74, color: COLORS.lavender },
    { label: 'Strategic Thinking',    score: 80, color: COLORS.green },
    { label: 'Coaching',              score: 79, color: COLORS.amber },
    { label: 'Execution',             score: 78, color: COLORS.pink },
  ],
  '6': [
    { label: 'Campaign Strategy',     score: 85, color: COLORS.indigo },
    { label: 'Analytics & ROI',       score: 80, color: COLORS.lavender },
    { label: 'Cross-Functional Collab',score: 81, color: COLORS.green },
    { label: 'Storytelling',          score: 84, color: COLORS.amber },
    { label: 'Brand Thinking',        score: 82, color: COLORS.pink },
  ],
};