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

    stream.push("First chunk\n");
    setTimeout(function() {
      stream.push("Second chunk\n");
    }, 2000);
    setTimeout(function() {
      stream.push("Third chunk\n");
      stream.push(null);
    }, 5000);

    reply(stream);
  }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
