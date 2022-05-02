DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS timecards;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    user_password VARCHAR(500) NOT NULL,
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
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    hours NUMERICAL NOT NULL
);

INSERT INTO users (user_email, user_password, first_name, last_name)
VALUES ('bob@email.com','bsmith','Bob','Smith'),
('mike@email.com','mjohnson','Mike','Johnson'),
('todd@email.com','tjenkins','Todd','Jenkins');

INSERT INTO jobs (job_code, job_location)
VALUES ('PTO','N/A'),
('jobsite1','salt lake city'),
('jobsite2','provo'),
('jobsite3','spanish fork');

INSERT INTO timecards (user_id, job_id, date, hours)
VALUES(1,1,'2022-01-10',8),
(1,3,'2022-01-11',8),
(1,3,'2022-01-12',8),
(1,3,'2022-01-13',8),
(1,3,'2022-01-14',8),
(1,3,'2022-01-17',8),
(1,3,'2022-01-18',6),
(1,2,'2022-01-18',2),
(1,2,'2022-01-19',8),
(1,2,'2022-01-20',8),
(1,2,'2022-01-21',8),

(2,3,'2022-01-10',8),
(2,3,'2022-01-11',8),
(2,3,'2022-01-12',8),
(2,2,'2022-01-13',8),
(2,2,'2022-01-14',8),
(2,2,'2022-01-17',8),
(2,2,'2022-01-18',8),
(2,1,'2022-01-19',8),
(2,3,'2022-01-20',8),
(2,3,'2022-01-21',8),

(2,4,'2022-01-10',8),
(2,4,'2022-01-11',8),
(2,4,'2022-01-12',5),
(2,2,'2022-01-12',3),
(2,2,'2022-01-13',8),
(2,2,'2022-01-14',8),
(2,2,'2022-01-17',8),
(2,2,'2022-01-18',8),
(2,1,'2022-01-19',8),
(2,4,'2022-01-20',8),
(2,4,'2022-01-21',8);
