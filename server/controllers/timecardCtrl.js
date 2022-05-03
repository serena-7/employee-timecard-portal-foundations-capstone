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
    SELECT date, jobs.job_code AS job_code, hours 
    FROM timecards JOIN jobs 
    ON timecards.job_id=jobs.job_id
    WHERE timecards.user_id = 1
    ORDER BY date;
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

module.exports = {
    getTimecards,
    getJobcodes
}