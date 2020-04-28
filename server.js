const express = require("express");
const request = require("request");
const fs = require("fs");
var parseString = require("xml2js").parseString;

const options = {
  method: "GET",
  uri: process.env.KAT_FEED
};


const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

function KATkml() {
  request(options, function(err, res, body) {
    if (err) throw err;
    var xml = body;

    parseString(xml,function(err, result) {
      var jsoniem = JSON.stringify(result);
      result.kml.Document[0].Placemark.forEach(function (el) {
        if (el.name == '124 (MTV-Gamb Evening)' /*||  el.name == '143 (MTV-Gamb Day)'*/) {
          var data = el.Point[0].coordinates[0];
          var split = data.split(",");
//          var x = split[0];
  //        var y = split[1];
          console.log(split);
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

io.on("connection", function(socket) {
  socket.emit("kml", {});
});

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
