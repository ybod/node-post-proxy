'use strict'
const fs = require('fs');
const path = require('path');

// Saves body of the received request into a file inside a temp. directory
// Returns previously cached content if any
function processRequest(reqUrl, reqBody, tmpPath) {
  const filePath = generatePathFromUrl(reqUrl);

  return processFile(path.join(tmpPath, filePath), reqBody);
}

// Generates a path string for a cache file based on request url path
// All non-latin letters and digits are replaced with '_'
function generatePathFromUrl(pathString) {
  const filePath = [];

  pathString
    .split(path.sep)
    .forEach(part => {
      const correctedPart = part.trim().toLowerCase().replace(/\W/g, '_');
      if(correctedPart != '') {
        filePath.push(correctedPart);
      }
    });

  return path.sep + filePath.join(path.sep) + '.node-proxy.cache';
}

// Checks for a cache file: if the file is found, returns file content and replace it with the new body content
// If file is not found - creates new file with given body content on a given path
function processFile(filePath, reqBody) {
  let cachedData = '';

  try {
    cachedData = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    mkDir(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, reqBody, 'utf8');
  return cachedData;
}

// Creates a set of nested directories according to a provided path string
function mkDir(dir) {
  try {
    fs.mkdirSync(dir);
  } catch (err) {
    if (err.code == 'ENOENT') {
      mkDir(path.dirname(dir));
      mkDir(dir);
    }
  }
}

module.exports.processRequest = processRequest;
module.exports.generatePathFromUrl = generatePathFromUrl;
module.exports.mkDir = mkDir;
module.exports.processFile = processFile;
