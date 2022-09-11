const knex = require("../knex");
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/AppError')
const multer = require('multer')



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


exports.deleteProject = catchAsync(async (req, res, next) => {

    const id = req.body.projectId

    console.log(id)

    knex('projects')
        .where('projectId', id).del()

        .then(res => {

            if (!res) {
                return next(new AppError('No Project Found With That ID', 404))
            }

            res.status(204).json({
                status: 'success',
                message: "Project Successfully Deleted",
                data: null

            })

        })

})



