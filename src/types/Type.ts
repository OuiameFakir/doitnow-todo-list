export type KanbanStatus = "todo" | "inprogress" | "done";

export interface ISubtask {
  id: string;
  title: string;
  done: boolean;
}

export interface ITask {
    id: string;
    name: string;
    description: string;
    priority: string;
    dueDate?: string;
    done?: boolean;
    kanbanStatus?: KanbanStatus;
    subtasks?: ISubtask[];
  }
  export interface ITodos{
    userId: number,
    id: number,
    title: string,
    completed: boolean,
  }