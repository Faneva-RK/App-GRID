const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
  getProjects,
  createProject,
  getProjectTasks,
} = require("../controllers/project.controller");

const router = express.Router();

router.use(verifyToken);
router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id/tasks", getProjectTasks);

module.exports = router;

