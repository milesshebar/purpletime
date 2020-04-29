const express = require("express");
const request = require("request");
const fs = require("fs");
var parseString = require("xml2js").parseString;
var moment = require('moment-timezone');
moment().tz("America/New_York").format();



const options = {
  method: "GET",
  uri: process.env.KAT_FEED
};


const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

var loc = '';

function KATkml() {
  request(options, function(err, res, body) {
    if (err) throw err;
    var xml = body;

    parseString(xml,function(err, result) {
      var jsoniem = JSON.stringify(result);
      var before = moment().isBefore(moment({ hour:14, minute: 0 }));
      var after = moment().isAfter(moment({ hour:14, minute: 0 }));

      console.log(!before);
      
      result.kml.Document[0].Placemark.forEach(function (el) {
       if (after) {
        if ( el.name == '124 (MTV-Gamb Evening)') {
          var data = el.Point[0].coordinates[0];
          var split = data.split(",");
          loc = split;
          console.log(split);
          io.emit("shuttle", split);
        }       
   }

       else if ( el.name == '143 (MTV-Gamb Day)') {
          var data = el.Point[0].coordinates[0];
          var split = data.split(",");
          loc = split;

          io.emit("shuttle", split);
        }      
      });
    });
  })};



/*function KATkml() {
  request(options, function putTemp(err, res, body) {
    if (err) throw err;
    var kml = body;

    
    
    fs.writeFile(__dirname + "/public/tmp.kml", kml, err => {
      io.emit("kml", {});
    });
  });
}*/

setInterval(KATkml, 10000);

io.on('connect', onConnect);

function onConnect(socket){
  socket.emit("init", loc);
};

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
