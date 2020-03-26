// init project
const express = require("express");
var parseString = require("xml2js").parseString;
const request = require("request");
const tj = require("@tmcw/togeojson");
const fs = require("fs");
const util = require('util')
const DOMParser = require("xmldom").DOMParser;

const options = {
  method: "GET",
  uri: "http://knox.ecolane.com/mde.php?q=vehicle_live"
};

var KATkml = request(options, function(err, res, body) {
  if (err) {
    return console.log(err);
  }
  var kml = body;
  
  return kml;
  /*parseString(kml, function(err, result) {
    console.log(result);
    console.log(result.kml.Document[0].Placemark[16].Point[0].coordinates[0]);
    
    return result;
  });*/
});

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
  socket.emit('kml', { kml: KATkml });
});


app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// Send current time to all connected clients
function sendTime() {
    io.emit('kml', { kml: KATkml });
    console.log("emitting");
}

// Send current time every 10 secs
setInterval(sendTime, 20000);

http.listen(3000, function(){
  console.log('listening on *:3100');
});

