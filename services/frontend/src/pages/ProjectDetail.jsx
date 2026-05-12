import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { createTask, deleteTask, getProjectTasks, getProjects, updateTask } from "../api/taskApi";
import TaskCard from "../components/TaskCard";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  assignedTo: "",
  deadline: "",
};

export default function ProjectDetail({ user }) {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsResponse, tasksResponse] = await Promise.all([
        getProjects(),
        getProjectTasks(id),
      ]);

      const foundProject = (projectsResponse.projects || []).find((item) => item._id === id);
      setProject(foundProject || tasksResponse.project || null);
      setTasks(tasksResponse.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (user?.id) {
      setForm((current) => ({
        ...current,
        assignedTo: current.assignedTo || user.id,
      }));
    }
  }, [user]);

  const groupedTasks = useMemo(() => {
    return {
      todo: tasks.filter((task) => task.status === "todo"),
      "in-progress": tasks.filter((task) => task.status === "in-progress"),
      done: tasks.filter((task) => task.status === "done"),
    };
  }, [tasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createTask({
        ...form,
        project: id,
        assignedTo: form.assignedTo || user?.id || null,
      });
      setForm({
        ...emptyForm,
        assignedTo: user?.id || "",
      });
      setFormVisible(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={{ margin: 0 }}>{project?.name || "Project"}</h1>
            <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
              {project?.description || "No description"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormVisible((value) => !value)}
            style={styles.primaryButton}
          >
            {formVisible ? "Close" : "Create Task"}
          </button>
        </div>

        {formVisible ? (
          <form onSubmit={handleCreateTask} style={styles.form}>
            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={styles.input}
            />
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              style={styles.input}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <input
              type="text"
              placeholder="Assigned user ID"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              style={styles.input}
            />
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              style={styles.input}
            />
            <button type="submit" style={styles.primaryButton}>
              Save Task
            </button>
          </form>
        ) : null}

        {error ? <div style={styles.error}>{error}</div> : null}
        {loading ? <div>Loading tasks...</div> : null}

        <div style={styles.columns}>
          {["todo", "in-progress", "done"].map((status) => (
            <div key={status} style={styles.column}>
              <h2 style={styles.columnTitle}>{status}</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {groupedTasks[status].map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    currentUser={user}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    padding: 24,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gap: 20,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  primaryButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 14px",
    cursor: "pointer",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    minWidth: 0,
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px 12px",
    borderRadius: 8,
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
    alignItems: "start",
  },
  column: {
    background: "#eef2ff",
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
  },
  columnTitle: {
    marginTop: 0,
    textTransform: "capitalize",
  },
};
