require('dotenv').config(); //not necessary for hosted site
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path")
const {PORT} = process.env; //will either be pulled from hosting site's variables or from the .env file

app.use(express.json());
app.use(cors());
//make files in public accessible to other files
app.use(express.static(path.join(__dirname, "../public")));

//get functions from controllers
const {seed} = require('./controllers/dbCtrl.js');
const {login} = require('./controllers/loginCtrl.js');
const {getTimecards, getJobcodes, createTimecard, deleteTimecard, editTimecard} = require('./controllers/timecardCtrl.js');

//initialize html page
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,"../public/index.html"))
    });

//DEV
app.post('/seed',seed);

//login functionality
app.post(`/login`, login);

//timecard functionality
app.get(`/timecards/:id`, getTimecards);
app.get(`/jobcodes`, getJobcodes);
app.post(`/timecards`, createTimecard);
app.put(`/timecards/:id`, editTimecard);
app.delete(`/timecards/:id`,deleteTimecard);

//set up listener
app.listen(PORT, () => console.log(`up on ${PORT}`));