const express = require('express')
const router = express.Router()
const projectController = require('../Controllers/ProjectController')




router
    .get('/', projectController.getAllProjects)
    .post('/', projectController.uploadProjectPicture, projectController.createNewProject)
    .delete('/', projectController.deleteProject)

router.get('/one/:id', projectController.getProjectById)





module.exports = router