const express = require("express");
const request = require("request");
const tj = require("@tmcw/togeojson");
const fs = require("fs");
const util = require("util");
const DOMParser = require("xmldom").DOMParser;

const options = {
  method: "GET",
  uri: "https://knox.ecolane.com/mde.php?q=vehicle_live"
};

const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

function KATkml() {
  request(options, function putTemp(err, res, body) {
    if (err) {
      throw err;
    }
    var kml = body;
    fs.writeFile(__dirname + "/public/tmp.kml", kml, err => {
      // throws an error, you could also catch it here
      if (err) throw err;
      io.emit("kml", {});
      // success case, the file was saved
      console.log("saved!");
    });
  });
}

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
