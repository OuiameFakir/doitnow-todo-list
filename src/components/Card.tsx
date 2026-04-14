import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCalendar, faChevronDown, faChevronUp, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ITask } from "../types/Type";
import DeleteTask from "./DeleteTask";
import CardHandle from "./CardHandle";
import { useTaskContext } from "../hooks/TaskContext";

interface CardNoteProps {
  taskObj: ITask;
}

const CardNote: React.FC<CardNoteProps> = ({ taskObj }) => {
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [showSubtasks, setShowSubtasks] = useState<boolean>(false);
  const [newSubtask, setNewSubtask] = useState<string>("");
  const { toggleDone, addSubtask, toggleSubtask, deleteSubtask } = useTaskContext();

  const done = taskObj.done ?? false;
  const subtasks = taskObj.subtasks ?? [];

  const col = (): string => {
    if (taskObj.priority === "High") return "bg-danger";
    if (taskObj.priority === "Medium") return "bg-warning";
    return "bg-success";
  };

  const handleAddSubtask = () => {
    const trimmed = newSubtask.trim();
    if (trimmed.length < 1) return;
    addSubtask(taskObj.id, trimmed);
    setNewSubtask("");
  };

  return (
    <Card className="bg-light w-100" style={{ opacity: done ? 0.75 : 1 }}>
      <CardHeader className={col()}>
        <CardTitle tag="h6" className="text-white mb-0" style={{ textDecoration: done ? "line-through" : "none" }}>
          {taskObj.name}
        </CardTitle>
      </CardHeader>

      <CardBody className="pb-1">
        <CardText className="small">{taskObj.description}</CardText>

        {/* Due date */}
        {taskObj.dueDate && (() => {
          const isOverdue = !done && new Date(taskObj.dueDate) < new Date(new Date().toDateString());
          return (
            <small className={isOverdue ? "text-danger fw-semibold" : "text-muted"}>
              <FontAwesomeIcon icon={faCalendar} className="me-1" />
              {isOverdue ? "Overdue: " : "Due: "}
              {new Date(taskObj.dueDate).toLocaleDateString()}
            </small>
          );
        })()}

        {/* Subtasks toggle */}
        <div
          className="d-flex align-items-center justify-content-between mt-2 small text-muted"
          style={{ cursor: "pointer" }}
          onClick={() => setShowSubtasks(p => !p)}
        >
          <span>
            Subtasks{" "}
            {subtasks.length > 0 && (
              <span className="badge bg-secondary ms-1">{subtasks.filter(s => s.done).length}/{subtasks.length}</span>
            )}
          </span>
          <FontAwesomeIcon icon={showSubtasks ? faChevronUp : faChevronDown} />
        </div>

        {/* Subtask list */}
        {showSubtasks && (
          <div className="mt-2">
            {subtasks.map(s => (
              <div key={s.id} className="d-flex align-items-center gap-1 mb-1">
                <input
                  type="checkbox"
                  checked={s.done}
                  onChange={() => toggleSubtask(taskObj.id, s.id)}
                  className="flex-shrink-0"
                />
                <span className="small flex-grow-1" style={{ textDecoration: s.done ? "line-through" : "none", color: s.done ? "#888" : undefined }}>
                  {s.title}
                </span>
                <button
                  className="btn btn-link btn-sm p-0 text-danger"
                  onClick={() => deleteSubtask(taskObj.id, s.id)}
                  style={{ lineHeight: 1 }}
                >
                  <FontAwesomeIcon icon={faTimes} size="xs" />
                </button>
              </div>
            ))}

            {/* Add subtask input */}
            <div className="d-flex gap-1 mt-1">
              <input
                className="form-control form-control-sm"
                placeholder="Add subtask…"
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddSubtask()}
              />
              <button
                className="btn btn-sm btn-outline-primary px-2"
                onClick={handleAddSubtask}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        )}
      </CardBody>

      <CardFooter>
        <div className="d-flex justify-content-between align-items-center">
          <div onClick={() => setEditModal(true)} style={{ cursor: "pointer" }} className="small">
            <FontAwesomeIcon icon={faEdit} /> Edit
          </div>
          <div onClick={() => setDeleteModal(true)} style={{ cursor: "pointer" }} className="small">
            <FontAwesomeIcon icon={faTrash} /> Delete
          </div>
          <label className="d-flex align-items-center gap-1 mb-0 small" style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={done}
              onChange={() => toggleDone(taskObj.id)}
            />
            <span className="fst-italic">{done ? "Done" : "To Do"}</span>
          </label>
        </div>

        <CardHandle
          isModal={editModal}
          handleToggle={() => setEditModal(false)}
          taskObj={taskObj}
          isCreated={false}
          isEdited={true}
        />
        <DeleteTask
          modal={deleteModal}
          toggle={() => setDeleteModal(false)}
          task={taskObj}
        />
      </CardFooter>
    </Card>
  );
};

export default CardNote;
