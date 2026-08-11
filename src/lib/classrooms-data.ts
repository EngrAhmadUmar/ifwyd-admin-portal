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

export const mockClassrooms: Classroom[] = [
  { id: "1", name: "Digital Literacy Basics", subject: "Computing", schedule: "Mon & Wed, 10am", capacity: 30, enrolled: 27, status: "Active" },
  { id: "2", name: "Tailoring & Fashion Design", subject: "Vocational", schedule: "Tue & Thu, 2pm", capacity: 25, enrolled: 25, status: "Active" },
  { id: "3", name: "Catering & Hospitality", subject: "Vocational", schedule: "Sat, 9am", capacity: 20, enrolled: 14, status: "Active" },
  { id: "4", name: "Financial Literacy for Youth", subject: "Life Skills", schedule: "Fri, 11am", capacity: 40, enrolled: 12, status: "Draft" },
  { id: "5", name: "English Bridge Class", subject: "Literacy", schedule: "Mon–Fri, 8am", capacity: 35, enrolled: 0, status: "Closed" },
];
