import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, getProjects } from "../api/taskApi";

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createProject(form);
      setForm({ name: "", description: "" });
      setFormVisible(false);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={{ margin: 0 }}>Dashboard</h1>
            <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
              Welcome{user ? `, ${user.name}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormVisible((value) => !value)}
            style={styles.primaryButton}
          >
            {formVisible ? "Close" : "Create Project"}
          </button>
        </div>

        {formVisible ? (
          <form onSubmit={handleCreateProject} style={styles.form}>
            <input
              type="text"
              placeholder="Project name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            <button type="submit" style={styles.primaryButton}>
              Save Project
            </button>
          </form>
        ) : null}

        {error ? <div style={styles.error}>{error}</div> : null}
        {loading ? <div>Loading projects...</div> : null}

        <div style={styles.grid}>
          {projects.map((project) => (
            <button
              key={project._id}
              type="button"
              onClick={() => navigate(`/projects/${project._id}`)}
              style={styles.projectCard}
            >
              <div style={{ fontWeight: 700, fontSize: 16 }}>{project.name}</div>
              <div style={{ color: "#6b7280", marginTop: 8 }}>
                {project.description || "No description"}
              </div>
            </button>
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
    maxWidth: 1100,
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
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px 12px",
    borderRadius: 8,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  projectCard: {
    textAlign: "left",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    cursor: "pointer",
    minHeight: 120,
  },
};
