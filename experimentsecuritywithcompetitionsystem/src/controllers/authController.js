const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { createLogger, format, transports } = require('winston');
const { printf } = format;
const loggerformat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

exports.processLogin = (req, res, next) => {
    console.log("==============================================================");
    console.log("authController.js > processLogin is called and running!");
    console.log("==============================================================");

    let email = req.body.email;
    let password = req.body.password;
    console.log("email: " + email);
    console.log("password: " + password);

    if (validator.isEmail(email)) {
        try {
            auth.authenticate(email, function (error, results) {
                if (error) {
                    //let message = 'Credentials are not valid.';
                    //return res.status(500).json({ message: message });
                    //If the following statement replaces the above statement
                    //to return a JSON response to the client, the SQLMap or
                    //any attacker (who relies on the error) will be very happy
                    //because they relies a lot on SQL error for designing how to do 
                    //attack and anticipate how much "rewards" after the effort.
                    //Rewards such as sabotage (seriously damage the data in database), 
                    //data theft (grab and sell). 
                    //return res.status(500).json({ message: error });
                    const logger = createLogger({
                        format: format.combine(
                            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                            loggerformat
                        ),
                        transports: [
                            new transports.Console(),
                            new transports.File({ filename: './Logs/FailedLogins.log', level: 'warn' }),
                        ],
                    });
                    logger.warn('Login for ' + email + ' has failed!\n IP for ' + email + ' login: ' + req.ip + '\n')
                    let jsonResult = {
                        message: 'Credentials are not valid'
                    };
			console.log("Authcontroller > error1")
                    return res.status(500).json(jsonResult);

                } else {
                    if (results.length == 1) {
                        if ((password == null) || (results[0] == null)) {
                            let jsonResult = {
                                message: 'Login Failed'
                            };
				console.log("Authcontroller > error2")
                            return res.status(500).json(jsonResult);
                        }


                        if (bcrypt.compareSync(password, results[0].user_password) == true) {
                            let jsonResult = {
                                user_id: results[0].user_id,
                                role_name: results[0].role_name,
                                token: jwt.sign({ id: results[0].user_id, uRole: results[0].role_name }, config.JWTKey, {
                                    expiresIn: 7200 //Expires in 2 hrs
                                })
                            }; //End of jsonResult variable setup

                            return res.status(200).json(jsonResult);
                        } else {
                            const logger = createLogger({
                                format: format.combine(
                                    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                                    loggerformat
                                ),
                                transports: [
                                    new transports.Console(),
                                    new transports.File({ filename: './Logs/FailedLogins.log', level: 'warn' }),
                                ],
                            });
				console.log("Authcontroller > error3")
                            logger.warn('Login for ' + email + ' has failed!\n IP for ' + email + ' login: ' + req.ip + '\n')
                            let jsonResult = {
                                message: 'Login has failed.'
                            }
	
                            return res.status(500).json(jsonResult);
                        } //End of passowrd comparison with the retrieved decoded password.
                    } //End of checking if there are returned SQL results
                }

            })

        } catch (error) {
            console.log("error: " + error);
            const logger = createLogger({
                format: format.combine(
                    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    loggerformat
                ),
                transports: [
                    new transports.Console(),
                    new transports.File({ filename: './Logs/FailedLogins.log', level: 'warn' }),
                ],
            });
            logger.warn('Login for ' + email + ' has failed!\n Error:' + error + ' IP for ' + email + ' login: ' + req.ip + '\n')
            let jsonResult = {
                message: 'An error has occured!'
            }
		console.log("Authcontroller > error4")
            return res.status(500).json(jsonResult);
        } //end of try

    } else {
        console.log("\nregex check unsucessful in backend\n");
        const logger = createLogger({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                loggerformat
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: './Logs/FailedLogins.log', level: 'warn' }),
            ],
        });
        logger.warn('Login for ' + email + ' has failed!\n IP for ' + email + ' login: ' + req.ip + '\n')
        let jsonResult = {
            message: 'Login has failed.'
        }
	    console.log("Authcontroller > error5")
        return res.status(500).json(jsonResult);
    } // end of else

}; // End of processLogin

exports.processRegister = (req, res, next) => {
    console.log("==============================================================");
    console.log("authController.js > processRegister is called and running!");
    console.log("==============================================================");

    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;

    let fullName_regEx = new RegExp("^[a-zA-Z0-9\s,']+$");
    let pwd_regEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$");

    const saltRounds = 10;

    if (fullName_regEx.test(fullName) && pwd_regEx.test(password) && validator.isEmail(email)) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    console.log('Error on hashing password');
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
                    logger.error('backend > src > controllers > authController.js Error for hashing password! Error: ' + JSON.stringify(err) + '\n')
                    let jsonResult = {
                        message: 'Unable to complete registration'
                    };
                    return res.status(500).json(jsonResult);
                } else {
                    console.log("Gonna create user now!");
                    results = user.createUser(fullName, email, hash, function (results, error) {
                        if (results != null) {
                            console.log(results);

                            let jsonResult = {
                                message: "Completed Registration!"
                            };
                            return res.status(200).json(jsonResult);
                        }
                        if (error) {
                            console.log('processRegister method : callback error block section is running.');
                            console.log(error, '==================================================================');
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
                            logger.error('backend > src > controllers > authController.js Callback error for processRegister! Error: ' + JSON.stringify(error) + '\n')
                            let jsonResult = {
                                message: 'Unable to complete registration'
                            }
                            return res.status(500).json(jsonResult);
                        }
                    });//End of anonymous callback function
                }; // End of if-Else
            });// End of bCrypt Hashing Function

            if (err) {
                console.log('Error on generating salt for password');
                console.log("Error: " + err);

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
                logger.error('backend > src > controllers > authController.js Error for generating password salt! Error: ' + JSON.stringify(err) + '\n')
                let jsonResult = {
                    message: 'Unable to complete registration'
                };
                return res.status(500).json(jsonResult);
            }
        });// End of bCrypt Salt Generation
        bcrypt.hash(password, 10, async (err, hash) => {

        });

    } else {
        console.log("regex check unsucessful in backend");
        let jsonResult = {
            message: 'Unable to complete registration'
        }
        return res.status(500).json(jsonResult);
    }

}; // End of processRegister
