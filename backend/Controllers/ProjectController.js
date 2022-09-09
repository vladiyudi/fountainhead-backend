const knex = require("../knex");
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/AppError')


exports.getAllProjects = catchAsync(async (req, res, next) => {

    knex('projects')
        .then(rows => {
            console.log(rows)



            res.status(200).json({
                status: 'Success',
                results: rows.length,
                data: rows
            })

        })

})

exports.getProjectById = catchAsync(async (req, res, next) => {


    const id = req.params.id

    knex('projects').where({ id: id }).first().then((project) => {

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
     

    
})




