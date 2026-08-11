export type ProjectStatus = "Draft" | "Published";

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  focusArea: "Education" | "Protection" | "Women" | "Youth";
  status: ProjectStatus;
  updatedDate: string;
};

export const PROJECTS_PER_PAGE = 10;

export const mockProjects: Project[] = [
  { id: "1", title: "16 Days of Activism", slug: "16-days-of-activism", summary: "Annual campaign against gender-based violence across host communities.", focusArea: "Protection", status: "Published", updatedDate: "Jul 15, 2026" },
  { id: "2", title: "Food Drive", slug: "food-drive", summary: "Quarterly food distribution for vulnerable households.", focusArea: "Youth", status: "Published", updatedDate: "Jun 30, 2026" },
  { id: "3", title: "Skill Acquisition", slug: "skill-acquisition", summary: "Vocational training in tailoring, catering, and digital skills for young women.", focusArea: "Women", status: "Published", updatedDate: "Jun 12, 2026" },
  { id: "4", title: "Social Entrepreneurship", slug: "social-entrepreneurship", summary: "Seed grants and mentorship for youth-led small businesses.", focusArea: "Youth", status: "Draft", updatedDate: "May 28, 2026" },
  { id: "5", title: "Girls in STEM", slug: "girls-in-stem", summary: "After-school STEM clubs for girls in underserved schools.", focusArea: "Education", status: "Draft", updatedDate: "May 2, 2026" },
];
