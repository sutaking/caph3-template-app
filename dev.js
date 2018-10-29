const path = require('path');
const minimist = require('minimist');
const serveStatic = require('serve-static');
const express = require('express');

const cli = require('tizen-tv-dev-cli');

const args = minimist(process.argv.slice(2));

// init server
const app = express();


// const value
const argv = args._[0];
const appPath = path.normalize(`${__dirname}/app`);
const port = 9900;

app.use(serveStatic(appPath));

(function(){
    console.log(`arg: ${argv}`);
    console.log(appPath);

    switch(argv) {
        case 'build':
            cli.buildPackage.handleCommand(appPath);
            break;
        case 'launch':
            cli.launchTarget.handleCommand('109.123.121.93', appPath)
            break;
        default:
            break;
    }

})()


app.listen(port, () => {
    console.log(`Developing app listening on 109.123.120.200: ${port}!`);
});







