// server.js
// where your node app starts

// init project
const express = require("express");
var parseString = require('xml2js').parseString;
const request = require("request");
const tj = require("@tmcw/togeojson");
const fs = require("fs");
const DOMParser = require("xmldom").DOMParser;



const options = {
  method: 'GET',
  uri: 'http://knox.ecolane.com/mde.php?q=vehicle_live'
}

var location = request(options, function(err, res, body) {
  if (err) { return console.log(err); }
  var xml = body;  
  parseString(xml, function (err, result) {
        const json = JSON.stringify(result);
    console.log(json.kml.Document.0.Placemark.);
});

});



const app = express();



// node doesn't have xml parsing or a dom. use xmldom



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

