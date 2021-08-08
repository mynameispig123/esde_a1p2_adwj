const userManager = require('../services/userService');
const fileDataManager = require('../services/fileService');
const config = require('../config/config');
const validator = require('validator');
const { json } = require('body-parser');
const { JWTKey } = require('../config/config');
const { create } = require('domain');
const { createLogger, format, transports } = require('winston');
const { printf } = format;
const loggerformat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

function checkUserID(userId, decodedId) {
    console.log("---------");
    console.log("Running checkUserID function inside userController.js");
    console.log("---------");
    console.log("userId: " + userId);
    console.log("decodedId: " + decodedId);

    if (userId != decodedId) {
        console.log("----------------");
        console.log("UserID does not match Token ID");
        console.log("Query/Upload can only be done with the same Token ID!");
        console.log("----------------");

        userId = decodedId;
        console.log("userID changed to Token ID");

        return userId;
    }

    return userId;
};

exports.processDesignSubmission = (req, res, next) => {
    console.log("==============================================================");
    console.log("userController.js > processDesignSubmission is called and running!");
    console.log("==============================================================");

    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    var userId = req.body.userId;
    let file = req.body.file;

    // =============== Start of Changes =========================
    let decodedId = req.decodedId;
    userId = checkUserID(userId, decodedId);

    // regex check to ensure that the designTitle and designDescription does not contain malicious codes
    let designTitle_regex = new RegExp('^[a-zA-Z0-9 ,!]+$');
    let designDescription_regex = new RegExp('^[a-zA-Z0-9 ,!]+$');

    // if regex passes, then store the files in cloudinary
    if (designTitle_regex.test(designTitle) && designDescription_regex.test(designDescription)) {
        fileDataManager.uploadFile(file, async function (error, result) {
            console.log('check result variable in fileDataManager.upload code block\n', result);
            console.log('check error variable in fileDataManager.upload code block\n', error);
            let uploadResult = result;
            if (error) {
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
                let jsonResult = {
                    message: 'Unable to complete file submission'
                };
                res.status(500).json(jsonResult);
                logger.error('backend > src > controllers > userController.js Error for processDesignSubmission! Userid: ' + userId + ' Error: ' + JSON.stringify(error) + '\n')
                res.end();
            } else {
                //Update the file table inside the MySQL when the file image
                //has been saved at the cloud storage (Cloudinary)
                let imageURL = uploadResult.imageURL;
                let publicId = uploadResult.publicId;
                console.log('check uploadResult before calling createFileData in try block', uploadResult);
                try {
                    let result = await fileDataManager.createFileData(imageURL, publicId, userId, designTitle, designDescription);
                    console.log('Inspert result variable inside fileDataManager.uploadFile code');
                    console.log(result);
                    if (result) {
                        let jsonResult = {
                            message: 'File submission completed',
                            imageURL: imageURL
                        };
                        res.status(200).json(jsonResult);
                    }
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
                    logger.error('backend > src > controllers > userController.js Error for processDesignSubmission! Userid: ' + userId + ' Error: ' + JSON.stringify(error) + '\n')
                    let jsonResult = {
                        message: 'File submission failed'
                    };
                    res.status(500).json(jsonResult);
                }
            }
        })
    } else {
        // else kick the user out and throw error
        console.log("regex check for designTitle and designDescription has failed");
        const logger = createLogger({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                loggerformat
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: './Logs/Warnings.log', level: 'warn' }),
            ],
        });
        logger.warn('backend > src > controllers > userController.js Error for processDesignSubmission! User: ' + userId + ' potentially submitting harmful codes!\nDesign Title: ' + designTitle + '\nDeisgn description: ' + designDescription + '\n')
        let jsonResult = {
            message: 'Unable to upload file'
        };
        res.status(500).json(jsonResult);
    }

    // =============== End of Changes =========================

}; //End of processDesignSubmission

