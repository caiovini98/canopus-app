import { Anotation } from "./anotation";

export type Task = {
  anotations: Anotation[];
  category: string;
  dateLimit: string;
  description: string;
  id: string;
  priority: string;
  situation: string;
};
