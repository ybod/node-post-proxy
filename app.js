'use strict'
const http = require('http');
//const proxy = require('./proxy')

const PORT = 52000;

function handleRequest(request, response){
  if (request.method == 'POST') {
    const url = request.url;
    const data = [];

    request
      .on('error', err => console.error(err))
      .on('data', chunk => data.push(chunk))
      .on('end', () => {
        const body = Buffer.concat(data).toString();

        response.writeHead(200, {
          'Content-Length': Buffer.byteLength(body),
          'Content-Type': 'text/plain' }
        );

        response.end(body);
      });


  } else {
    const errMsg = 'Only POST requests can be processed by this App!';

    response.writeHead(405, {
      'Allow': 'POST',
      'Content-Length': Buffer.byteLength(errMsg),
      'Content-Type': 'text/plain' }
    );

    response.end(errMsg);
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, function(){
  console.log("Server listening on: http://localhost:%s", PORT);
});
