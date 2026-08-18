import { mockNews, type NewsPost } from "./news-data";
import { mockProjects, type Project } from "./projects-data";

export type ContentType = "News" | "Projects";
export type ContentStatus = "Draft" | "Published";

export type ContentItem = {
  id: string;
  sourceId: string;
  type: ContentType;
  title: string;
  category: string;
  status: ContentStatus;
  date: string;
  thumbnail: string;
};

export type ContentStat = {
  key: string;
  label: string;
  value: number;
  change?: string;
  highlight?: boolean;
};

function newsToContentItem(post: NewsPost): ContentItem {
  return {
    id: `news-${post.id}`,
    sourceId: post.id,
    type: "News",
    title: post.title,
    category: post.category,
    status: post.status,
    date: post.publishedDate,
    thumbnail: post.thumbnailUrl || `https://picsum.photos/seed/ifwyd-news-${post.id}/160/160`,
  };
}

function projectToContentItem(project: Project): ContentItem {
  return {
    id: `project-${project.id}`,
    sourceId: project.id,
    type: "Projects",
    title: project.title,
    category: project.focusArea,
    status: project.status,
    date: project.updatedDate,
    thumbnail: project.thumbnailUrl || `https://picsum.photos/seed/ifwyd-project-${project.id}/160/160`,
  };
}

export function getMockContentItems(): ContentItem[] {
  return [...mockNews.map(newsToContentItem), ...mockProjects.map(projectToContentItem)].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getContentStats(items: ContentItem[]): ContentStat[] {
  const published = items.filter((item) => item.status === "Published").length;
  const projects = items.filter((item) => item.type === "Projects").length;
  const posts = items.filter((item) => item.type === "News").length;
  const drafts = items.filter((item) => item.status === "Draft").length;

  return [
    { key: "published", label: "Published & Live", value: published, highlight: true },
    { key: "projects", label: "Projects", value: projects },
    { key: "posts", label: "New Posts", value: posts },
    { key: "drafts", label: "Drafts & Scheduled", value: drafts },
  ];
}
