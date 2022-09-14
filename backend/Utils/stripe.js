require('dotenv').config({path:"./.env"})
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const makeDonation = async (req, res)=>{
try{
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/Reward`,
        cancel_url: `${process.env.BASE_URL}/cancel`,
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {'name': 'Donation'},
                unit_amount: 1000,
            },
            quantity: 1,
        }]
    })
    res.send({url:session.url})
}
catch(err){
    console.log(err)
    res.status(500).send(err)
}
   
}

module.exports = {makeDonation}