exports.processGetSubmissionData = async (req, res, next) => {
    console.log("==============================================================");
    console.log("userController.js > processGetSubmissionData is called and running!");
    console.log("==============================================================");

    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    var userId = req.body.userId;

    // =============== Start of Changes =========================
    // Gets the userId and then compare with the id its trying to query
    // Regardless of the ids gathered, it will only query the ids that match the token
    let decodedId = req.decodedId;
    userId = checkUserID(userId, decodedId);

    // =============== End of Changes ===========================

    try {
        let results = await fileDataManager.getFileData(userId, pageNumber, search);
        console.log('Inspect result variable inside processGetSubmissionData code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'filedata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            return res.status(200).json(jsonResult);
        }
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
        logger.error('backend > src > controllers > userController.js Error for processGetSubmissionData! Userid :' + userId + ' Error: ' + JSON.stringify(error) + '\n')

        let jsonResult = {
            message: 'Server is unable to process your request.'
        }
        return res.status(500).json(jsonResult);
    }

}; //End of processGetSubmissionData

exports.processGetSubmissionsbyEmail = async (req, res, next) => {
    console.log("=====================================================");
    console.log("userController.js > processGetSubmissionsbyEmail ");
    console.log("=====================================================");

    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.body.userId;

    let decodedId = req.decodedId;
    let decodedRole = req.decodedRole;

    // =============== Start of Changes =========================
    // regex check for search to ensure its just email

    console.log("userId " + userId);
    console.log("decodedId " + decodedId);
    if (userId != decodedId) {
        console.log("Access Denied");
        console.log("UserID not the same");

        let jsonResult = {
            message: "Forbidden"
        }

        return res.status(403).json(jsonResult);
    } else {
        try {
            if (validator.isEmail(search)) {
                try {
                    //Need to search and get the id information from the database
                    //first. The getOneuserData method accepts the userId to do the search.
                    let userData = await userManager.getOneUserDataByEmail(search);
                    console.log('Results in userData after calling getOneUserDataByEmail');
                    console.log(userData);

                    if (userData[0].user_id != decodedId && decodedRole != "admin") {
                        console.log("Access Denied");
                        console.log("UserID not the same");

                        let jsonResult = {
                            message: "Forbidden"
                        }

                        return res.status(403).json(jsonResult);
                    }

                    if (userData) {
                        let results = await fileDataManager.getFileDataByUserId(userData[0].user_id, pageNumber);
                        console.log('Inspect result variable inside processGetSubmissionsbyEmail code\n', results);
                        if (results) {
                            var jsonResult = {
                                'number_of_records': results[0].length,
                                'page_number': pageNumber,
                                'filedata': results[0],
                                'total_number_of_records': results[2][0].total_records
                            }
                            return res.status(200).json(jsonResult);
                        }//Check if there is any submission record found inside the file table
                    }//Check if there is any matching user record after searching by email
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
                    logger.error('backend > src > controllers > userController.js Error for processGetSubmissionsbyEmail! Userid :' + userId + ' Error: ' + JSON.stringify(error) + '\n')
                    let jsonResult = {
                        message: 'Server is unable to process your request.'
                    };

                    return res.status(500).json(jsonResult);
                }
            } else {
                console.log("search regex check has failed (search is not an email)");
                const logger = createLogger({
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        loggerformat
                    ),
                    transports: [
                        new transports.Console(),
                        new transports.File({ filename: './Logs/Warnings.log', level: 'warn' }),
                    ],
                });
                logger.warn('backend > src > controllers > userController.js Error for processGetSubmissionsbyEmail! User: ' + userId + ' potentially submitting harmful codes! Input:' + search + '\n')
                let jsonResult = {
                    message: 'Unable to search'
                };

                return res.status(500).json(jsonResult);
            }
        } catch (error) {
            console.log("Unable to search without email entered");

            let jsonResult = {
                message: 'Unable to search without email entered'
            }
            return res.status(500).json(jsonResult);
        }


    }



}; //End of processGetSubmissionsbyEmail




