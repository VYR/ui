const fs = require('fs-extra');

function setEnvironment(configPath, environment) {
    fs.writeJson(configPath, { env: environment }, function () {
        console.info(`environment has been set to UAT`);
    });
}

// Set environment to development
setEnvironment('./config/env.json', 'uat');
