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
    WHERE user_email = '${email}' AND user_password = '${password}';
    `)
        .then(dbRes => {
            if(dbRes[0][0]){
                res.status(200).send(dbRes[0][0]);
                console.log('success');
            } else {
                res.status(400).send('User Not Found');
            }
        })
        .catch(err => console.log(err));
}

module.exports = {
    login
}