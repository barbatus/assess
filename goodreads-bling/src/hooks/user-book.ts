export type UserBookInput = {
  title: string;
  author: string;
  date: Date;
  cover: string | null;
  status: "READ" | "READING" | "TO_READ";
};
