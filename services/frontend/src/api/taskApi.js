import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProjects = async () => {
  const response = await api.get("/api/projects/");
  return response.data;
};

export const createProject = async (data) => {
  const response = await api.post("/api/projects/", data);
  return response.data;
};

export const getProjectTasks = async (projectId) => {
  const response = await api.get(`/api/projects/${projectId}/tasks`);
  return response.data;
};

export const getTasks = async () => {
  const response = await api.get("/api/tasks/");
  return response.data;
};

export const createTask = async (data) => {
  const response = await api.post("/api/tasks/", data);
  return response.data;
};

export const updateTask = async (id, data) => {
  const response = await api.put(`/api/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
};
