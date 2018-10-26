const cli = require('tizen-tv-dev-cli');
const path = require('path');

//console.log(cli)
console.log(path.normalize(`${__dirname}/app`));

cli.buildPackage.handleCommand(`${__dirname}/app`);











