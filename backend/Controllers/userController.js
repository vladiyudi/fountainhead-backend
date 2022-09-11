const client = require("../redis");
// const { v4: uuidv4 } = require("uuid");
const knex = require("../knex");
const jwt = require('jsonwebtoken')
const { hashPwd } = require("../Models/userModels");
const multer = require('multer')
const catchAsync = require('../Utils/catchAsync')
const fs = require('fs')


const cloudinary = require('../Utils/cloudinary')

const defaultUserPhoto = `https://res.cloudinary.com/pet-adoption-bc/image/upload/v1661840881/np34v1uyknyeejj6kh2i.jpg`


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/userImg')
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


const uploadUserPicture = upload.single('photo')







const signup = async (req, res) => {
  try {
    const { name, email, password1 } = req.body;
    const password = await hashPwd(password1);
    const userId = await knex("users")
      .insert({ name, email, password })

    if (userId)
      res.send({ userId: userId[0], name, email, password });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};


const login = async (req, res) => {
  try {
    const { user } = req.body;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5d' })
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 15151252151251
    })
    res.send({ user, ok: true });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

const validateUser = async (req, res) => {
  try {
    const { userid } = req.body
    const user = await knex("users").where({ id: userid })
    res.send(user)
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}


const uploadToCloudinary = async (req, res, next) => {
  if (!req.file?.path) {
    req.body.picture = defaultUserPhoto;
  } else {
    cloudinary.uploader.upload(req.file.path, (error, result) => {
      if (error) {
        res.status(500).send(error);
        return;
      }
      if (result) {
        fs.unlinkSync(req.file.path); 
        req.body.photo = result.url    
        next();
        return;
      }
    });
  }
};



const updateUser = catchAsync(async (req, res) => {

  console.log('👽', req.body.photo)

  console.log(  '🔰' ,req.body)



})

module.exports = { signup, login, validateUser, updateUser, uploadUserPicture, uploadToCloudinary };
