// server.js
// where your node app starts

// init project
const express = require("express");
const request = require("request");

const app = express();

const tj = require("@tmcw/togeojson");
const fs = require("fs");
// node doesn't have xml parsing or a dom. use xmldom
const DOMParser = require("xmldom").DOMParser;

const kml = new DOMParser().parseFromString(request('http://www.google.com', function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
);
console.log(kml);
const converted = tj.kml(kml);

const convertedWithStyles = tj.kml(kml, { styles: true });

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});



// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

