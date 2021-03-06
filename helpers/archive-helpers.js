var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var events = require('events');
var httpRequest = require('http-request');

exports.eventEmitter = eventEmitter = new events.EventEmitter();

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = paths = {
  'siteAssets' : '/Users/student/2014-10-web-historian/web/public',
  // path.join(__dirname, '../web/public'),
  'archivedSites' : '/Users/student/2014-10-web-historian/archives/sites',
  // path.join(__dirname, '../archives/sites'),
  'list' : '/Users/student/2014-10-web-historian/archives/sites.txt'
  //path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = readListOfUrls = function(callback){
  var defaultCb = function(url) {
    isURLArchived(url, function(exists) {
      if (!exists) {
        downloadUrl(url);
      }
    });
  };
  callback = callback || defaultCb;
  var myStream = fs.createReadStream(paths.list);
  var data = "";
  myStream.addListener('data', function(chunk) {
    data += chunk;
  });
  myStream.on('end', function() {
    data = data.split("\n");
    data.forEach(callback);
  });
};

exports.isUrlInList = isUrlInList = function(url, callback){
  var defaultCb = function (inList) {
    if (inList) {
      isURLArchived(url, function(isArchived) {
        if (isArchived) {
          eventEmitter.emit('urlFound');
        } else {
          eventEmitter.emit('urlNotFound');
        }
      });
    } else {
       eventEmitter.emit('urlNotFound');
    }
  };
  callback = callback || defaultCb;

  var myStream = fs.createReadStream(paths.list);
  var data = "";

  myStream.addListener('data', function(chunk) {
    data += chunk;
  });
  myStream.on('end', function() {
    data = data.split("\n");
    callback(data.indexOf(url) > -1);
  });
};

// exports.isUrlInSitesList = isUrlInSitesList = function(url, callback) {
//   readListOfUrls(function (currentUrl) {

//   });
// };


exports.addUrlToList = addUrlToList = function(theUrl){
  fs.appendFile(paths.list, '\n' + theUrl, function(err) {
    if (err) throw err;
    console.log('added to list');
  });
};

exports.isURLArchived = isURLArchived = function(theUrl, callback){
  fs.exists((paths.archivedSites + "/" + theUrl), function (exists){
    console.log(theUrl, exists);
  });
  fs.exists((paths.archivedSites + "/" + theUrl), callback);

};

exports.downloadUrl = downloadUrl = function(theUrl){
  //saves the html into sites/theUrl
  httpRequest.get(theUrl, function (err, res) {
    if (err) throw err;
    data = res.buffer.toString();
    console.log(res.code, res.headers);
    fs.writeFile(paths.archivedSites + '/' + theUrl, data, function (err) {
      if (err) throw err;
      console.log('file written successfully');
    });
  });
};
