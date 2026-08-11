import type { SubmissionStatus } from "./volunteer-data";

export type Registration = {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  submittedDate: string;
  status: SubmissionStatus;
};

export const REGISTER_PER_PAGE = 10;

export const mockRegistrations: Registration[] = [
  { id: "1", name: "Ruth Danladi", email: "ruth.d@example.com", phone: "+234 809 111 2222", program: "Skill Acquisition", submittedDate: "Aug 9, 2026", status: "New" },
  { id: "2", name: "Ibrahim Sani", email: "ibrahim.s@example.com", phone: "+234 706 222 3333", program: "Digital Literacy Basics", submittedDate: "Aug 7, 2026", status: "New" },
  { id: "3", name: "Grace Effiong", email: "grace.e@example.com", phone: "+234 812 333 4444", program: "Catering & Hospitality", submittedDate: "Aug 1, 2026", status: "Contacted" },
];
