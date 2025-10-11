//webserver.js
//load module http
var http = require('http');
//create a new instance of http.Server 
//Reference https://nodejs.org/api/http.html#http_http_createserver_options_requestlistener
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(8000);

console.log('Server running on port 8000.');