export type NewsStatus = "Draft" | "Published";

export type NewsPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedDate: string;
  status: NewsStatus;
  tags?: string[];
  thumbnailUrl?: string | null;
  body?: string;
};

export const NEWS_PER_PAGE = 10;

export const NEWS_CATEGORIES = ["Advocacy", "Campaign", "Programs", "Health", "Reports", "Community"] as const;

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Adds a post to the in-memory mock list (dev-only, no backend yet). */
export function createMockNewsPost(input: {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  thumbnailUrl: string | null;
  body: string;
  status: NewsStatus;
}): NewsPost {
  const post: NewsPost = {
    id: `local-${Date.now()}`,
    title: input.title,
    excerpt: input.excerpt,
    category: input.category,
    author: "Admin",
    publishedDate: formatToday(),
    status: input.status,
    tags: input.tags,
    thumbnailUrl: input.thumbnailUrl,
    body: input.body,
  };
  mockNews.unshift(post);
  return post;
}

export function getMockNewsPost(id: string): NewsPost | null {
  return mockNews.find((post) => post.id === id) ?? null;
}

export function updateMockNewsPost(
  id: string,
  patch: Partial<{
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    thumbnailUrl: string | null;
    body: string;
    status: NewsStatus;
  }>,
): NewsPost | null {
  const post = getMockNewsPost(id);
  if (!post) return null;
  Object.assign(post, patch);
  return post;
}

export const mockNews: NewsPost[] = [
  { id: "1", title: "Stakeholders task media on domestication of VAPP bill", excerpt: "Media practitioners called on to champion advocacy for the VAPP bill across states.", category: "Advocacy", author: "Comms Team", publishedDate: "Jul 28, 2026", status: "Published" },
  { id: "2", title: "Bauchi stakeholders mull domestication of VAPP law", excerpt: "Community leaders and lawmakers meet to discuss local adoption of the law.", category: "Advocacy", author: "Comms Team", publishedDate: "Jul 20, 2026", status: "Published" },
  { id: "3", title: "16 Days of Activism Against Gender-Based Violence", excerpt: "IFWYD marks the campaign with a series of community outreach events.", category: "Campaign", author: "Programs Team", publishedDate: "Jul 10, 2026", status: "Published" },
  { id: "4", title: "New skill acquisition cohort begins in Bauchi", excerpt: "40 young women enrol in the latest tailoring and catering training cohort.", category: "Programs", author: "Programs Team", publishedDate: "Jun 30, 2026", status: "Published" },
  { id: "5", title: "IFWYD partners with local schools on menstrual health drive", excerpt: "A joint outreach to distribute sanitary kits and run awareness sessions.", category: "Health", author: "Outreach Team", publishedDate: "Jun 18, 2026", status: "Draft" },
  { id: "6", title: "Year-end impact report now available", excerpt: "A look back at the programs, beneficiaries, and partners from last year.", category: "Reports", author: "M&E Team", publishedDate: "Jun 5, 2026", status: "Published" },
  { id: "7", title: "Food drive reaches 500 households in Q2", excerpt: "The quarterly food drive expands to two additional local government areas.", category: "Programs", author: "Programs Team", publishedDate: "May 22, 2026", status: "Published" },
  { id: "8", title: "Volunteer spotlight: meet this quarter's top contributors", excerpt: "Celebrating the volunteers who went above and beyond this quarter.", category: "Community", author: "Comms Team", publishedDate: "May 9, 2026", status: "Draft" },
];
