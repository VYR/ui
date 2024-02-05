const chokidar = require('chokidar');
const fs = require('fs');

const { mergeAndSaveJsonFiles } = require('./pre-start');
// One-liner for current directory
chokidar.watch(['../i18n/en']).on('change', (path) => {});
