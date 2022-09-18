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
    const { creativity, bestPractices, design, bugs } = body;
    const studentVotes = await knex("studentRating").where({
      projectId: projectId,
    });

    if (studentVotes.length === 0) {
      await knex("studentRating").insert({
        projectId: projectId,
        avgCreativity: creativity,
        avgBestPractices: bestPractices,
        avgDesign: design,
        avgBugs: bugs,
        totalVotes: 1,
      });

      return {
        avgCreativity: creativity,
        avgBestPractices: bestPractices,
        avgDesign: design,
        avgBugs: bugs,
      };
    } else {
      const totalVotes = studentVotes[0].totalVotes + 1;

      const avgCreativity =
        (studentVotes[0].avgCreativity * studentVotes[0].totalVotes +
          creativity) /
        totalVotes;
      const avgBestPractices =
        (studentVotes[0].avgBestPractices * studentVotes[0].totalVotes +
          bestPractices) /
        totalVotes;
      const avgDesign =
        (studentVotes[0].avgDesign * studentVotes[0].totalVotes + design) /
        totalVotes;
      const avgBugs =
        (studentVotes[0].avgBugs * studentVotes[0].totalVotes + bugs) /
        totalVotes;

      await knex("studentRating").where({ projectId: projectId }).update({
        avgCreativity: avgCreativity,
        avgBestPractices: avgBestPractices,
        avgDesign: avgDesign,
        avgBugs: avgBugs,
        totalVotes: totalVotes,
      });

      return { avgCreativity, avgBestPractices, avgDesign, avgBugs };
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addClientVote = async (projectId, body) => {
  try {
    const { creativity, bestPractices, design, bugs } = body;
    const clientsVotes = await knex("clientsVotes").where({
      projectId: projectId,
    });

    if (clientsVotes.length === 0) {
      await knex("clientsVotes").insert({
        projectId: projectId,
        avgCreativity: creativity,
        avgBestPractices: bestPractices,
        avgDesign: design,
        avgBugs: bugs,
        totalVotes: 1,
      });

      return {
        avgCreativity: creativity,
        avgBestPractices: bestPractices,
        avgDesign: design,
        avgBugs: bugs,
      };
    } else {
      const totalVotes = clientsVotes[0].totalVotes + 1;
      const avgCreativity =
        (clientsVotes[0].avgCreativity * clientsVotes[0].totalVotes +
          creativity) /
        totalVotes;
      const avgBestPractices =
        (clientsVotes[0].avgBestPractices * clientsVotes[0].totalVotes +
          bestPractices) /
        totalVotes;
      const avgDesign =
        (clientsVotes[0].avgDesign * clientsVotes[0].totalVotes + design) /
        totalVotes;
      const avgBugs =
        (clientsVotes[0].avgBugs * clientsVotes[0].totalVotes + bugs) /
        totalVotes;

      await knex("clientsVotes").where({ projectId: projectId }).update({
        avgCreativity: avgCreativity,
        avgBestPractices: avgBestPractices,
        avgDesign: avgDesign,
        avgBugs: avgBugs,
        totalVotes: totalVotes,
      });

      return { avgCreativity, avgBestPractices, avgDesign, avgBugs };
    }
  } catch (err) {
    console.log(err);
  }
};
