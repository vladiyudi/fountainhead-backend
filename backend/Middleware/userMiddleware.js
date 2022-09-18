const knex = require("../knex");
const Ajv = require("ajv");
const ajv = new Ajv();
const addFormats = require("ajv-formats");
addFormats(ajv);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require("dotenv").config({ path: "./.env" })

const passwordMatch = (req, res, next) => {
  if (req.body.password1 !== req.body.password2) {
    res.status(400).send("Passwords do not match");
    return;
  }
  next();
};

const validateNewUser = async (req, res, next) => {
  const existingUser = await knex("users").where({ email: req.body.email });
  if (!existingUser.length) {
    next();
    return;
  } else {
    res.status(400).send("User already exists");
    return;
  }
};

const validateSignUp = (schema) => (req, res, next) => {
  const valid = ajv.validate(schema, req.body);
  if (!valid) {
    res.status(400).send(ajv.errors[0]);
    return;
  }
  next();
};

const validateLogin = (schema) => {
  return (req, res, next) => {
    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).send(ajv.errors[0]);
      return;
    }
    next();
  };
};

const validateEmail = async (req, res, next) => {
  const existingUser = await knex("users").where({ email: req.body.email });
  if (existingUser.length) {
    req.body.user = existingUser[0];
    next();
    return;
  } else {
    res.status(400).send("User does not exist");
    return;
  }
}

const validatePasswordMatch = async (req, res, next) => {
  const { user } = req.body;
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (result) {
      next()
    }
    else res.status(400).send("Password is incorrect");
    return
  });
}

const auth = (req, res, next) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send("Unauthorized");
      return;
    }
    req.body.userid = decoded.id;
    next();
  }
  );
}

module.exports = { auth, passwordMatch, validateNewUser, validateSignUp, validateLogin, validateEmail, validatePasswordMatch }