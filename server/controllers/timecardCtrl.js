require('dotenv').config();
const Sequelize = require('sequelize');

const {DATABASE_URL} = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

function getTimecards (req,res) {
    const userID = req.params.ID;
    sequelize.query(`
    SELECT timecard_id, date, jobs.job_code AS job_code, hours 
    FROM timecards JOIN jobs 
    ON timecards.job_id=jobs.job_id
    WHERE timecards.user_id = 1
    ORDER BY date DESC;
    `)
        .then(dbRes => {
            res.status(200).send(dbRes[0]);
        })
        .catch(err => console.log(err));
}

function getJobcodes(req,res) {
    sequelize.query(`
    SELECT * FROM jobs;
    `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err));
}

function createTimecard(req,res) {
    const {userID, jobID, date, hours} = req.body;
    sequelize.query(`
    INSERT INTO timecards(user_id, job_id, date, hours)
    VALUES(${userID}, ${jobID}, '${date}', ${hours});
    `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
}

function deleteTimecard(req,res) {
    const {id} = req.params;
    sequelize.query(`
    DELETE FROM timecards
    WHERE timecard_id = ${id};
    `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err));
}

function editTimecard(req,res) {
    const {date, job_id, hours} = req.body;
}

module.exports = {
    getTimecards,
    getJobcodes,
    createTimecard,
    deleteTimecard
}