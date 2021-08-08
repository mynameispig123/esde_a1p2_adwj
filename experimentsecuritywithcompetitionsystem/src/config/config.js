//config.js
const dotenv = require('dotenv');
dotenv.config(); //Build the process.env object.pm
module.exports = {
    databaseUserName: "ec2",
    databasePassword: "Bobthe123",
    databaseName: process.env.DB_DATABASE_NAME,

    cloudinaryUrl: 'nil',
    cloudinaryCloudName: 'nil',
    cloudinaryApiKey: 'nil',
    cloudinaryApiSecret: 'nil',
    JWTKey: 'alllearnershavepotentialtobethebest',
   
    mailtrapUserName: process.env.MAILTRAP_USERNAME,
    mailtrapPassword:process.env.MAILTRAP_PASSWORD
};
//Reference:
//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
