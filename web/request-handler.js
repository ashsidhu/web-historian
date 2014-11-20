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
  },
  getArchivedSite: function(req, res, fileType) {
    fileType = fileType || path.extname(req.url);
    httpHelpers.serveArchived(res, req.url, function (err, data) {
      if (err) throw err;
      res.setHeader("Content-Type", staticExt[fileType]);
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
  if (req.method === "GET") {
    if (req.url === '/') {
      req.url = '/index.html';
    }

    if (staticExt[path.extname(req.url)]) {
      routes.staticHandler(req, res);
    }
  } else if (req.method === "POST") {
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      data = data.slice(4);
      var theHtml;
      archive.eventEmitter.once('urlFound', function() {
        theHtml = '/' + data;
        req.url = theHtml;
        routes.getArchivedSite(req, res, '.html');
        archive.eventEmitter.removeAllListeners('urlNotFound');
      });
      archive.eventEmitter.once('urlNotFound', function() {
        archive.addUrlToList(data);
        req.url = '/loading.html';
        routes.staticHandler(req, res);
        archive.eventEmitter.removeAllListeners('urlFound');
      });
      archive.isUrlInList(data);

    });
  }

  // res.end(archive.paths.list);
};
