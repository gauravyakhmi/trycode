var express = require('express');
var http = require('http');
var reload = require('reload');
var app = express();


console.log(`listening to port ${process.env.PORT || 3000}`);
http.createServer(function (req, res) {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');

}).listen(process.env.PORT || 3000);
