const cli = require('tizen-tv-dev-cli');
const path = require('path');

console.log(cli)
console.log(path.normalize('/app'));

//cli.buildPackage.handleCommand('./app');