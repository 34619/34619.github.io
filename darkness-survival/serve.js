// Darkness Survival — Dev Server (proper UTF-8 encoding)
// Usage: node serve.js [port]
var http = require('http');
var fs = require('fs');
var path = require('path');
var port = parseInt(process.argv[2]) || 8080;
var ROOT = path.join(__dirname);
var MIME = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
http.createServer(function(req, res) {
  var url = req.url.split('?')[0];
  if (url === '/') url = '/game.html';
  var filePath = path.join(ROOT, url);
  fs.readFile(filePath, function(err, data) {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    var ext = path.extname(filePath);
    var mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type': mime + '; charset=utf-8'});
    res.end(data);
  });
}).listen(port, '127.0.0.1', function() {
  console.log('Darkness Survival running at http://127.0.0.1:' + port + '/');
});
