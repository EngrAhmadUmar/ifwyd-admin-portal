export type ProjectStatus = "Draft" | "Published";
export type ProjectFocusArea = "Education" | "Protection" | "Women" | "Youth";

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  focusArea: ProjectFocusArea;
  status: ProjectStatus;
  updatedDate: string;
  tags?: string[];
  coverImageUrl?: string | null;
  body?: string;
};

export const PROJECTS_PER_PAGE = 10;

export const PROJECT_FOCUS_AREAS: ProjectFocusArea[] = ["Education", "Protection", "Women", "Youth"];

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Adds a project to the in-memory mock list (dev-only, no backend yet). */
export function createMockProject(input: {
  title: string;
  summary: string;
  focusArea: ProjectFocusArea;
  tags: string[];
  coverImageUrl: string | null;
  body: string;
  status: ProjectStatus;
}): Project {
  const project: Project = {
    id: `local-${Date.now()}`,
    title: input.title,
    slug: slugify(input.title),
    summary: input.summary,
    focusArea: input.focusArea,
    status: input.status,
    updatedDate: formatToday(),
    tags: input.tags,
    coverImageUrl: input.coverImageUrl,
    body: input.body,
  };
  mockProjects.unshift(project);
  return project;
}

export const mockProjects: Project[] = [
  { id: "1", title: "16 Days of Activism", slug: "16-days-of-activism", summary: "Annual campaign against gender-based violence across host communities.", focusArea: "Protection", status: "Published", updatedDate: "Jul 15, 2026" },
  { id: "2", title: "Food Drive", slug: "food-drive", summary: "Quarterly food distribution for vulnerable households.", focusArea: "Youth", status: "Published", updatedDate: "Jun 30, 2026" },
  { id: "3", title: "Skill Acquisition", slug: "skill-acquisition", summary: "Vocational training in tailoring, catering, and digital skills for young women.", focusArea: "Women", status: "Published", updatedDate: "Jun 12, 2026" },
  { id: "4", title: "Social Entrepreneurship", slug: "social-entrepreneurship", summary: "Seed grants and mentorship for youth-led small businesses.", focusArea: "Youth", status: "Draft", updatedDate: "May 28, 2026" },
  { id: "5", title: "Girls in STEM", slug: "girls-in-stem", summary: "After-school STEM clubs for girls in underserved schools.", focusArea: "Education", status: "Draft", updatedDate: "May 2, 2026" },
];
