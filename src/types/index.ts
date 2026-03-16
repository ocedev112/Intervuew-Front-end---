export type InterviewStatus = "listening" | "thinking" | "speaking" | "idle";
export type UserRole = "applicant" | "org";

export interface Candidate {
  id: string;
  name: string;
  role: string;
  date: string;
  score: number;
  status: CandidateStatus;
}
export type CandidateStatus = "Recommended" | "Review" | "Pending" | "Declined";
export interface TranscriptEntry {
  who: "AI" | "You";
  text: string;
}
export interface ScoreCategory {
  label: string;
  score: number;
  color: string;
}
export interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  to?: string;
}

export interface Session {
  id: string;
  role: string;
  date: string;
  duration: string;
  score: number;
  mode: "Auto" | "Manual";
  questions?: QuestionResult[];
}

export interface QuestionResult {
  q: string;
  score: number;
  feedback: string;
}

export interface ScoreCategory {
  label: string;
  score: number;
  color: string;
}

interface Language {
  [key: string]: number;
}
interface Domain {
  [key: string]: number;
}

interface JobRequirements {
  role: string;
  languages: Language[];
  domains: Domain[];
  softskills: string[];
}

export interface InterviewRequest {
  role: string;
  description: string;
  organization_id: string;
  job_requirements: JobRequirements;
  start_date: string;
  end_date: string;
  duration: number;
}

export interface InterviewDict {
  id: string;
  role: string;
  description: string;
  organization_id: string;
  job_requirements: JobRequirements;
  start_date: string;
  end_date: string;
  duration: number;
}

export interface AppliedRole {
  applicant_id: string;
  interview: InterviewDict;
}

export interface ApplicantDict {
  id: string;
  name: string;
  interview_id: string;
  user_id: string;
}
