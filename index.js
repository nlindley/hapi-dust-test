var Hapi = require('hapi');
var Promise = require('promise');
var Path = require('path');

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
        resolve("WOAH!!!");
      }, 10000);
    });

    reply.view('index', {body: deferredThing});
  }
});


server.start(function () {
    console.log('Server running at:', server.info.uri);
});
