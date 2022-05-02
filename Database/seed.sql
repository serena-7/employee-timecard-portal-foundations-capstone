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