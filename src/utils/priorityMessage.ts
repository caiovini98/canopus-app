import { Priority } from "../enum/priorityEnum";

export function priorityMessage(priority: number): string {
  if (priority === Priority.MUITO_BAIXO) {
    return "Muito baixo";
  }

  if (priority === Priority.BAIXO) {
    return "baixo";
  }

  if (priority === Priority.MEDIO) {
    return "Médio";
  }

  if (priority === Priority.ALTO) {
    return "Alto";
  }

  if (priority === Priority.MUITO_ALTO) {
    return "Muito alto";
  }

  return "Sem informação";
}
