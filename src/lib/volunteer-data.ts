export type SubmissionStatus = "New" | "Contacted" | "Archived";

export type VolunteerApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interests: string;
  submittedDate: string;
  status: SubmissionStatus;
};

export const VOLUNTEER_PER_PAGE = 10;

export const mockVolunteerApplications: VolunteerApplication[] = [
  { id: "1", name: "Halima Yusuf", email: "halima.y@example.com", phone: "+234 810 123 4567", interests: "Weekend teaching, event support", submittedDate: "Aug 8, 2026", status: "New" },
  { id: "2", name: "David Okon", email: "david.okon@example.com", phone: "+234 802 234 5678", interests: "Logistics, food drives", submittedDate: "Aug 6, 2026", status: "New" },
  { id: "3", name: "Amina Bello", email: "amina.bello@example.com", phone: "+234 703 345 6789", interests: "Skill training facilitation", submittedDate: "Aug 2, 2026", status: "Contacted" },
  { id: "4", name: "Peter Nnamdi", email: "peter.n@example.com", phone: "+234 815 456 7890", interests: "Photography, social media", submittedDate: "Jul 26, 2026", status: "Archived" },
];
