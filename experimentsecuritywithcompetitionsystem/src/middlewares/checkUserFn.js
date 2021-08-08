module.exports.getClientUserId = (req, res, next) => {
    console.log("==============================================================");
    console.log("checkUserFn.js is called and running!");
    console.log("==============================================================");

    console.log('http header - user ', req.headers['user']);
    req.body.userId = req.headers['user'];
    console.log('Inspect user id which is planted inside the request header : ', req.body.userId);
    if (req.body.userId != null) {
        //console.log(":) Here!");
        next()
        return;
    } else {

        //console.log("Here!");

        let jsonResult = {
            message: 'Unauthorized access'
        }
        res.status(403).json(jsonResult);
        return;
    }

} //End of getClientUserId