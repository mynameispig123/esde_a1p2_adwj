const express = require("express");
const cors = require('cors')
const config = require('./src/config/config');
const formData = require('express-form-data');
//const dummyUserFn = require('./src/middlewares/dummyUserFn');
const express_enforces_ssl = require('express-enforces-ssl');
const hsts = require('hsts');

let app = express();
app.use('*', cors());

//Server Settings
const https = require('https');
const fs = require('fs');
const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
};
const PORT = 5000;
https
    .createServer(options, app)
    .listen({ port: 5000 }, (err) => {
        if (err) return console.log(`Cannot Listen on PORT: ${PORT}`);
        console.log(`Server is Listening on: https://localhost:${PORT}/`);
    });

const path = require("path");
const bodyParser = require("body-parser");
const bootstrap = require("./src/bootstrap");

//https://github.com/ortexx/express-form-data#readme
app.use(hsts({
    maxAge: 31536000,
    includeSubDomains: true
}));

app.enable('trust proxy');

app.use(express_enforces_ssl());



//Parse data with connect-multiparty. 
app.use(formData.parse({}));
//Delete from the request all empty files (size == 0)
app.use(formData.format());
//Change the file objects to fs.ReadStream 
app.use(formData.stream());
//Union the body and the files
app.use(formData.union());

//Pug Template Engine
app.set("view engine", "pug");
app.set("views", path.resolve("./src/views"));

//Request Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Not using the following because the client side will be using
//formdata technique to send data. This is due to the web application
//has file submission functionality.
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));


//Express Router
const router = express.Router();
app.use(router);
const rootPath = path.resolve("./dist");

//All client side files are parked inside the dist directory.
//The client side files are compiled by using Gulp
//The actual code files which developers edit is at /src/assets
app.use(express.static(rootPath));
//Applied this middleware function to supply dummy user id for testing
//when I have not prepared the login functionality.
//router.use(dummyUserFn.useDummyUserForTesting); 
bootstrap(app, router);

//Index Page (Home public page)
router.get('/', (req, res, next) => {
    res.send('<html><title>Backend API system for experimenting security concept</title><body>This project provides only backend API support</body></html>');
    res.end();
});

router.use((err, req, res, next) => {
    if (err) {
        //Handle file type and max size of image
        return res.send(err.message);
    }
});





// app.listen(PORT, err => {
//     if (err) return console.log(`Cannot Listen on PORT: ${PORT}`);
//     console.log(`Server is Listening on: http://localhost:${PORT}/`);
// });
