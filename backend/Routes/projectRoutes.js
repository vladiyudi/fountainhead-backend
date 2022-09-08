const express = require('express')
const router = express.Router()
const projectController = require('../Controllers/ProjectController')


router.get('/projects', projectController.getAllProjects)






module.exports = router