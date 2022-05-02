require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const {SERVER_PORT} = process.env;

app.use(express.json());
app.use(cors());

const {seed} = require('./controllers/dbCtrl.js');
const {login} = require('./controllers/loginCtrl.js');
const {getTimecards, getJobcodes} = require('./controllers/timecardCtrl.js');
//DEV
app.post('/seed',seed);

//login functionality
app.post(`/api/login`, login);

//timecard functionality
app.get(`/api/timecards`, getTimecards);
app.get(`/api/jobcodes`, getJobcodes);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));