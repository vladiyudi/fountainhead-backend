const client = require("../redis");
// const { v4: uuidv4 } = require("uuid");
const knex = require("../knex");
const jwt = require('jsonwebtoken')
const { hashPwd } = require("../Models/userModels");

const signup = async (req, res) => {
  try {
    const { name, email, password1 } = req.body;
    const password = await hashPwd(password1);
    const userId = await knex("users")
      .insert({ name, email, password, role: 'student'})

if (userId) 
 res.send({userId: userId[0], name, email, password, role: 'student'});
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
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
    res.status(500).send(err);
  }
}

const validateUser = async (req, res)=>{
  try{
    const {userid} = req.body
    const user = await knex("users").where({ id:  userid})
    res.send(user)
  } catch (err){
    console.log(err);
    res.status(500).send(err);
  }
}

const updateUser= async (req, res)=>{
  // try{
  //   const {name, email, password} = req.body
  //   const user = await knex("users").where({ id: id }).update({name, email, password})
  //   res.send(user)
  // } catch (err){
  //   console.log(err);
  //   res.status(500).send(err);
  // }
}

module.exports = { signup, login, validateUser, updateUser };
