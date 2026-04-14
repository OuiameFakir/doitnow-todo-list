import React from "react";
import { UseFormReturn, useForm, SubmitHandler, useWatch } from "react-hook-form";
import Schema from "../formValidation/Schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ITask } from "../types/Type";
import { FC } from "react";
import { useTaskContext } from "../hooks/TaskContext";
import { v4 as uuidv4 } from "uuid";

interface ICardHandleProps {
  isModal: boolean;
  handleToggle: () => void;
  taskObj: ITask;
  isCreated: boolean;
  isEdited: boolean;
}

interface IMyFormValues {
  name: string;
  description: string;
  priority: string;
  dueDate?: string;
}

const PRIORITIES = [
  { value: "High",   label: "High",   color: "#dc3545", bg: "#fff0f0", border: "#dc3545" },
  { value: "Medium", label: "Medium", color: "#856404", bg: "#fff8e1", border: "#ffc107" },
  { value: "Low",    label: "Low",    color: "#155724", bg: "#f0fff4", border: "#198754" },
];

const CardHandle: FC<ICardHandleProps> = ({
  isModal,
  handleToggle,
  taskObj,
  isCreated,
  isEdited,
}) => {
  const { updateTask, addTask, darkMode } = useTaskContext();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  }: UseFormReturn<IMyFormValues> = useForm<IMyFormValues>({
    resolver: yupResolver(Schema),
    defaultValues: {
      name: taskObj.name,
      description: taskObj.description,
      priority: taskObj.priority,
      dueDate: taskObj.dueDate ?? "",
    },
  });

  const watchedPriority = useWatch({ control, name: "priority" });
  const watchedDesc = useWatch({ control, name: "description" }) ?? "";

  const onSubmit: SubmitHandler<IMyFormValues> = (data) => {
    if (isCreated) {
      addTask({
        id: uuidv4(),
        name: data.name,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate || undefined,
        done: false,
        kanbanStatus: "todo",
        subtasks: [],
      });
      reset();
    } else if (isEdited) {
      updateTask(taskObj.id, {
        ...taskObj,              // preserve done, kanbanStatus, subtasks
        name: data.name,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate || undefined,
      });
    }
    handleToggle();
  };

  const handleCancel = () => {
    if (isCreated) reset();
    handleToggle();
  };

  if (!isModal) return null;

  const bg    = darkMode ? "#1e2a3a" : "#ffffff";
  const text  = darkMode ? "#e0e0e0" : "#1a1a2a";
  const muted = darkMode ? "#8899aa" : "#6c757d";
  const inputBg = darkMode ? "#162030" : "#f8f9fa";
  const borderCol = darkMode ? "#2a4060" : "#dee2e6";

  const inputClass = (hasError: boolean) => ({
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: `1.5px solid ${hasError ? "#dc3545" : borderCol}`,
    background: hasError ? (darkMode ? "#2a1a1e" : "#fff5f5") : inputBg,
    color: text,
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box" as const,
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 4,
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: muted,
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1050,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(3px)",
        animation: "fadeIn 0.15s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .modal-input:focus { border-color: #e74c3c !important; box-shadow: 0 0 0 3px rgba(231,76,60,0.15); }
      `}</style>

      <div
        style={{
          background: bg,
          borderRadius: 16,
          width: "100%",
          maxWidth: 480,
          margin: "0 16px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          animation: "slideUp 0.2s ease",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${borderCol}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: isCreated ? "rgba(231,76,60,0.12)" : "rgba(52,152,219,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem",
            }}>
              {isCreated ? "✚" : "✎"}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: text }}>
                {isCreated ? "Create New Task" : "Edit Task"}
              </div>
              <div style={{ fontSize: "0.75rem", color: muted }}>
                {isCreated ? "Add a task to your board" : `Editing "${taskObj.name}"`}
              </div>
            </div>
          </div>
          <button
            onClick={handleCancel}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "1.2rem", color: muted, lineHeight: 1, padding: "4px 8px",
              borderRadius: 6,
            }}
          >×</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Task Name */}
            <div>
              <label style={labelStyle}>
                Task Name <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input
                {...register("name")}
                className="modal-input"
                style={inputClass(!!errors.name)}
                type="text"
                placeholder="e.g. Design homepage mockup"
                autoFocus
              />
              {errors.name && (
                <div style={{ color: "#dc3545", fontSize: "0.78rem", marginTop: 4 }}>
                  ⚠ {errors.name.message}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label style={{ ...labelStyle, display: "flex", justifyContent: "space-between" }}>
                <span>Description <span style={{ color: "#e74c3c" }}>*</span></span>
                <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                  {watchedDesc.length}/200
                </span>
              </label>
              <textarea
                {...register("description")}
                className="modal-input"
                style={{ ...inputClass(!!errors.description), resize: "vertical", fontFamily: "inherit" }}
                rows={3}
                placeholder="Describe what needs to be done…"
                maxLength={200}
              />
              {errors.description && (
                <div style={{ color: "#dc3545", fontSize: "0.78rem", marginTop: 4 }}>
                  ⚠ {errors.description.message}
                </div>
              )}
            </div>

            {/* Priority — visual button group */}
            <div>
              <label style={labelStyle}>
                Priority <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {PRIORITIES.map(p => {
                  const selected = watchedPriority === p.value;
                  return (
                    <button
                      type="button"
                      key={p.value}
                      onClick={() => setValue("priority", p.value, { shouldValidate: true })}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 8,
                        border: `2px solid ${selected ? p.border : borderCol}`,
                        background: selected ? p.bg : (darkMode ? "#162030" : "#f8f9fa"),
                        color: selected ? p.color : muted,
                        fontWeight: selected ? 700 : 500,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        boxShadow: selected ? `0 2px 8px ${p.border}33` : "none",
                      }}
                    >
                      {p.value === "High" ? "🔴" : p.value === "Medium" ? "🟡" : "🟢"} {p.label}
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register("priority")} />
              {errors.priority && (
                <div style={{ color: "#dc3545", fontSize: "0.78rem", marginTop: 4 }}>
                  ⚠ {errors.priority.message}
                </div>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label style={labelStyle}>
                Due Date{" "}
                <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: muted }}>
                  (optional)
                </span>
              </label>
              <input
                id="dueDate"
                {...register("dueDate")}
                className="modal-input"
                style={inputClass(false)}
                type="date"
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: "16px 24px",
            borderTop: `1px solid ${borderCol}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "9px 20px",
                borderRadius: 8,
                border: `1.5px solid ${borderCol}`,
                background: "none",
                color: muted,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "9px 24px",
                borderRadius: 8,
                border: "none",
                background: isCreated ? "#e74c3c" : "#3498db",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.875rem",
                boxShadow: isCreated ? "0 4px 12px rgba(231,76,60,0.3)" : "0 4px 12px rgba(52,152,219,0.3)",
              }}
            >
              {isCreated ? "✚ Create Task" : "✔ Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardHandle;
