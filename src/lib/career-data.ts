export type JobStatus = "Open" | "Closed";
export type JobType = "Full-time" | "Part-time" | "Volunteer" | "Contract";

export type JobPosting = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  postedDate: string;
};

export const CAREER_PER_PAGE = 10;

export const mockJobs: JobPosting[] = [
  { id: "1", title: "Program Officer, Education", department: "Programs", location: "Bauchi", type: "Full-time", status: "Open", postedDate: "Jul 22, 2026" },
  { id: "2", title: "Monitoring & Evaluation Assistant", department: "M&E", location: "Bauchi", type: "Contract", status: "Open", postedDate: "Jul 15, 2026" },
  { id: "3", title: "Field Volunteer, Outreach", department: "Programs", location: "Kano", type: "Volunteer", status: "Open", postedDate: "Jul 1, 2026" },
  { id: "4", title: "Communications Officer", department: "Communications", location: "Remote", type: "Part-time", status: "Closed", postedDate: "Jun 10, 2026" },
];
