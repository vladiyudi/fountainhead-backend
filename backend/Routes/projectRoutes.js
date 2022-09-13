const express = require("express");
const router = express.Router();
const projectController = require("../Controllers/ProjectController");
const { auth } = require("../Middleware/userMiddleware");

const {
  addComment,
  getComments,
  voteForProject,
  getProjectVotes,
  sortByVotes,
  getProjectsByUserId
} = require("../Controllers/ProjectController");

router
  .get("/", projectController.getAllProjects)
  .post("/", auth, projectController.createNewProject)
  .delete("/", projectController.deleteProject);

router.get("/one/:id", projectController.getProjectById);

router.post("/addComment/:projectId", auth, addComment);

router.get("/getComments/:projectId", auth, getComments);

router.post("/vote/:projectId", auth, voteForProject);

router.get("/vote/:projectId", auth, getProjectVotes);

router.get("/sort", auth, sortByVotes);

router.get('/userProjects', auth, getProjectsByUserId)

module.exports = router;
