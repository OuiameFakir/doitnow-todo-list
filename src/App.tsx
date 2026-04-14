// App.tsx
import React from "react";
import { TaskProvider, useTaskContext } from "./hooks/TaskContext";
import TodoList from "./components/TodoList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dark-mode.css";
import { Routes, Route } from "react-router-dom";
import Todos from "./TRY/apiTodos";
import Dashboard from "./components/Dashboard";
import Kanban from "./components/Kanban";

const AppInner: React.FC = () => {
  const { darkMode } = useTaskContext();
  return (
    <div className={darkMode ? "dark-mode" : ""} style={{ minHeight: "100vh" }}>
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/api-todos" element={<Todos />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TaskProvider>
      <AppInner />
    </TaskProvider>
  );
};

export default App;
