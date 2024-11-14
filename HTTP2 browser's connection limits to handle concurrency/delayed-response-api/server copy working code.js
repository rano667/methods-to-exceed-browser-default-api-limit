const http2 = require('http2');
const fs = require('fs');
const path = require('path');

// SSL/TLS configuration for HTTP/2
const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.cert'))
};

// Create an HTTP/2 server
const server = http2.createSecureServer(serverOptions);

const handleDelayedResponse = (stream) => {
  const requestId = Math.floor(Math.random() * 10000); // Random ID for request
  const startTime = Date.now();

  // Respond with a delayed response
  setTimeout(() => {
    const endTime = Date.now();
    const delay = (endTime - startTime) / 1000; // delay in seconds

    stream.respond({
      'content-type': 'application/json',
      ':status': 200,
      'Access-Control-Allow-Origin': '*', // CORS header
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // CORS header
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', // CORS header
    });

    stream.end(JSON.stringify({
      requestId: requestId,
      message: 'This response was delayed',
      delayInSeconds: delay,
      timestamp: new Date().toISOString()
    }));
  }, 3000);
};

// Handle incoming streams
server.on('stream', (stream, headers) => {
  const { ':path': path } = headers;

  // Handle preflight OPTIONS requests for CORS
  if (headers[':method'] === 'OPTIONS') {
    stream.respond({
      ':status': 204,
      'Access-Control-Allow-Origin': '*', // CORS header
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // CORS header
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', // CORS header
    });
    stream.end();
    return;
  }

  if (path === '/delayed-response') {
    handleDelayedResponse(stream);
  } else {
    stream.respond({
      'content-type': 'text/plain',
      ':status': 404,
      'Access-Control-Allow-Origin': '*', // CORS header
    });
    stream.end('Not Found');
  }
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Start the HTTP/2 server
const port = 4000;
server.listen(port, () => {
  console.log(`HTTP/2 Server is running on https://localhost:${port}`);
});
