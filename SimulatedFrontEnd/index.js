const express = require('express');
const serveStatic = require('serve-static');
const app = express();

var hostname = "52.54.247.200";
var port = 3001;


const https = require('https');
const fs = require('fs');
const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
};

app.use(serveStatic(__dirname + "/public"));

https
    .createServer(options, app)
    .listen({ port: 3001 }, (err) => {
        if (err) return console.log(`Cannot Listen on PORT: ${PORT}`);
        console.log(`Server hosted at https://${hostname}:${port}`);
    });


app.use(function (req, res, next) {
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);
    //Checking the incoming request type from the client
    if (req.method != "GET") {
        res.type('.html');
        var msg = '<html><body>This server only serves web pages with GET request</body></html>';
        res.end(msg);
    } else {
        next();
    }
});

app.use((req, res, next) => {
    console.log("============================================");
    console.log("Inspecting request protocol...");
    console.log("============================================");

    if (req.secure) {
        console.log("Request protocol is: " + req.protocol);
        console.log("Proceeding...");
        next();
    } else {
        console.log("Request protocol is: " + req.protocol);
        console.log("Redirecting to https...");
        res.redirect('https://' + req.headers.host + req.url);
    }
});

app.get("/", (req, res) => {
    res.sendFile("/public/home.html", { root: __dirname });
});




// const express = require('express');
// const serveStatic = require('serve-static');


// var hostname = "localhost";
// var port = 3001;


// var app = express();

// // const http = require('http');
// // const https = require('https');
// const fs = require('fs');

// const options = {
//     key: fs.readFileSync('../localhost-key.pem'),
//     cert: fs.readFileSync('../localhost.pem'),
// };


// app.use(function (req, res, next) {
//     console.log(req.url);
//     console.log(req.method);
//     console.log(req.path);
//     console.log(req.query.id);
//     //Checking the incoming request type from the client
//     if (req.method != "GET") {
//         res.type('.html');
//         var msg = '<html><body>This server only serves web pages with GET request</body></html>';
//         res.end(msg);
//     } else {
//         next();
//     }
// });

// app.enable('trust proxy');

// app.use((req, res, next) => {
//     console.log("============================================");
//     console.log("Inspecting request protocol...");
//     console.log("============================================");

//     if (req.secure) {
//         console.log("Request protocol is: " + req.protocol);
//         console.log("Proceeding...");
//         next();
//     } else {
//         console.log("Request protocol is: " + req.protocol);
//         console.log("Redirecting to https...");
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });

// app.use(express.static(__dirname + "/public"));

// var server = app.listen(port, () => {
//     options;
//     console.log('Server Listening on port', server.address().port);
// });

// // app.listen(port, hostname, function () {
//     //     console.log(`Server hosted at https://${hostname}:${port}`);
//     // });

//     // app.use(serveStatic(__dirname + "/public"));

// app.get("/", (req, res) => {
//     res.sendFile("/public/home.html", { root: __dirname });
// });
