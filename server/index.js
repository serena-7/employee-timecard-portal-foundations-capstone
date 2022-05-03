require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path")
const {PORT} = process.env;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

const {seed} = require('./controllers/dbCtrl.js');
const {login} = require('./controllers/loginCtrl.js');
const {getTimecards, getJobcodes, createTimecard, deleteTimecard, editTimecard} = require('./controllers/timecardCtrl.js');

//initialize
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,"../public/index.html"))
    });

//DEV
app.post('/seed',seed);

//login functionality
app.post(`/login`, login);

//timecard functionality
app.get(`/timecards`, getTimecards);
app.get(`/jobcodes`, getJobcodes);
app.post(`/timecards`, createTimecard);
app.put(`/timecards`, editTimecard);
app.delete(`/timecards/:id`,deleteTimecard);

app.listen(PORT, () => console.log(`up on ${PORT}`));