exports.processGetUserData = async (req, res, next) => {
    console.log("==============================================================");
    console.log("userController.js > processGetUserData is called and running!");
    console.log("==============================================================");
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;

    let userId = req.body.userId; //req.body.userId is retrieved from the headers as done in the previous middleware function (checkUserFn.js)
    let decodedId = req.decodedId;
    let decodedRole = req.decodedRole;

    console.log("userId: " + userId);
    console.log("decodedId: " + decodedId);

    if (userId != decodedId) {
        console.log("Access Denied");
        console.log("UserID not the same");

        let jsonResult = {
            message: "Forbidden"
        }
        return res.status(403).json(jsonResult);
    }

    if (userId == decodedId && decodedRole == "admin") {
        try {
            let results = await userManager.getUserData(pageNumber, search);
            console.log('Inspect result variable inside processGetUserData code\n', results);
            if (results) {
                var jsonResult = {
                    'number_of_records': results[0].length,
                    'page_number': pageNumber,
                    'userdata': results[0],
                    'total_number_of_records': results[2][0].total_records
                }
                return res.status(200).json(jsonResult);
            }
        } catch (error) {
            console.log("Error Occured: " + error);
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
            logger.error('backend > src > controllers > userController.js Error for processGetUserData! Error: ' + JSON.stringify(error) + '\n')
            let jsonResult = {
                message: 'Server is unable to process your request'
            }
            return res.status(500).json(jsonResult);
        }
    } else {
        console.log("Access Denied");
        console.log("User Not Admin");

        let jsonResult = {
            message: "Forbidden"
        }

        return res.status(403).json(jsonResult);
    }


}; //End of processGetUserData

exports.processGetOneUserData = async (req, res, next) => {
    console.log("==============================================================");
    console.log("userController.js > processGetOneUserData is called and running!");
    console.log("==============================================================");

    let recordId = req.params.recordId;
    console.log("recordId: " + recordId);

    try {
        let results = await userManager.getOneUserData(recordId);
        console.log('Inspect result variable inside processGetOneUserData code\n', results);
        if (results) {

            var jsonResult = {
                'userdata': results[0],
            };
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        console.log(">> " + error);
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
        logger.error('backend > src > controllers > userController.js Error for processGetOneUserData! Error: ' + JSON.stringify(error) + '\n')
        let jsonResult = {
            message: 'Server is unable to process your request'
        };

        return res.status(500).json(jsonResult);
    }

}; //End of processGetOneUserData



exports.processGetOneDesignData = async (req, res, next) => {
    console.log("==============================================================");
    console.log("userController.js > processGetOneDesignData is called and running!");
    console.log("==============================================================");

    let recordId = req.params.fileId;
    let decodedId = req.decodedId;

    try {
        let results = await userManager.getOneDesignData(recordId);
        console.log('Inspect result variable inside processGetOneFileData code\n', results);
        if (results[0].created_by_id == decodedId) {
            var result = {
                'file_id': results[0].file_id,
                'cloudinary_file_id': results[0].cloudinary_file_id,
                'cloudinary_url': results[0].cloudinary_url,
                'design_title': results[0].design_title,
                'design_description': results[0].design_description,
            };

            var jsonResult = {
                'filedata': result
            }
            return res.status(200).json(jsonResult);
        } else {
            var jsonResult = {
                message: 'Forbidden',
            };
            return res.status(403).json(jsonResult);
        }

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
        logger.error('backend > src > controllers > userController.js Error for processGetOneDesignData! Error: ' + JSON.stringify(error) + '\n')
        let jsonResult = {
            message: 'Server is unable to process the request'
        }
        return res.status(500).json(jsonResult);
    }

}; //End of processGetOneDesignData

exports.processSendInvitation = async (req, res, next) => {
    console.log("==============================================================");
    console.log("userController.js > processSendInvitation is called and running!");
    console.log("==============================================================");

    let userId = req.body.userId;
    let receipientEmail = req.body.receipientEmail;
    let receipientName = req.body.receipientName;
    console.log('Received values:');
    console.log("userId: " + userId);
    console.log("receipientEmail: " + receipientEmail);
    console.log("receipientName: " + receipientName);

    // =============== Start of Changes =========================
    let receipientName_regex = new RegExp(`^[a-zA-Z ,']+$`);

    if (validator.isEmail(receipientEmail) && receipientName_regex.test(receipientName)) {
        try {
            //Need to search and get the user's email information from the database
            //first. The getOneuserData method accepts the userId to do the search.
            let userData = await userManager.getOneUserData(userId);
            console.log(userData);
            let results = await userManager.createOneEmailInvitation(userData[0], receipientName, receipientEmail);
            if (results) {
                var jsonResult = {
                    result: 'Email invitation has been sent to ' + receipientEmail + ' ',
                }
                return res.status(200).json(jsonResult);
            }
        } catch (error) {
            console.log("--------- Error: userController.js >> processSendInvitation ----------");
            console.log(error);
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
            logger.error('backend > src > controllers > userController.js Error for processSendInvitation! Error: ' + JSON.stringify(error) + '\n')
            let jsonResult = {
                message: 'Server is unable to process the request.',
                error: error
            }
            return res.status(500).json(jsonResult);
        }
    } else {
        console.log("\nregex check for receipient name and/or email has failed");

        const logger = createLogger({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                loggerformat
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: './Logs/Warnings.log', level: 'warn' }),
            ],
        });
        logger.warn('backend > src > controllers > userController.js Error for processDesignSubmission! User: ' + userId + ' potentially submitting harmful codes! Receipient Email: ' + receipientEmail + ' Receipient Name: ' + receipientName + '\n')
        let jsonResult = {
            message: 'Receipient Name or Email is Invalid'
        };
        return res.status(500).json(jsonResult);
    }



}; //End of processSendInvitation


