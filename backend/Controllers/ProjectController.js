const knex = require("../knex");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/AppError");
const multer = require("multer");
const {
  addStudentVote,
  addClientVote,
  getAvgClientCreativity,
  getAvgClientBestPractices,
  getAvgClientDesign,
  getAvgClientBugs,
  getAvgStudentCreativity,
  getAvgStudentBestPractices,
  getAvgStudentDesign,
  getAvgStudentBugs,
} = require("../Models/projectModel");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/projectImg");
  },
  filename: (req, file, cb) => {
    //    user-76567avb-21123123.jpeg
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not An Image! Please Upload only images", 404), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProjectPicture = upload.single("picture");

exports.getAllProjects = catchAsync(async (req, res, next) => {
  knex("projects").then((rows) => {
    res.status(200).json({
      status: "Success",
      results: rows.length,
      data: rows,
    });
  });
});

exports.getProjectsByType = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if (
    req.body.type === "BE" ||
    req.body.type === "FE" ||
    req.body.type === "FS"
  ) {
    knex("projects")
      .where({ type: req.body.type })
      .then((rows) => {
        res.status(200).json({
          status: "Success",
          results: rows.length,
          data: rows,
        });
      });
  }
});

exports.getProjectByName = catchAsync(async (req, res, next) => {
  if (req.body.name) {
    const data = await knex("projects").whereILike(
      "name",
      `%${req.body.name}%`
    );
    console.log(data);

    res.status(200).json({
      status: "Success",
      data: data,
    });
  } else {
    res.send("No Projects Found");
  }
});

exports.getProjectById = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  knex("projects")
    .where({ projectId: id })
    .first()
    .then((project) => {
      if (!project) {
        return next(new AppError("No Project Found With That ID", 404));
      }
      res.status(200).json({
        status: "Success",
        data: project,
      });
    });
});

exports.createNewProject = catchAsync(async (req, res, next) => {
  const { type, name, info, iframe, userid } = req.body;

  knex
    .insert({
      userId: userid,
      type,
      name,
      info,
      iframe,
    })
    .into("projects")

    .then((data) => {
      addStudentVote(data, {
        creativity: 0,
        bestPractices: 0,
        design: 0,
        bugs: 0,
      });
      addClientVote(data, {
        creativity: 0,
        bestPractices: 0,
        design: 0,
        bugs: 0,
      });
      res.status(200).json(data);
    })

    .catch((err) => {
      console.log(err);
      return new AppError("Could not create Project", 404);
    });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const id = req.body.projectId;
  knex("projects")
    .where("projectId", id)
    .del()
    .then((data) => {
      if (!data) {
        return next(new AppError("No Project Found With That ID", 404));
      }
      res.status(204).json({
        status: "success",
        message: "Project Successfully Deleted",
        data: null,
      });
    });
});

exports.addComment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { comment, code, userid } = req.body;
    const newComment = await knex("comments").insert({
      comment,
      code,
      userId: userid,
      projectId: projectId,
    });
    res.status(200).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not add comment" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const comments = await knex("comments").where({ projectId: projectId });
    res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not get comments" });
  }
};

exports.voteForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userid } = req.body;
    let newRating;
    const user = await knex("users").where({ id: userid });
    if (user[0].role === "student")
      newRating = await addStudentVote(projectId, req.body);
    else newRating = await addClientVote(projectId, req.body);
    if (newRating) res.status(200).json('Vote Added');
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not vote" });
  }
};

exports.getProjectVotes = async (req, res) => {
  try {
    const { projectId } = req.params;
    const clientCreativity = await getAvgClientCreativity(projectId);
    const clientBestPractices = await getAvgClientBestPractices(projectId);
    const clientDesign = await getAvgClientDesign(projectId);
    const clientBugs = await getAvgClientBugs(projectId);

    const clientVotes = {
      Creativity: Math.round(clientCreativity),
      BestPractices: Math.round(clientBestPractices),
      Design: Math.round(clientDesign),
      Bugs: Math.round(clientBugs),
    };

    const studentCreativity = await getAvgStudentCreativity(projectId);
    const studentBestPractices = await getAvgStudentBestPractices(projectId);
    const studentDesign = await getAvgStudentDesign(projectId);
    const studentBugs = await getAvgStudentBugs(projectId);

    const studentVotes = {
      Creativity: Math.round(studentCreativity),
      BestPractices: Math.round(studentBestPractices),
      Design: Math.round(studentDesign),
      Bugs: Math.round(studentBugs),
    };

    res.status(200).json({ studentVotes, clientVotes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not get votes" });
  }
};

exports.sortByVotes = async (req, res) => {
  try {
    const { role, sortBy } = req.query;
    if (role === "student") {
      const projects = await knex("projects")
        .join("studentRating", "projects.projectId", "studentRating.projectId")
        .orderBy(sortBy, "desc");
      res.status(200).json(projects);
    } else if (role === "client") {
      const projects = await knex("projects")
        .join("clientsVotes", "projects.projectId", "clientsVotes.projectId")
        .orderBy(sortBy, "desc");
      res.status(200).json(projects);
    }
  } catch (err) {
    res.status(500).json({ message: "Could not sort" });
    console.log(err);
  }
};

exports.getProjectsByUserId = catchAsync(async (req, res, next) => {
  const { userid } = req.body;

  knex("projects")
    .where({ userId: userid })
    .then((data) => {
      res.status(200).json({
        status: "success",
        data: data,
      });
    });
});
