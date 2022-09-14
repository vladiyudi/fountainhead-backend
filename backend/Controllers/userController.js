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

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await knex("users").where({ id: userId })
    res.send(user)
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

const signup = async (req, res) => {
  try {
    const { name, email, password1, role } = req.body;
    const password = await hashPwd(password1);
    const userId = await knex("users")
      .insert({ name, email, password, role })

    if (userId)
      res.send({ userId: userId[0], name, email, password, role});
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

const loginWithGoogle = async (req, res) => {
  try {
    const { user } = req.body;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5d' })
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 15151252151251
    })
    res.redirect('http://localhost:3000/AllProjects')
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
        const userId = req.body.userid
        const photoUrl = req.body.photo

        //  Get Current user + Set req.body.photo to avatar 

        knex('users').where({ id: userId })
          .update({ avatar: req.body.photo })

          .then(data => {
            console.log('DATA', data)

            res.status(200).json({
              status: 'Success',
              data: photoUrl
            })
          })

      }
    });
  }
};



const updateUser = catchAsync(async (req, res) => {

  const userId = req.body.userid

  knex('users').where({ id: userId })
    .update(
      {
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio
      }
    )



    .then(data => {
      console.log(data)

      res.status(200).json({
        status: 'Success',
        data
      })
    })

})

const updateRole = catchAsync(async (req, res, next) => {

  const userId = req.body.userid
  const role = req.body.role

  knex('users').where({ id: userId })
    .update(
      {
        role: role
      })
        .then(data => {
          res.status(200).json({

            status: 'Success',
            data: data
          })
        })
})

module.exports = { getUserById, signup, login, validateUser, updateUser, uploadUserPicture, uploadToCloudinary, loginWithGoogle, updateRole };