exports.processUpdateOneUser = async (req, res, next) => {
    console.log("==============================================================");
    console.log("userController.js > processUpdateOneUser is called and running!");
    console.log("==============================================================");

    //Collect data from the request body 
    let recordId = req.body.recordId;
    let newRoleId = req.body.roleId;

    // =============== Start of Changes =========================
    let userId = req.body.userId;
    let decodedId = req.decodedId;
    let queriedId = req.body.queryId;
    var correctRecordId = await userManager.getOneUserData(queriedId);

    // ensures that the userID is equals to the tokenID otherwise it will not complete the update
    if (userId != decodedId) {
        console.log("UserID not equals to Token ID");

        let jsonResult = {
            message: "Forbidden"
        }

        return res.status(403).json(jsonResult);
    }
    try {
        if (recordId != correctRecordId[0].user_id) {
            console.log("The IDs do not match each other");
            console.log("Changing the IDs to ensure that u are updating the right user");
            console.log("recordId: " + recordId);
            console.log("correctRecordId: " + correctRecordId[0].user_id);

            recordId = correctRecordId[0].user_id;
        }
    }
    catch (error) {
        let jsonResult = {
            message: 'Forbidden'
        };
        return res.status(403).json(jsonResult);
    }
    try {
        results = await userManager.updateUser(recordId, newRoleId);
        console.log(results);

        let jsonResult = {
            message: 'Completed update'
        };
        return res.status(200).json(jsonResult);
    } catch (error) {
        console.log('processUpdateOneUser method : catch block section code is running');
        console.log("=======================================================================");
        console.log("Error: \n" + error);
        console.log('=======================================================================');
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
        logger.error('backend > src > controllers > userController.js Error for processUpdateOneUser! Error: ' + JSON.stringify(error) + '\n')
        let jsonResult = {
            message: 'Unable to complete update operation'
        };
        return res.status(500).json(jsonResult);
    }


}; //End of processUpdateOneUser

// exports.processGetUserIDFromFileId = async (req, res, next) => {
//     console.log("==============================================================");
//     console.log("userController.js > processGetUserIDFromFileId is called and running!");
//     console.log("==============================================================");

//     let fileId = req.params.fileId;
//     let userId = req.body.userId;
//     let decodedId = req.decodedId;
//     let fileId_regex = new RegExp('^[0-9]+$');

//     if (userId != decodedId) {
//         console.log("UserID does not match TokenID");

//         let jsonResult = {
//             message: "Unauthorized Access"
//         }

