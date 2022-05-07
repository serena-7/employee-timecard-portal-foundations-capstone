require('dotenv').config(); //not required for hosted site
const Sequelize = require('sequelize');

const {DATABASE_URL} = process.env; //will either be pulled from hosted site variables or .env file

//set up sequelize
const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = {
    //query to pull timecard data
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
    //query to pull jobcode data
    getJobcodes:(req,res)=> {
        sequelize.query(`
        SELECT * FROM jobs;
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err));
    },
    //query to insert new timecard
    createTimecard:(req,res)=> {
        const {userID, jobID, startTimestamp, endTimestamp, hours} = req.body;
        sequelize.query(`
        INSERT INTO timecards(user_id, job_id, start_timestamp, end_timestamp, hours)
        VALUES(${userID}, ${jobID}, '${startTimestamp}','${endTimestamp}', ${hours});
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    //query to delete timecard
    deleteTimecard:(req,res)=> {
        const {id} = req.params;
        sequelize.query(`
        DELETE FROM timecards
        WHERE timecard_id = ${id};
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err));
    },
    //query to update timecard
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