import React from "react";
import { useTaskContext } from "../hooks/TaskContext";
import NavBar from "./MyNavbar";
import { KanbanStatus, ITask } from "../types/Type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faCalendar } from "@fortawesome/free-solid-svg-icons";

const COLUMNS: { key: KanbanStatus; label: string; color: string; bg: string }[] = [
  { key: "todo",       label: "To Do",       color: "text-secondary", bg: "#f8f9fa" },
  { key: "inprogress", label: "In Progress",  color: "text-warning",   bg: "#fff8e1" },
  { key: "done",       label: "Done",         color: "text-success",   bg: "#f0fff4" },
];

const PRIORITY_COLOR: Record<string, string> = {
  High: "#dc3545",
  Medium: "#ffc107",
  Low: "#198754",
};

const KanbanCard: React.FC<{ task: ITask }> = ({ task }) => {
  const { moveKanban } = useTaskContext();
  const cols = COLUMNS.map(c => c.key);
  const currentIdx = cols.indexOf(task.kanbanStatus ?? "todo");

  return (
    <div className="card mb-2 shadow-sm" style={{ borderLeft: `4px solid ${PRIORITY_COLOR[task.priority] ?? "#6c757d"}` }}>
      <div className="card-body py-2 px-3">
        <div className="fw-semibold small mb-1" style={{ textDecoration: task.done ? "line-through" : "none" }}>
          {task.name}
        </div>
        <div className="text-muted" style={{ fontSize: "0.75rem" }}>{task.description}</div>
        {task.dueDate && (
          <div className="mt-1" style={{ fontSize: "0.7rem", color: "#888" }}>
            <FontAwesomeIcon icon={faCalendar} className="me-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-1" style={{ fontSize: "0.7rem", color: "#888" }}>
            {task.subtasks.filter(s => s.done).length}/{task.subtasks.length} subtasks
          </div>
        )}
        <div className="d-flex gap-1 mt-2">
          {currentIdx > 0 && (
            <button
              className="btn btn-outline-secondary btn-sm py-0 px-1"
              style={{ fontSize: "0.7rem" }}
              onClick={() => moveKanban(task.id, cols[currentIdx - 1])}
              title={`Move to ${COLUMNS[currentIdx - 1].label}`}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> {COLUMNS[currentIdx - 1].label}
            </button>
          )}
          {currentIdx < cols.length - 1 && (
            <button
              className="btn btn-outline-primary btn-sm py-0 px-1"
              style={{ fontSize: "0.7rem" }}
              onClick={() => moveKanban(task.id, cols[currentIdx + 1])}
              title={`Move to ${COLUMNS[currentIdx + 1].label}`}
            >
              {COLUMNS[currentIdx + 1].label} <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Kanban: React.FC = () => {
  const { tasks } = useTaskContext();

  const getColumnTasks = (status: KanbanStatus) =>
    tasks.filter(t => (t.kanbanStatus ?? "todo") === status);

  return (
    <>
      <NavBar />
      <div className="container-fluid py-4 px-4">
        <h4 className="fw-bold mb-4">Kanban Board</h4>
        {tasks.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p>No tasks yet — create some from the home page to see them here.</p>
          </div>
        ) : (
          <div className="row g-3">
            {COLUMNS.map(col => {
              const colTasks = getColumnTasks(col.key);
              return (
                <div className="col-12 col-md-4" key={col.key}>
                  <div
                    className="rounded p-3 h-100"
                    style={{ background: col.bg, minHeight: "60vh", border: "1px solid #e0e0e0" }}
                  >
                    <div className={`fw-bold mb-3 d-flex justify-content-between align-items-center ${col.color}`}>
                      <span>{col.label}</span>
                      <span className="badge bg-secondary">{colTasks.length}</span>
                    </div>
                    {colTasks.length === 0 ? (
                      <div className="text-muted text-center small mt-4 opacity-50">No tasks here</div>
                    ) : (
                      colTasks.map(task => <KanbanCard key={task.id} task={task} />)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Kanban;
