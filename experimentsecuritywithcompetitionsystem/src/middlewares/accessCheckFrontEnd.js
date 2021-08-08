module.exports.accessCheckFrontEnd = (req, res, next) => {
    // If this middleware function is called, it will pass the data that was stored previously
    // back to the FrontEnd.

    // This module is just a lightweight module that passes the information back to FrontEnd and
    // nothing else
    console.log("=============================================");
    console.log("accessCheckFrontEnd.js is called and running!");
    console.log("=============================================");
    console.log("");

    //console.log("req.decodedId: " + req.decodedId);
    //console.log("req.decodedRole: " + req.decodedRole);

    var sendBack = {
        'userId': req.decodedId,
        'userRole': req.decodedRole
    };

    res.status(200).json(sendBack);

} //End of accessCheckFrontEnd