const fs = require('fs');
const path = require('path');

function ensureDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJSON(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    if (!fileContents.trim()) {
      return fallback;
    }
    return JSON.parse(fileContents);
  } catch (error) {
    return fallback;
  }
}

function writeJSON(filePath, data) {
  ensureDirectory(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function ensureJSON(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    writeJSON(filePath, defaultValue);
  }
}

module.exports = {
  readJSON,
  writeJSON,
  ensureJSON,
};
