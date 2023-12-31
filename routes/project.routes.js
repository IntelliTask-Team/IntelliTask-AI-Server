const mongoose = require("mongoose");
const router = require("express").Router();

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");

// ***** POST /api/projects  - TO CREATE NEW PROJECT IN DATABASE *****
router.post("/projects", (req, res, next) => {
  const { title, description } = req.body;

  const newProject = {
    title,
    description,
    user: req.payload._id,
  };

  Project.create(newProject)
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error creating a new project...", err);
      res.status(500).json({
        message: "Error creating a new project",
        error: err,
      });
    });
});

// ***** GET /api/projects - TO DISPLAY ALL PROJECTS - RETRIEVE ALL PROJECTS FROM DATABASE *****
router.get("/projects", (req, res, next) => {
    Project.find({ user: req.payload._id })
        .populate({
            path: 'tasks',
            options: { sort: { 'order': 1 } } 
        })
        .then((allProjects) => res.json(allProjects))
        .catch((err) => {
            console.log("Error getting all projects...", err);
            res.status(500).json({
                message: "Error getting all projects",
                error: err,
            });
        });
});

// ***** GET /api/projects/:projectId  - TO DISPLAY DETAILS OF A PROJECT - RETRIEVE PROJECT FROM DATABASE BY ID *****
router.get("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "ID is not valid" });
      return;
  }

  Project.findById(projectId)
      .populate({
          path: 'tasks',
          options: { sort: { 'order': 1 } } 
      })
      .then((project) => res.json(project))
      .catch((err) => {
          console.log("An error occurred", err);
          res.status(500).json({
              message: "Error getting project details",
              error: err,
          });
      });
});

// ***** PUT /api/projects/:projectId  - TO UPDATE A PROJECT BY ID *****
router.put("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "ID is not valid" });
    return;
  }

  const newDetails = {
    title: req.body.title,
    description: req.body.description,
  };

  Project.findByIdAndUpdate(projectId, newDetails, { new: true })
    .then((updatedProject) => res.json(updatedProject))
    .catch((err) => {
      res.status(500).json({
        message: "Error updating project",
        error: err,
      });
    });
});

// ***** DELETE /api/projects/:projectId  - TO DELETE PROJECT BY ID *****
router.delete("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "ID is not valid" });
    return;
  }


  Task.deleteMany({ project: projectId }) // deleting all the tasks attached to the project
    .then(() => {
      return Project.findByIdAndRemove(projectId); // deleting the actual project
    })
    .then(() => {
      res.json({
        message: `Project with ${projectId} and its tasks are removed successfully.`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error deleting project",
        error: err,
      });
    });
});

module.exports = router;
