const cli = require('tizen-tv-dev-cli');
const path = require('path');

//console.log(cli)
console.log(path.normalize(`${__dirname}/app`));

//cli.buildPackage.handleCommand(`${__dirname}/app`);

cli.launchTarget.handleCommand('109.123.121.93', `${__dirname}/app`)









