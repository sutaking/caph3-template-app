const path = require('path');
const minimist = require('minimist');

const cli = require('tizen-tv-dev-cli');

const args = minimist(process.argv.slice(2));

// const value
const appName = process.env.npm_package_config_path;
const argv = args._[0];
const appPath = path.normalize(`${__dirname}/${appName}`);


(function(){

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

})();










