var Hapi = require('hapi');
var Promise = require('promise');
var Path = require('path');
var PassThrough = require('stream').PassThrough;

var server = new Hapi.Server();
server.connection({ port: 3000 });
server.views({
  engines: { html: require('hapi-dust') },
  path: Path.join(__dirname, 'views')
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    var deferredThing = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve("Delayed part");
      }, 5000);
    });

    reply.view('index', {body: deferredThing});
  }
});

server.route({
  method: 'GET',
  path: '/stream',
  handler: function(request, reply) {
    var stream = new PassThrough();

    stream.push('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Streaming Template Test</title>\n<script async src="http://code.jquery.com/jquery-1.11.3.min.js" type="text/javascript"></script>\n</head>\n\n<body>\n<p>First part</p>\n<p>');
    setTimeout(function() {
      stream.push("Delayed part\n");
    }, 2000);
    setTimeout(function() {
      stream.push('</p></body></html>');
      stream.push(null);
    }, 5000);

    reply(stream).type('text/html');
  }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
