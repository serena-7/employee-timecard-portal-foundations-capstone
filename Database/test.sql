SELECT * FROM users
WHERE user_email = ${email} AND user_password = ${password};

SELECT date, jobs.job_code AS job_code, hours 
FROM timecards JOIN jobs 
ON timecards.job_id=jobs.job_id
WHERE timecards.user_id = '${userID}'
ORDER BY date;

SELECT * FROM jobs;

UPDATE timecards
SET 