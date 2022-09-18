const knex = require("../knex");

exports.getAvgClientCreativity = async (projectId) => {
  try {
    const clientCreativityRaw = await knex("clientsVotes")
      .avg(knex.raw("Creativity"))
      .where({ projectId: projectId });

    return JSON.parse(JSON.stringify(clientCreativityRaw))[0][
      "avg(Creativity)"
    ];
  } catch (err) {
    console.log(err);
  }
};

exports.getAvgClientBestPractices = async (projectId) => {
try{
const clientBestPracticesRaw = await knex("clientsVotes")
.avg(knex.raw("BestPractices"))
.where({ projectId: projectId });

return JSON.parse(JSON.stringify(clientBestPracticesRaw))[0][
"avg(BestPractices)"
];
} catch (err) {
console.log(err);}
};

exports.getAvgClientDesign = async (projectId) => {
    try {
        const clientDesignRaw = await knex("clientsVotes")
        .avg(knex.raw("Design"))
        .where({ projectId: projectId });
    
        return JSON.parse(JSON.stringify(clientDesignRaw))[0]["avg(Design)"];
    } catch (err) {
        console.log(err);
    }
}

exports.getAvgClientBugs = async (projectId) => {
try{
const clientBugsRaw = await knex("clientsVotes")
.avg(knex.raw("Bugs"))
.where({ projectId: projectId });

return JSON.parse(JSON.stringify(clientBugsRaw))[0][
"avg(Bugs)"
];} catch (err) {
console.log(err);}
}

exports.getAvgStudentCreativity = async (projectId) => {
    try {
        const studentCreativityRaw = await knex("studentRating")
        .avg(knex.raw("Creativity"))
        .where({ projectId: projectId });
    
        return JSON.parse(JSON.stringify(studentCreativityRaw))[0][
        "avg(Creativity)"
        ];
    } catch (err) {
        console.log(err);
    }
}

exports.getAvgStudentBestPractices = async (projectId) => {
    try {
        const studentBestPracticesRaw = await knex("studentRating")
        .avg(knex.raw("BestPractices"))
        .where({ projectId: projectId });
    
        return JSON.parse(JSON.stringify(studentBestPracticesRaw))[0][
        "avg(BestPractices)"
        ];
    } catch (err) {
        console.log(err);
    }
}

exports.getAvgStudentDesign = async (projectId) => {
try{
const studentDesignRaw = await knex("studentRating")
.avg(knex.raw("Design"))
.where({ projectId: projectId });

return JSON.parse(JSON.stringify(studentDesignRaw))[0][
"avg(Design)"
];} catch (err) {
console.log(err);}
}

exports.getAvgStudentBugs = async (projectId) => {
try{
const studentBugsRaw = await knex("studentRating")
.avg(knex.raw("Bugs"))
.where({ projectId: projectId });

return JSON.parse(JSON.stringify(studentBugsRaw))[0][
"avg(Bugs)"
];}catch (err) {
console.log(err);}
}

exports.addStudentVote = async (projectId, body) => {
  try {
   
    const vote = await knex("studentRating").insert({
        Creativity: body.creativity,
        BestPractices: body.bestPractices,
        Design: body.design,
        Bugs: body.bugs,
        userId: body.userid,
        projectId: projectId,
    })
    return vote;
  } catch (err) {
    console.log(err);
  }
};

exports.addClientVote = async (projectId, body) => {
  try {
    const vote = await knex("clientsVotes").insert({
        Creativity: body.creativity,
        BestPractices: body.bestPractices,
        Design: body.design,
        Bugs: body.bugs,
        userId: body.userid,
        projectId: projectId,
    })
   return vote;
  } catch (err) {
    console.log(err);
  }
};
