const knex = require("../knex");


exports.getAllProjects = (req, res, next) => {

    knex('projects')
        .then(rows => {
            console.log(rows)

            res.status(200).json({
                stattus: 'Success',
                data: rows
            })



        })

}






