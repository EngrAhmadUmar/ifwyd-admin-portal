export type MessageStatus = "Unread" | "Read" | "Replied";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedDate: string;
  status: MessageStatus;
};

export const CONTACT_PER_PAGE = 10;

export const mockContactMessages: ContactMessage[] = [
  { id: "1", name: "Samuel Okorie", email: "samuel.o@example.com", message: "Hi, I'd like to know how my organization can partner with IFWYD on the education program.", submittedDate: "Aug 9, 2026", status: "Unread" },
  { id: "2", name: "Zainab Umar", email: "zainab.u@example.com", message: "Is the skill acquisition program open to applicants outside Bauchi state?", submittedDate: "Aug 8, 2026", status: "Unread" },
  { id: "3", name: "Chuka Eze", email: "chuka.eze@example.com", message: "Loved the recent food drive coverage — how can I donate supplies directly?", submittedDate: "Aug 4, 2026", status: "Read" },
  { id: "4", name: "Mercy Johnson", email: "mercy.j@example.com", message: "Thank you for responding so quickly to my volunteer inquiry last week!", submittedDate: "Jul 29, 2026", status: "Replied" },
];
