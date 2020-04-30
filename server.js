const express = require("express");
const request = require("request");
const fs = require("fs");
var parseString = require("xml2js").parseString;
var moment = require("moment-timezone");

//console.log("Currrent timezone: "); console.log(moment().tz());
//console.log("Current time: "); console.log(moment().format());
//console.log("Updating timezone: ");
moment.tz.setDefault("America/New_York");
//console.log("Current time: "); console.log(moment().format());
//console.log("Currrent timezone after updating: "); console.log(moment().tz());

const options = {
  method: "GET",
  uri: process.env.KAT_FEED
};

const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

var loc = "";

function KATkml() {
  request(options, function(err, res, body) {
    if (err) throw err;
    var xml = body;

    parseString(xml, function(err, result) {
      var jsoniem = JSON.stringify(result);
      var divider = moment({ hour: 14, minute: 0 });

      var after = moment().isAfter(divider);

      console.log("after " + after);

      result.kml.Document[0].Placemark.forEach(function(el) {
        if (after && el.name == "124 (MTV-Gamb Evening)") {
          var data = el.Point[0].coordinates[0];
          var split = data.split(",");
          loc = split;
          io.emit("shuttle", split);
        }

        if (!after && el.name == "143 (MTV-Gamb Day)") {
          var data = el.Point[0].coordinates[0];
          var split = data.split(",");
          loc = split;
          console.log(moment());
          io.emit("shuttle", split);
        }
      });
    });
  });
}

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

io.on("connect", onConnect);

function onConnect(socket) {
  socket.emit("init", loc);
}

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
