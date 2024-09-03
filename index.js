const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const port = 3000;


const serveStaticFile = (filePath, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      res.end(data);
    }
  });
};


const getContentType = (filePath) => {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    default:
      return 'text/plain';
  }
};


const requestListener = (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    serveStaticFile(path.join(__dirname, 'public', 'index.html'), res);
  } else if (req.method === 'POST' && req.url === '/ping') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { url } = JSON.parse(body);
      const start = Date.now();

      const protocol = url.startsWith('https') ? https : http;

      protocol
        .get(url, (response) => {
          const responseTime = Date.now() - start;

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              url,
              status: response.statusCode === 200 || response.statusCode === 302 ? 'UP' : 'DOWN',
              responseTime: `${responseTime} ms`,
              lastRefreshedTime: new Date().toLocaleString(),
            })
          );
        })
        .on('error', (error) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              url,
              status: 'DOWN',
              responseTime: 'N/A',
              lastRefreshedTime: new Date().toLocaleString(),
            })
          );
        });
    });
  } else {
    
    const filePath = path.join(__dirname, 'public', req.url);
    serveStaticFile(filePath, res);
  }
};


const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
