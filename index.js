'use strict';

var WEB = process.env.WEB || "http://localhost:3020",
    PORT = process.env.PORT || 3020;

var cluster,
    app;

cluster = require("cluster");
app = require("./inventory-service");

var workers = {};
var count = require("os").cpus().length;

function spawn (i) {
    var worker;
    console.log("spawn on cpu " + i);
    worker = cluster.fork();
    workers[worker.pid] = worker;
    return worker;
}

if (cluster.isMaster) {
    for (var i = 0; i < count; i++) {
        spawn (i);
    }
    cluster.on("exit", function (worker) {
        var pid = worker.pid;
        console.log("worker " + pid + " died. Spawning a new process...");
        delete workers[pid];
        spawn();
    });
} else {
    app.listen(PORT);
    console.log("Inventory Service started on port " + PORT);
}