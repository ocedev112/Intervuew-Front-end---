import { COLORS } from "../theme/theme";

export type CandidateStatus = "Recommended" | "Review" | "Pending" | "Declined";
export type InterviewStatus =
  | "Scheduled"
  | "Completed"
  | "In Progress"
  | "Cancelled";

export interface Candidate {
  id: string;
  name: string;
  role: string;
  roleId: string;
  date: string;
  score: number;
  status: CandidateStatus;
  email: string;
  phone: string;
  location: string;
  experience: string;
  questions: { q: string; score: number; feedback: string }[];
  breakdown: { label: string; score: number; color: string }[];
  notes: string;
}

export interface JobRole {
  id: string;
  title: string;
  dept: string;
  location: string;
  type: "Full-time" | "Contract" | "Part-time";
  status: "Active" | "Closed";
  candidates: number;
  avgScore: number;
  openedDate: string;
  description: string;
  skills: string[];
  interviewCount: number;
}

export const JOB_ROLES: JobRole[] = [
  {
    id: "r1",
    title: "Product Manager",
    dept: "Product",
    location: "Remote",
    type: "Full-time",
    status: "Active",
    candidates: 12,
    avgScore: 83,
    openedDate: "Feb 1",
    description:
      "Lead product strategy and roadmap for our core platform. Work cross-functionally with engineering, design, and GTM teams.",
    skills: [
      "Roadmapping",
      "Stakeholder Mgmt",
      "Data Analysis",
      "JIRA",
      "OKRs",
    ],
    interviewCount: 12,
  },
  {
    id: "r2",
    title: "Senior Engineer",
    dept: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    status: "Active",
    candidates: 18,
    avgScore: 79,
    openedDate: "Jan 15",
    description:
      "Build scalable backend systems and own critical infrastructure. Strong focus on distributed systems and reliability.",
    skills: ["TypeScript", "Node.js", "AWS", "PostgreSQL", "System Design"],
    interviewCount: 18,
  },
  {
    id: "r3",
    title: "UX Designer",
    dept: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "Active",
    candidates: 7,
    avgScore: 88,
    openedDate: "Feb 10",
    description:
      "Shape the end-to-end product experience. Own design systems, user research, and prototyping.",
    skills: [
      "Figma",
      "User Research",
      "Prototyping",
      "Design Systems",
      "Usability Testing",
    ],
    interviewCount: 7,
  },
  {
    id: "r5",
    title: "Marketing Lead",
    dept: "Marketing",
    location: "Austin, TX",
    type: "Full-time",
    status: "Active",
    candidates: 9,
    avgScore: 80,
    openedDate: "Feb 20",
    description:
      "Own demand gen, brand, and content strategy. Drive pipeline through multi-channel campaigns.",
    skills: [
      "Campaign Strategy",
      "HubSpot",
      "SEO/SEM",
      "Analytics",
      "Copywriting",
    ],
    interviewCount: 9,
  },
  {
    id: "r6",
    title: "DevOps Engineer",
    dept: "Engineering",
    location: "Remote",
    type: "Contract",
    status: "Closed",
    candidates: 6,
    avgScore: 82,
    openedDate: "Dec 10",
    description:
      "Manage CI/CD pipelines, cloud infrastructure, and platform reliability.",
    skills: ["Kubernetes", "Terraform", "AWS", "Docker", "Monitoring"],
    interviewCount: 6,
  },
];

