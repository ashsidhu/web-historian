var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var events = require('events');
exports.eventEmitter = eventEmitter = new events.EventEmitter();

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(){
  var myStream = fs.createReadStream(paths.list);
  var data = "";
  myStream.addListener('data', function(chunk) {
    data += chunk;
  });
  myStream.on('end', function() {
    data = data.split("\n");
    data.forEach(function(url) {
      isURLArchived(url);
    });
  });
};

exports.isUrlInList = function(url){
  var myStream = fs.createReadStream(paths.list);
  var data = "";
  myStream.addListener('data', function(chunk) {
    data += chunk;
  });
  myStream.on('end', function() {
    data = data.split("\n");
    if (data.indexOf(url) > -1) {
      eventEmitter.emit('urlFound');
    } else {
       eventEmitter.emit('urlNotFound');
    }
  });
};

exports.addUrlToList = function(theUrl){
  fs.appendFile(paths.list, '\n' + theUrl, function(err) {
    if (err) throw err;
    console.log('added to list');
  });
};

exports.isURLArchived = function(theUrl){
  fs.exists((paths.archivedSites + theUrl), function(exists) {
    if (!exists) {
      downloadUrl(theUrl);
    }
  });

};

exports.downloadUrl = function(theUrl){
  //saves the html into sites/theUrl
};
