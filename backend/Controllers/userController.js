const client = require('../redis')
const { v4: uuidv4 } = require('uuid')

const signup = async (req, res) => {
    try{
        const {name, email, password1} = req.body
        const id = uuidv4()
        const user = {name, email, password, id}
        await client.set(id, JSON.stringify(user))
        const newUser = await client.get(id)

     const us = JSON.parse(newUser)
     console.log(us.email)

        res.send(newUser)
    }catch (err) {
        console.log(err)
    }
}

module.exports = {signup}