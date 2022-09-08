require('dotenv').config({path:"./.env"})
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const makeDonation = async (req, res)=>{
try{
    const session = await stripe.checkout.sessions.create({

    })
    res.send('hello')
}
catch(err){
    console.log(err)
    res.status(500).send(err)
}
   
}

module.exports = {makeDonation}