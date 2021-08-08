const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { send } = require('process');
const { json } = require('body-parser');
module.exports.checkForValidUserRoleUser = (req, res, next) => {
    console.log("==============================================================");
    console.log("checkUserFnSolution.js is called and running!");
    console.log("==============================================================");

    //If the token is valid, the logic extracts the user id and the role information.
    //If the role is not user, then response 403 UnAuthorized
    //The user id information is inserted into the request.body.userId
    console.log('http header - user: ', req.headers['user']);
    if (typeof req.headers.authorization !== "undefined") {
        // Retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(' ')[1];
        //console.log('Check for received token from frontend : \n');
        //console.log(token);
        jwt.verify(token, config.JWTKey, (err, data) => {
            console.log('data extracted from token \n', data);
            if (err) {
                console.log(err);

                let jsonResult = {
                    message: 'Unauthorized access'
                };
                return res.status(403).send(jsonResult);
            }
            else {
                // console.log("----------------------------------");
                // console.log("data id: " + data.id);
                // console.log("data uRole: " + data.uRole);
                // console.log("----------------------------------");
                
                req.decodedId = data.id;
                req.decodedRole = data.uRole
                
                // console.log("\n----------------------------------");
                // console.log("req.decodedId: " + req.decodedId);
                // console.log("req.decodedRole: " + req.decodedRole);
                // console.log("----------------------------------");
                next();
            }
        })

    } else {
        console.log("here!!!!");
        var jsonResult = {
            message: 'Unauthorized access'
        };
        res.status(403).send(jsonResult);

    }
} //End of checkForValidUserRoleUser