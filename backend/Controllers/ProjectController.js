const knex = require("../knex");
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/AppError')
const multer = require('multer')
const {addStudentVote, addClientVote} = require('../Models/projectModel')



const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/projectImg')
    },
    filename: (req, file, cb) => {
        //    user-76567avb-21123123.jpeg
        const ext = file.mimetype.split('/')[1]
        cb(null, `user-${Date.now()}.${ext}`)
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not An Image! Please Upload only images', 404), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})


exports.uploadProjectPicture = upload.single('picture')


exports.getAllProjects = catchAsync(async (req, res, next) => {

    console.log(req.body)

    // Query For Project Type
    if (req.body.type === 'BE' || req.body.type === 'FE' || req.body.type === 'FS') {
        knex('projects').where({ type: req.body.type })
            .then(rows => {
                res.status(200).json({
                    status: 'Success',
                    results: rows.length,
                    data: rows
                })
                next()
            })
            .catch(err => {
                console.log(err)
                return new AppError('Something Went Wrong', 404)
            })
    } else {

        //  Get All Projects
        knex('projects')
            .then(rows => {

                res.status(200).json({
                    status: 'Success',
                    results: rows.length,
                    data: rows
                })

            })

            .catch(err => {
                console.log(err)
                return new AppError('Something Went Wrong', 404)
            })
    }



})

exports.getProjectById = catchAsync(async (req, res, next) => {
    const id = req.params.id

    knex('projects').where({ projectId: id }).first().then((project) => {

        if (!project) {
            return next(new AppError('No Project Found With That ID', 404))
        }
        res.status(200).json({
            status: 'Success',
            data: project
        })
    })
})

exports.createNewProject = catchAsync(async (req, res, next) => {

    console.log(req.file)
    console.log(req.body)
    // const picture = req.file.filename

    const { type, name, info, iframe } = req.body


    knex.insert(
        {
            type,
            name,
            info,
            iframe
        }
    ).into('projects')

        .then(data => {

            res.status(200).json(
                data
            )



        })

        .catch(err => {
            console.log(err)
            return new AppError('Could not create Project', 404)
        })
})


exports.deleteProject = catchAsync(async (req, res, next) => {})

    // const id = req.body.projectId

    // console.log(id)

    // knex('projects')
    //     .where('projectId', id).del()

    //     .then(res => {

    //         if (!res) {
    //             return next(new AppError('No Project Found With That ID', 404))
    //         }

    //         res.status(204).json({
    //             status: 'success',
    //             message: "Project Successfully Deleted",
    //             data: null

    //         })

    //     })




 exports.addComment = async (req, res) => {
    try{
    const {projectId} = req.params
    const {comment, code, userid} = req.body
    const newComment = await knex('comments').insert({comment, code, userId:userid, projectId: projectId})
    res.status(200).json(newComment)}
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Could not add comment'})
    }
 }

    exports.getComments = async (req, res) => {
        try{
        const {projectId} = req.params
        const comments = await knex('comments').where({projectId: projectId})
        res.status(200).json(comments)}
        catch(err){
            console.log(err)
            res.status(500).json({message: 'Could not get comments'})
        }
    }

    exports.voteForProject = async (req, res) => {
        try{
        const {projectId} = req.params
        const {userid} = req.body
        let newRating
    const user = await knex('users').where({id: userid})
    if (user[0].role === 'student') newRating = await addStudentVote(projectId, req.body)
    else newRating = await addClientVote(projectId, req.body)
    res.send(newRating)

         } catch(err){
            console.log(err)
            res.status(500).json({message: 'Could not vote'})
        }
    }

    exports.getProjectVotes = async (req, res) => {
        try{
        const {projectId} = req.params
        const studentVotes = await knex('studentRating').where({projectId: projectId})

        const clientVotes = await knex('clientsVotes').where({projectId: projectId})
        res.status(200).json({studentVotes: studentVotes[0], clientVotes: clientVotes[0]})}
        catch(err){
            console.log(err)
            res.status(500).json({message: 'Could not get votes'})
        }}