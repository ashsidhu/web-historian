var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require('./http-helpers');



var routes = {
  staticHandler: function(req, res) {
    httpHelpers.serveAssets(res, req.url, function (err, data) {
      if (err) throw err;
      res.setHeader("Content-Type", staticExt[path.extname(req.url)]);
      res.writeHead(200, httpHelpers.headers);
      res.end(data);
    });
  }
};

var staticExt = {
  '.html': "text/html",
  '.css': "text/css"
};

exports.handleRequest = function (req, res) {
  if (req.url === '/') {
    req.url = '/index.html';
  }

  if (staticExt[path.extname(req.url)]) {
    routes.staticHandler(req, res);
  }

  // res.end(archive.paths.list);
};
