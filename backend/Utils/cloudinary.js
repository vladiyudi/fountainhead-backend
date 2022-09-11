

module.exports = cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: "./.env" })

const APIKEY = process.env.api_key
const APISECRET = process.env.api_secret


cloudinary.config({
    cloud_name: 'pet-adoption-bc',
    api_key: APIKEY,
    api_secret: APISECRET
});
