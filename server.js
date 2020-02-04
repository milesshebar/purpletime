// server.js
// where your node app starts

// init project
const express = require("express");
const request = require("request");
const tj = require("@tmcw/togeojson");
const fs = require("fs");


const options = {
  method: 'GET',
  uri: 'http://knox.ecolane.com/mde.php?q=vehicle_live'
}
const DOMParser = require("xmldom").DOMParser;

request('http://knox.ecolane.com/mde.php?q=vehicle_live', { json: false }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
});


const app = express();

// node doesn't have xml parsing or a dom. use xmldom



const kml = new DOMParser().parseFromString();
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