export const CANDIDATES: Candidate[] = [
  {
    id: "c1",
    name: "Sarah Chen",
    role: "Product Manager",
    roleId: "r1",
    date: "Mar 1",
    score: 91,
    status: "Recommended",
    email: "sarah.chen@email.com",
    phone: "+1 (415) 555-0182",
    location: "San Francisco, CA",
    experience: "6 years",
    notes:
      "Strong strategic thinker. Exceptional communication. Fast-track to final round.",
    questions: [
      {
        q: "Describe how you built and executed a product roadmap.",
        score: 93,
        feedback: "Outstanding depth and structured thinking.",
      },
      {
        q: "Tell me about a time you managed conflicting stakeholder priorities.",
        score: 90,
        feedback: "Excellent conflict resolution framework.",
      },
      {
        q: "How do you measure product success?",
        score: 91,
        feedback: "Metrics-driven with clear OKR alignment.",
      },
      {
        q: "Walk me through a feature you shipped from idea to launch.",
        score: 89,
        feedback: "Strong cross-functional narrative.",
      },
    ],
    breakdown: [
      { label: "Strategic Thinking", score: 93, color: COLORS.indigo },
      { label: "Communication", score: 90, color: COLORS.lavender },
      { label: "Data Driven", score: 91, color: COLORS.green },
      { label: "Stakeholder Mgmt", score: 88, color: COLORS.amber },
      { label: "Execution Focus", score: 92, color: COLORS.pink },
    ],
  },
  {
    id: "c2",
    name: "Marcus Lee",
    role: "Senior Engineer",
    roleId: "r2",
    date: "Feb 28",
    score: 84,
    status: "Review",
    email: "marcus.lee@email.com",
    phone: "+1 (212) 555-0341",
    location: "New York, NY",
    experience: "8 years",
    notes:
      "Solid technical fundamentals. Needs further evaluation on system design depth.",
    questions: [
      {
        q: "Walk me through your approach to system design.",
        score: 82,
        feedback: "Good overall, could go deeper on trade-offs.",
      },
      {
        q: "How do you handle technical debt?",
        score: 86,
        feedback: "Pragmatic and realistic approach.",
      },
      {
        q: "Describe a complex bug you diagnosed in production.",
        score: 88,
        feedback: "Methodical debugging process, clear communication.",
      },
      {
        q: "How do you mentor junior engineers?",
        score: 80,
        feedback: "Genuine investment in team growth.",
      },
    ],
    breakdown: [
      { label: "Technical Knowledge", score: 86, color: COLORS.indigo },
      { label: "System Design", score: 82, color: COLORS.lavender },
      { label: "Problem Solving", score: 88, color: COLORS.green },
      { label: "Communication", score: 80, color: COLORS.amber },
      { label: "Leadership", score: 82, color: COLORS.pink },
    ],
  },
  {
    id: "c3",
    name: "Priya Sharma",
    role: "UX Designer",
    roleId: "r3",
    date: "Feb 27",
    score: 77,
    status: "Pending",
    email: "priya.sharma@email.com",
    phone: "+1 (650) 555-0219",
    location: "Palo Alto, CA",
    experience: "4 years",
    notes:
      "Creative portfolio. Interview performance was average — needs a design challenge.",
    questions: [
      {
        q: "Walk me through your end-to-end design process.",
        score: 78,
        feedback: "Clear process, research depth lacking.",
      },
      {
        q: "How do you balance aesthetics vs. usability?",
        score: 76,
        feedback: "Good instincts, more concrete examples needed.",
      },
      {
        q: "Describe a time you advocated for users internally.",
        score: 79,
        feedback: "Genuine user empathy demonstrated.",
      },
    ],
    breakdown: [
      { label: "Design Process", score: 78, color: COLORS.indigo },
      { label: "Visual Communication", score: 80, color: COLORS.lavender },
      { label: "User Empathy", score: 79, color: COLORS.green },
      { label: "Critique Handling", score: 74, color: COLORS.amber },
      { label: "Prototyping", score: 76, color: COLORS.pink },
    ],
  },
  {
    id: "c4",
    name: "Tom Williams",
    role: "Product Manager",
    roleId: "r1",
    date: "Feb 26",
    score: 68,
    status: "Declined",
    email: "tom.williams@email.com",
    phone: "+1 (312) 555-0078",
    location: "Chicago, IL",
    experience: "3 years",
    notes:
      "Enthusiastic but lacked depth in key PM competencies. Not a fit at this time.",
    questions: [
      {
        q: "How do you prioritize a product backlog?",
        score: 70,
        feedback: "Basic framework, no real-world grounding.",
      },
      {
        q: "Tell me about a product failure and what you learned.",
        score: 65,
        feedback: "Vague, avoided accountability.",
      },
      {
        q: "How do you work with engineering teams?",
        score: 69,
        feedback: "Generic response, no specific examples.",
      },
    ],
    breakdown: [
      { label: "Strategic Thinking", score: 68, color: COLORS.indigo },
      { label: "Communication", score: 70, color: COLORS.lavender },
      { label: "Data Driven", score: 65, color: COLORS.green },
      { label: "Stakeholder Mgmt", score: 67, color: COLORS.amber },
      { label: "Execution Focus", score: 70, color: COLORS.pink },
    ],
  },
  {
    id: "c5",
    name: "Aisha Okonkwo",
    role: "Data Scientist",
    roleId: "r4",
    date: "Feb 24",
    score: 89,
    status: "Recommended",
    email: "aisha.okonkwo@email.com",
    phone: "+1 (510) 555-0394",
    location: "Oakland, CA",
    experience: "5 years",
    notes:
      "Exceptional ML depth. Clear communicator. Highly recommended for final round.",
    questions: [
      {
        q: "Explain a production ML model you built end-to-end.",
        score: 92,
        feedback: "Impressive pipeline design and deployment detail.",
      },
      {
        q: "How do you validate model performance in production?",
        score: 88,
        feedback: "Solid methodology, A/B testing referenced correctly.",
      },
      {
        q: "Describe a failed experiment and what you learned.",
        score: 87,
        feedback: "Honest and reflective. Growth mindset clear.",
      },
    ],
    breakdown: [
      { label: "ML Fundamentals", score: 92, color: COLORS.indigo },
      { label: "Model Validation", score: 88, color: COLORS.lavender },
      { label: "Data Storytelling", score: 89, color: COLORS.green },
      { label: "Problem Framing", score: 87, color: COLORS.amber },
      { label: "Learning Agility", score: 88, color: COLORS.pink },
    ],
  },
  {
    id: "c6",
    name: "James Ruiz",
    role: "Senior Engineer",
    roleId: "r2",
    date: "Feb 22",
    score: 75,
    status: "Review",
    email: "james.ruiz@email.com",
    phone: "+1 (713) 555-0167",
    location: "Houston, TX",
    experience: "5 years",
    notes:
      "Good cultural fit. Technical skills need validation in a take-home round.",
    questions: [
      {
        q: "Walk me through your system design process.",
        score: 74,
        feedback: "Covered basics but missed scalability concerns.",
      },
      {
        q: "How do you handle code reviews?",
        score: 78,
        feedback: "Collaborative mindset, constructive approach.",
      },
      {
        q: "Describe a time you improved team velocity.",
        score: 73,
        feedback: "Good intent, outcome metrics were vague.",
      },
    ],
    breakdown: [
      { label: "Technical Knowledge", score: 75, color: COLORS.indigo },
      { label: "System Design", score: 74, color: COLORS.lavender },
      { label: "Problem Solving", score: 76, color: COLORS.green },
      { label: "Communication", score: 78, color: COLORS.amber },
      { label: "Teamwork", score: 73, color: COLORS.pink },
    ],
  },
  {
    id: "c7",
    name: "Lin Zhao",
    role: "Marketing Lead",
    roleId: "r5",
    date: "Feb 21",
    score: 82,
    status: "Review",
    email: "lin.zhao@email.com",
    phone: "+1 (206) 555-0283",
    location: "Seattle, WA",
    experience: "7 years",
    notes: "Strong GTM background. Curious about demand gen ownership scope.",
    questions: [
      {
        q: "Tell me about a campaign you owned end-to-end.",
        score: 85,
        feedback: "Great narrative arc with strong ROI focus.",
      },
      {
        q: "How do you measure marketing attribution?",
        score: 80,
        feedback: "Multi-touch model explained well.",
      },
      {
        q: "Describe how you collaborate with product teams.",
        score: 82,
        feedback: "Cross-functional alignment clearly described.",
      },
    ],
    breakdown: [
      { label: "Campaign Strategy", score: 85, color: COLORS.indigo },
      { label: "Analytics & ROI", score: 80, color: COLORS.lavender },
      { label: "Cross-Functional", score: 82, color: COLORS.green },
      { label: "Storytelling", score: 84, color: COLORS.amber },
      { label: "Brand Thinking", score: 79, color: COLORS.pink },
    ],
  },
];

export const STATUS_COLORS: Record<CandidateStatus, string> = {
  Recommended: COLORS.green,
  Review: COLORS.amber,
  Pending: COLORS.textMuted,
  Declined: COLORS.red,
};
