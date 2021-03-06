require('dotenv').config(); //not required for hosted site
const Sequelize = require('sequelize');

const {DATABASE_URL} = process.env; //will either pull from hosted site variables or from .env file

//set up sequelize
const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

//seed the database function
const seed = (req,res) => {
    sequelize.query(`
CREATE EXTENSION pgcrypto;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS timecards CASCADE;


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50) 
);

CREATE TABLE jobs (
    job_id SERIAL PRIMARY KEY,
    job_code VARCHAR(100) NOT NULL,
    job_location VARCHAR(500)
);

CREATE TABLE timecards (
    timecard_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    job_id INT NOT NULL REFERENCES jobs(job_id),
    start_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    end_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    hours NUMERIC NOT NULL
);

INSERT INTO users (user_email, user_password, first_name, last_name)
VALUES ('bob@email.com',crypt('bsmith',gen_salt('bf')),'Bob','Smith'),
('mike@email.com',crypt('mjohnson',gen_salt('bf')),'Mike','Johnson'),
('todd@email.com',crypt('tjenkins',gen_satl('bf')),'Todd','Jenkins');

INSERT INTO jobs (job_code, job_location)
VALUES ('PTO','N/A'),
('jobsite1','salt lake city'),
('jobsite2','provo'),
('jobsite3','spanish fork');

INSERT INTO timecards (user_id, job_id, start_timestamp, end_timestamp, hours)
VALUES(1,1,'2022-01-10 7:00:00-07','2022-01-10 15:00:00-07',8),
(1,3,'2022-01-11 7:00:00-07','2022-01-11 15:00:00-07',8),
(1,3,'2022-01-12 7:00:00-07','2022-01-12 15:00:00-07',8),
(1,3,'2022-01-13 7:00:00-07','2022-01-13 15:00:00-07',8),
(1,3,'2022-01-14 7:00:00-07','2022-01-14 15:00:00-07',8),
(1,3,'2022-01-17 7:00:00-07','2022-01-17 15:00:00-07',8),
(1,3,'2022-01-18 7:00:00-07','2022-01-18 13:00:00-07',6),
(1,2,'2022-01-18 13:00:00-07','2022-01-18 15:00:00-07',2),
(1,2,'2022-01-19 7:00:00-07','2022-01-19 15:00:00-07',8),
(1,2,'2022-01-20 7:00:00-07','2022-01-20 15:00:00-07',8),
(1,2,'2022-01-21 7:00:00-07','2022-01-21 15:00:00-07',8),

(2,3,'2022-01-10 7:00:00-07','2022-01-10 15:00:00-07',8),
(2,3,'2022-01-11 7:00:00-07','2022-01-11 15:00:00-07',8),
(2,3,'2022-01-12 7:00:00-07','2022-01-12 15:00:00-07',8),
(2,2,'2022-01-13 7:00:00-07','2022-01-13 15:00:00-07',8),
(2,2,'2022-01-14 7:00:00-07','2022-01-14 15:00:00-07',8),
(2,2,'2022-01-17 7:00:00-07','2022-01-17 15:00:00-07',8),
(2,2,'2022-01-18 7:00:00-07','2022-01-18 15:00:00-07',8),
(2,1,'2022-01-19 7:00:00-07','2022-01-19 15:00:00-07',8),
(2,3,'2022-01-20 7:00:00-07','2022-01-20 15:00:00-07',8),
(2,3,'2022-01-21 7:00:00-07','2022-01-21 15:00:00-07',8),

(3,4,'2022-01-10 7:00:00-07','2022-01-10 15:00:00-07',8),
(3,4,'2022-01-11 7:00:00-07','2022-01-11 15:00:00-07',8),
(3,4,'2022-01-12 7:00:00-07','2022-01-12 12:00:00-07',5),
(3,2,'2022-01-12 12:00:00-07','2022-01-12 15:00:00-07',3),
(3,2,'2022-01-13 7:00:00-07','2022-01-13 15:00:00-07',8),
(3,2,'2022-01-14 7:00:00-07','2022-01-14 15:00:00-07',8),
(3,2,'2022-01-17 7:00:00-07','2022-01-17 15:00:00-07',8),
(3,2,'2022-01-18 7:00:00-07','2022-01-18 15:00:00-07',8),
(3,1,'2022-01-19 7:00:00-07','2022-01-19 15:00:00-07',8),
(3,4,'2022-01-20 7:00:00-07','2022-01-20 15:00:00-07',8),
(3,4,'2022-01-21 7:00:00-07','2022-01-21 15:00:00-07',8);

    `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
}

module.exports = {
    seed
}