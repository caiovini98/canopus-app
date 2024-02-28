import { Category } from "./category";
import { Task } from "./task";

export type User = {
  category: Category[];
  email: string;
  isAdm: boolean;
  name: string;
  task: Task[];
  uid: string;
};
