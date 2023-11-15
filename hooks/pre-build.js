const fs = require('fs-extra');
const jsonConcat = require('json-concat');
const encryptConfigFiles = require('./encrypt-config');

function mergeAndSaveJsonFiles(rootPth, dest) {
    fs.readdir(rootPth, (err, files) => {
        const localizationSourceFiles = files;
        const src = localizationSourceFiles.map((x) => rootPth + x);
        jsonConcat({ src: src, dest: dest }, function (res) {});
    });
}

// Merge all localization files into one
mergeAndSaveJsonFiles('./i18n/en/', './i18n/en.json');
mergeAndSaveJsonFiles('./i18n/ar/', './i18n/ar.json');
encryptConfigFiles('./config/', './config_encrypted/');
