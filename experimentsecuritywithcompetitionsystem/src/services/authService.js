config = require('../config/config');
const pool = require('../config/database')
const { createLogger, format, transports } = require('winston');
const { printf } = format;
const loggerformat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

module.exports.authenticate = (email, callback) => {
    console.log("==============================================================");
    console.log("authService.js > authenticate is called and running!");
    console.log("==============================================================");

    pool.getConnection((err, connection) => {
        if (err) {
            if (err){
		console.log("err: " + err);
		throw err;
	    }

        } else {
            try {
                
                connection.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
                    FROM user INNER JOIN role ON user.role_id=role.role_id AND email=?`, [email], (err, rows) => {
                    if (err) {
                        if (err) return callback(err, null);

                    } else {
                        if (rows.length == 1) {
                            console.log(rows);
                            return callback(null, rows);

                        } else {
                            return callback('Login has failed', null);
                        }
                    }
                    connection.release();

                });
            } catch (error) {
                const logger = createLogger({
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        loggerformat
                    ),
                    transports: [
                        new transports.Console(),
                        new transports.File({ filename: './Logs/Errors.log', level: 'error' }),
                    ],
                });
                logger.error('backend > src > controllers > authService.js Error for authService.js! Error: ' + JSON.stringify(error) + '\n')
                return callback(error, null);;
            }
        }
    }); //End of getConnection

} //End of authenticate
