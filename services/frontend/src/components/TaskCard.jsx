import React from "react";
export default function TaskCard({ task, currentUser, onStatusChange, onDelete }) {
  const assignedLabel = (() => {
    if (!task.assignedTo) return "Unassigned";
    if (typeof task.assignedTo === "object" && task.assignedTo.name) return task.assignedTo.name;
    if (currentUser && task.assignedTo === currentUser.id) return currentUser.name;
    return String(task.assignedTo);
  })();

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: 16,
        display: "grid",
        gap: 10,
      }}
    >
      <div>
        <div style={{ fontWeight: 700 }}>{task.title}</div>
        <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
          {task.description || "No description"}
        </div>
      </div>
      <div style={{ fontSize: 14 }}>
        <strong>Priority:</strong> {task.priority}
      </div>
      <div style={{ fontSize: 14 }}>
        <strong>Assigned To:</strong> {assignedLabel}
      </div>
      {task.deadline ? (
        <div style={{ fontSize: 14 }}>
          <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}
        >
          <option value="todo">todo</option>
          <option value="in-progress">in-progress</option>
          <option value="done">done</option>
        </select>
        {onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(task._id)}
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              border: "none",
              borderRadius: 6,
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}
