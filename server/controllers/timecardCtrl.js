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

module.exports = {
    getTimecards: (req,res) => {
        const userID = req.params.id;
        console.log(userID);
        sequelize.query(`
        SELECT timecard_id, start_timestamp, end_timestamp, jobs.job_code AS job_code, hours 
        FROM timecards JOIN jobs 
        ON timecards.job_id=jobs.job_id
        WHERE timecards.user_id = ${userID}
        ORDER BY start_timestamp DESC;
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0]);
            })
            .catch(err => console.log(err));
    },
    
     getJobcodes:(req,res)=> {
        sequelize.query(`
        SELECT * FROM jobs;
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err));
    },
    
     createTimecard:(req,res)=> {
        const {userID, jobID, date, hours} = req.body;
        sequelize.query(`
        INSERT INTO timecards(user_id, job_id, date, hours)
        VALUES(${userID}, ${jobID}, '${date}', ${hours});
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    
     deleteTimecard:(req,res)=> {
        const {id} = req.params;
        sequelize.query(`
        DELETE FROM timecards
        WHERE timecard_id = ${id};
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err));
    },
    
    editTimecard: (req,res) => {
        const {job_id, start_timestamp, end_timestamp, hours} = req.body;
        const {id} = req.params;
        sequelize.query(`
        UPDATE timecards
        SET job_id = ${job_id}, start_timestamp = '${start_timestamp}', end_timestamp = '${end_timestamp}', hours = ${hours}
        WHERE timecard_id = ${id};
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err));
    }
}