const client = require("../redis");
const { v4: uuidv4 } = require("uuid");
const knex = require("../knex");
const jwt = require('jsonwebtoken')
const { hashPwd } = require("../Models/userModels");

const signup = async (req, res) => {
  try {
    const { name, email, password1 } = req.body;
    const password = await hashPwd(password1);
    const userId = await knex("users")
      .insert({ name, email, password})

if (userId) 
 res.send({userId: userId[0], name, email, password});
  } catch (err) {
    console.log(err);
  }
};


const login = async (req, res) => {
  try{
  const {user} = req.body;
  const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '5d'})
  res.cookie('token', token, { 
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 15151252151251 })
  res.send({user, ok:true});}
  catch (err) {
    console.log(err);
  }
}

module.exports = { signup, login };
