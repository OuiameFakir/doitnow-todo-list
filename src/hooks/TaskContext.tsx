// TaskContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ITask, KanbanStatus } from "../types/Type";

interface TaskContextProps {
  children: ReactNode;
}

interface TaskContextValue {
  tasks: ITask[];
  task: ITask;
  filtredTasks: ITask[];
  darkMode: boolean;
  addTask: (task: ITask) => void;
  updateTask: (taskId: string, updatedTask: ITask) => void;
  deleteTask: (idCard: string) => void;
  filterTasks: (priority: string) => void;
  reorderTasks: (newOrder: ITask[]) => void;
  toggleDone: (taskId: string) => void;
  toggleDarkMode: () => void;
  moveKanban: (taskId: string, status: KanbanStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
}

const STORAGE_KEY = "doitnow_tasks";
const DARK_KEY = "doitnow_dark";

const loadTasks = (): ITask[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const TaskProvider: React.FC<TaskContextProps> = ({ children }) => {
  const [tasks, setTasks] = useState<ITask[]>(loadTasks);
  const [filtredTasks, setFiltredTasks] = useState<ITask[]>(loadTasks);
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem(DARK_KEY) === "true");
  const [task] = useState<ITask>({ id: "", name: "", description: "", priority: "" });

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem(DARK_KEY, String(darkMode));
  }, [darkMode]);

  const addTask = (newTask: ITask) => {
    const updated = [...tasks, newTask];
    setTasks(updated);
    setFiltredTasks(updated);
  };

  const updateTask = (taskId: string, updatedTask: ITask) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
    setTasks(updatedTasks);
    setFiltredTasks(updatedTasks);
  };

  const deleteTask = (idCard: string) => {
    const newList = tasks.filter((t) => t.id !== idCard);
    setTasks(newList);
    setFiltredTasks(newList);
  };

  const filterTasks = (priority: string) => {
    if (priority !== "All") {
      setFiltredTasks(tasks.filter((t) => t.priority === priority));
    } else {
      setFiltredTasks(tasks);
    }
  };

  const reorderTasks = (newOrder: ITask[]) => {
    setTasks(newOrder);
    setFiltredTasks(newOrder);
  };

  const toggleDone = (taskId: string) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
    setTasks(updated);
    setFiltredTasks(updated);
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const moveKanban = (taskId: string, status: KanbanStatus) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, kanbanStatus: status } : t);
    setTasks(updated);
    setFiltredTasks(updated);
  };

  const addSubtask = (taskId: string, title: string) => {
    const updated = tasks.map(t => t.id === taskId
      ? { ...t, subtasks: [...(t.subtasks ?? []), { id: Date.now().toString(), title, done: false }] }
      : t);
    setTasks(updated);
    setFiltredTasks(updated);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map(t => t.id === taskId
      ? { ...t, subtasks: (t.subtasks ?? []).map(s => s.id === subtaskId ? { ...s, done: !s.done } : s) }
      : t);
    setTasks(updated);
    setFiltredTasks(updated);
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map(t => t.id === taskId
      ? { ...t, subtasks: (t.subtasks ?? []).filter(s => s.id !== subtaskId) }
      : t);
    setTasks(updated);
    setFiltredTasks(updated);
  };

  const contextValue: TaskContextValue = {
    tasks,
    task,
    filtredTasks,
    darkMode,
    addTask,
    updateTask,
    deleteTask,
    filterTasks,
    reorderTasks,
    toggleDone,
    toggleDarkMode,
    moveKanban,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

const useTaskContext = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export { TaskProvider, useTaskContext };
