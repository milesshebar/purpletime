const express = require("express");
const request = require("request");
const fs = require("fs");

const options = {
  method: "GET",
  uri: process.env.KAT_FEED
};

const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

function KATkml() {
  request(options, function putTemp(err, res, body) {
    if (err) throw err;
    var kml = body;
    fs.writeFile(__dirname + "/public/tmp.kml", kml, err => {
    io.emit("kml", {});
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
