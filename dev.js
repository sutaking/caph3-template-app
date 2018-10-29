const path = require('path');
const minimist = require('minimist');

const cli = require('tizen-tv-dev-cli');

const args = minimist(process.argv.slice(2));

// const value
const argv = args._[0];
const appPath = path.normalize(`${__dirname}/app`);

(function(){
    console.log(`arg: ${argv}`);
    console.log(appPath);

    switch(argv) {
        case 'build':
            cli.buildPackage.handleCommand(appPath, '.wgt');
            break;
        case 'launch':
            cli.launchTarget.handleCommand('109.123.121.93', appPath, '.wgt')
            break;
        default:
            break;
    }

})()










