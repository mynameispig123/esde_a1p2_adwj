const mysql = require('mysql');
const config = require('./config');
//To find out more on createPool:
//https://www.npmjs.com/package/mysql#pooling-connections

const pool = mysql.createPool({
        connectionLimit: 100,
        host: 'db-restore.cl1vgbx9g5iu.us-east-1.rds.amazonaws.com',
        user: 'ec2',
        password: 'Bobthe123',
        database: 'competition_system_security_concept_v2_db',
        multipleStatements: true
    });

 module.exports=pool;
