const Redis = require('redis')
require('dotenv').config()

const client = Redis.createClient(
    {
    socket: {
        host: 'redis-10343.c300.eu-central-1-1.ec2.cloud.redislabs.com',
        port: 10343,
    },  
    password: process.env.REDIS_PWD
}
)

const connetToRedis = async () => {
    await client.connect();
};
connetToRedis()



client.set('op', JSON.stringify({name: "Mak", last: "Yudo", baba:{name: 'kakana', date: 35}, zizi: [1,2,3,4]}))

client.set('zipukk', 'kudsdsl')

client.set('student', JSON.stringify({class: "ITC", skils: ["coding", "dev"]}))

const bool = client.exists('op', (err, res)=>{console.log(res)})



const getFromRedis = async ()=>{

    const bool = await client.exists('o1p', (err, res)=>{console.log(res)})
   const keys = await client.keys('*', (err, res)=>{console.log(res)})
    const res = await client.get('KEYS *')
    // console.log(res)
}

getFromRedis()

client.on('error', (err) => {
    console.log('Error ' + err)
})

client.on('connect', () => {
    // console.log('Connected to Redis')
})

module.exports = client