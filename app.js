'use strict'
const http = require('http');
const config = require('./config');
const proxy = require('./proxy');

function handleRequest(request, response){
  if (request.method == 'POST') {
    const url = request.url;
    const data = [];

    request
      .on('error', err => console.error(err))
      .on('data', chunk => data.push(chunk))
      .on('end', () => {
        const responseBody = proxy.processRequest(url, Buffer.concat(data).toString(), config.tmp);

        response.writeHead(200, {
          'Content-Length': Buffer.byteLength(responseBody),
          'Content-Type': 'text/plain' }
        );

        response.end(responseBody);
      });
  } else {
    const errMsg = 'Only POST request can be processed by this App!';

    response.writeHead(405, {
      'Allow': 'POST',
      'Content-Length': Buffer.byteLength(errMsg),
      'Content-Type': 'text/plain' }
    );

    response.end(errMsg);
  }
}

const server = http.createServer(handleRequest);

server.listen(config.port, function(){
  console.log(`Server listening on: http://localhost:${config.port}`);
});
