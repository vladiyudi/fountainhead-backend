const express = require('express')
const router = express.Router()
const projectController = require('../Controllers/ProjectController')
const {auth} = require('../Middleware/userMiddleware')

const {addComment, getComments} = require('../Controllers/ProjectController')


router
    .get('/', projectController.getAllProjects)
    .post('/', projectController.uploadProjectPicture, projectController.createNewProject)
    

router.get('/one/:id', projectController.getProjectById)


router.post('/addComment/:projectId', auth, addComment)

router.get('/getComments/:projectId', auth, getComments)

module.exports = router