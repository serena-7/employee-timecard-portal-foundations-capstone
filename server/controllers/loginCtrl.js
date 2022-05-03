require('dotenv').config();
const Sequelize = require('sequelize');

const {DATABASE_URL} = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

const login = (req,res) => {
    console.log('Authorizing User');
    const {email, password} = req.body;
    sequelize.query(`
    SELECT user_id FROM users
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
    // console.log(result);
    //     if(result.length != 0){
    //     console.log(result);
    //     res.status(200).send(result[0]);
    // } else {
    //     res.status(400).send('User Not Found');
    // }
}

module.exports = {
    login
}