//         return res.status(403).json(jsonResult);
//     }

//     if (fileId_regex.test(fileId)) {
//         try {
//             let results = await userManager.getUserIdFromFileId(fileId);
//             if (results) {

//                 // if the fileId matches the person querying it, it will send the response back successfully
//                 if (results == decodedId) {
//                     let jsonResult = {
//                         result: true
//                     };
//                     return res.status(200).json(jsonResult);
//                 } else {
//                     // if the fileId matches the person querying it, it will not return the result and instead will return an error
//                     let jsonResult = {
//                         result: false
//                     };
//                     return res.status(200).json(jsonResult);
//                 }
//             }
//         } catch (error) {
//             console.log("--------- Error: userController.js >> processGetUserIDFromFileId ----------");
//             console.log(error);

//             let jsonResult = {
//                 message: 'Server is unable to process the request.',
//                 error: error
//             }
//             return jsonResult;
//         }

//     } else {
//         console.log("regex check on fileId has failed");

//         let jsonResult = {
//             message: 'Unable to get requested information'
//         };
//         res.status(500).json(jsonResult);
//     }


// }; // End of processGetUserIDFromFileId

exports.processUpdateOneDesign = async (req, res, next) => {
    console.log("==============================================================");
    console.log("userController.js > processUpdateOneDesign is called and running!");
    console.log("==============================================================");

    //Collect data from the request body 
    let fileId = req.body.fileId;
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;

    // =============== Start of Changes =========================
    let userId = req.body.userId;
    let decodedId = req.decodedId;
    //let recordId = req.params.id;

    if (userId != decodedId) {
        console.log("UserID does not match TokenID");

        let jsonResult = {
            message: "Unable to complete update operation"
        }

        return res.status(500).json(jsonResult);
    }
    // regex check to ensure that it will not accept any unclean inputs from the user
    let dTitle_regex = new RegExp('^[a-zA-Z0-9 .]*$');
    let dDesc_regex = new RegExp('^[a-zA-Z0-9 .]*$');

    console.log("fileId: " + fileId);
    //console.log(dTitle_regex.test(designTitle));
    //console.log(dDesc_regex.test(designDescription));

    // below if check ensures that both regex is successful before updating
    if (dTitle_regex.test(designTitle) && dDesc_regex.test(designDescription)) {
        try {
            userCheck = await userManager.getOneDesignData(fileId);
            console.log("userCheck: " + userCheck[0].created_by_id);
            if (userCheck[0].created_by_id != decodedId) {
                console.log("The TokenID does not match the UserID of the file that needs updating");
                console.log("Terminating update operation");
                let jsonResult = {
                    message: 'Unable to complete update operation'
                }
                return res.status(500).json(jsonResult);
            } else {
                results = await userManager.updateDesign(fileId, designTitle, designDescription);
                console.log(results);

                let jsonResult = {
                    message: 'Completed update'
                };
                return res.status(200).json(jsonResult);
            }

        } catch (error) {
            console.log('processUpdateOneUser method : catch block section code is running');
            console.log('---------------------------------');
            console.log('Error: \n' + error);
            console.log('---------------------------------');
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
            logger.error('backend > src > controllers > userController.js Error for processUpdateOneDesign! Error: ' + JSON.stringify(error) + '\n')
            let jsonResult = {
                message: 'Unable to complete update operation'
            };
            return res.status(500).json(jsonResult);
        }
    } else {
        // else it will kick the user out and the update will not run
        console.log("regex check for update design details failed");
        const logger = createLogger({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                loggerformat
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: './Logs/Warnings.log', level: 'warn' }),
            ],
        });
        logger.warn('backend > src > controllers > userController.js Error for processDesignSubmission! User: ' + userId + ' potentially submitting harmful codes!\nDesign Title: ' + designTitle + '\nDeisgn description: ' + designDescription + '\n')
        let jsonResult = {
            message: 'Unable to complete update operation'
        }
        return res.status(500).json(jsonResult);
    }
    // =============== End of Changes =========================

}; //End of processUpdateOneDesign