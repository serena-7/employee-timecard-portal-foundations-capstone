require('dotenv').config(); //not required for hosted site
const Sequelize = require('sequelize');

const {DATABASE_URL} = process.env; //will either be pulled from hosted site variables or from .env file

//set up sequelize
const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

//runs query for user login
const login = (req,res) => {
    console.log('Authorizing User');
    const {email, password} = req.body;
    sequelize.query(`
    SELECT user_id, first_name, last_name FROM users
    WHERE user_email = '${email}' AND user_password = crypt('${password}',user_password);
    `)
        .then(dbRes => {
            if(dbRes[0][0]){
                res.status(200).send(dbRes[0][0]);
                console.log('success');
            } else {
                res.status(400).send('User Not Found');
            }
        })
        .catch(err => res.status(400).send('Login Error'));
}

const checkUser = (req,res) => {
    console.log('Checking if user exists');
    const {email} = req.body;
    sequelize.query(`
    SELECT * FROM users
    WHERE user_email = '${email}';
    `)
        .then(dbRes => {
            if(dbRes[0][0]){
                res.status(200).send('exists');
            } else {
                res.status(200).send("does not exists");
            }
        })
        .catch(err => res.statu(400).send('Check Failed'));
}

const register = (req,res) => {
    console.log('Registering User');
    const {firstName, lastName, email, password} = req.body;
    sequelize.query(`
    INSERT INTO users(user_email,user_password,first_name,last_name)
    VALUES('${email}',crypt('${password}',gen_salt('bf')),'${firstName}','${lastName}');
    `)
        .then(postRes => console.log('register successful'))
        .catch(err => console.log(err));
    
    sequelize.query(`
    SELECT user_id, first_name, last_name FROM users
    WHERE user_email='${email}' AND user_password= crypt('${password}',user_password);
    `)
        .then(dbRes => {
            if(dbRes[0][0]){
                res.status(200).send(dbRes[0][0]);
                console.log('login success');
            } else {
                res.status(400).send('Login Failed');
            }
        })
        .catch(err => console.log(err));
}

module.exports = {
    login,
    checkUser,
    register
}