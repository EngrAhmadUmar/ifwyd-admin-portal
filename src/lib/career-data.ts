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

export const JOB_TYPES: JobType[] = ["Full-time", "Part-time", "Volunteer", "Contract"];
export const JOB_STATUSES: JobStatus[] = ["Open", "Closed"];

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Adds a job posting to the in-memory mock list (dev-only, no backend yet). */
export function createMockJob(input: {
  title: string;
  department: string;
  location: string;
  description: string;
  type: JobType;
  status: JobStatus;
}): JobPosting {
  const job: JobPosting = {
    id: `local-${Date.now()}`,
    title: input.title,
    department: input.department,
    location: input.location,
    type: input.type,
    status: input.status,
    postedDate: formatToday(),
  };
  mockJobs.unshift(job);
  return job;
}

export function getMockJob(id: string): JobPosting | null {
  return mockJobs.find((job) => job.id === id) ?? null;
}

export function updateMockJob(id: string, patch: Partial<Omit<JobPosting, "id">>): JobPosting | null {
  const job = getMockJob(id);
  if (!job) return null;
  Object.assign(job, patch);
  return job;
}

export const mockJobs: JobPosting[] = [
  { id: "1", title: "Program Officer, Education", department: "Programs", location: "Bauchi", type: "Full-time", status: "Open", postedDate: "Jul 22, 2026" },
  { id: "2", title: "Monitoring & Evaluation Assistant", department: "M&E", location: "Bauchi", type: "Contract", status: "Open", postedDate: "Jul 15, 2026" },
  { id: "3", title: "Field Volunteer, Outreach", department: "Programs", location: "Kano", type: "Volunteer", status: "Open", postedDate: "Jul 1, 2026" },
  { id: "4", title: "Communications Officer", department: "Communications", location: "Remote", type: "Part-time", status: "Closed", postedDate: "Jun 10, 2026" },
];
