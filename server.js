var http = require('http');

console.log(`listening to port ${process.env.PORT || 3000}`);
http.createServer(function (req, res) {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');

}).listen(process.env.PORT || 3000);
