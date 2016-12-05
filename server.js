let http = require('http'),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime');

http.createServer((req, res) => {
  // console.log(req.url);
  let filePath = false,
      absPath = false;

  switch (req.url) {
    case '/':
      filePath = 'public/index.html';
      break;
    case '/company':
      filePath = 'public/company.html';
      break;
    default:
      filePath = 'public' + req.url;
  }

  absPath = './' + filePath;

  serverStatic(res, absPath);

  // console.log(filePath);

}).listen(3000, () => {
  console.log('Server has started on port 3000...');
});

function serverStatic (res, absPath) {
  fs.exists(absPath, (exists) => {
    if (exists) {
      fs.readFile(absPath, (err, data) => {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end('Error 404: resource not found');
        } else {
          res.writeHead(200, {'Content-Type': mime.lookup(path.basename(absPath))});
          res.end(data);
        }
      });
    }
  });
}
