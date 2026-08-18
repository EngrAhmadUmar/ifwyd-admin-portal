export type ClassroomStatus = "Active" | "Draft" | "Closed";

export type Classroom = {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  status: ClassroomStatus;
};

export const CLASSROOMS_PER_PAGE = 10;

export const CLASSROOM_STATUSES: ClassroomStatus[] = ["Active", "Draft", "Closed"];

/** Adds a classroom to the in-memory mock list (dev-only, no backend yet). */
export function createMockClassroom(input: {
  name: string;
  subject: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  status: ClassroomStatus;
}): Classroom {
  const classroom: Classroom = { id: `local-${Date.now()}`, ...input };
  mockClassrooms.unshift(classroom);
  return classroom;
}

export function getMockClassroom(id: string): Classroom | null {
  return mockClassrooms.find((classroom) => classroom.id === id) ?? null;
}

export function updateMockClassroom(id: string, patch: Partial<Omit<Classroom, "id">>): Classroom | null {
  const classroom = getMockClassroom(id);
  if (!classroom) return null;
  Object.assign(classroom, patch);
  return classroom;
}

export const mockClassrooms: Classroom[] = [
  { id: "1", name: "Digital Literacy Basics", subject: "Computing", schedule: "Mon & Wed, 10am", capacity: 30, enrolled: 27, status: "Active" },
  { id: "2", name: "Tailoring & Fashion Design", subject: "Vocational", schedule: "Tue & Thu, 2pm", capacity: 25, enrolled: 25, status: "Active" },
  { id: "3", name: "Catering & Hospitality", subject: "Vocational", schedule: "Sat, 9am", capacity: 20, enrolled: 14, status: "Active" },
  { id: "4", name: "Financial Literacy for Youth", subject: "Life Skills", schedule: "Fri, 11am", capacity: 40, enrolled: 12, status: "Draft" },
  { id: "5", name: "English Bridge Class", subject: "Literacy", schedule: "Mon–Fri, 8am", capacity: 35, enrolled: 0, status: "Closed" },
];
