const knex = require("../knex");

exports.addStudentVote = async (projectId, body) => {

try{
    const {creativity, bestPractices, design, bugs} = body
   const studentVotes = await knex('studentRating').where({projectId: projectId})

   if (studentVotes.length === 0) {
       await knex('studentRating').insert({projectId: projectId, avgCreativity: creativity, avgBestPractices: bestPractices, avgDesign: design, avgBugs: bugs, totalVotes: 1})

       return {avgCreativity:creativity, avgBestPractices:bestPractices, avgDesign:design, avgBugs:bugs}

   } else {
   
    const totalVotes = studentVotes[0].totalVotes + 1

    const avgCreativity = (studentVotes[0].avgCreativity*studentVotes[0].totalVotes + creativity) / totalVotes
    const avgBestPractices = (studentVotes[0].avgBestPractices*studentVotes[0].totalVotes + bestPractices) / totalVotes
    const avgDesign = (studentVotes[0].avgDesign*studentVotes[0].totalVotes + design) / totalVotes
    const avgBugs = (studentVotes[0].avgBugs*studentVotes[0].totalVotes + bugs) / totalVotes

    await knex('studentRating').where({projectId: projectId}).update({avgCreativity: avgCreativity, avgBestPractices: avgBestPractices, avgDesign: avgDesign, avgBugs: avgBugs, totalVotes: totalVotes})

    return {avgCreativity, avgBestPractices, avgDesign, avgBugs}

   }} catch(err){
       console.log(err)
   }

}

exports.addClientVote = async (projectId, body) => {

    try{
        const {creativity, bestPractices, design, bugs} = body
       const clientsVotes = await knex('clientsVotes').where({projectId: projectId})
    
       if (clientsVotes.length === 0) {
           await knex('clientsVotes').insert({projectId: projectId, avgCreativity: creativity, avgBestPractices: bestPractices, avgDesign: design, avgBugs: bugs, totalVotes: 1})
    
           return {avgCreativity:creativity, avgBestPractices:bestPractices, avgDesign:design, avgBugs:bugs}
    
       } else {
        const totalVotes = clientsVotes[0].totalVotes + 1
        const avgCreativity = (clientsVotes[0].avgCreativity*clientsVotes[0].totalVotes + creativity) / totalVotes
        const avgBestPractices = (clientsVotes[0].avgBestPractices*clientsVotes[0].totalVotes + bestPractices) / totalVotes
        const avgDesign = (clientsVotes[0].avgDesign*clientsVotes[0].totalVotes + design) / totalVotes
        const avgBugs = (clientsVotes[0].avgBugs*clientsVotes[0].totalVotes + bugs) / totalVotes
    
        await knex('clientsVotes').where({projectId: projectId}).update({avgCreativity: avgCreativity, avgBestPractices: avgBestPractices, avgDesign: avgDesign, avgBugs: avgBugs, totalVotes: totalVotes})
    
        return {avgCreativity, avgBestPractices, avgDesign, avgBugs}
    
       }} catch(err){
           console.log(err)
       }
    


}