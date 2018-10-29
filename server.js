const serveStatic = require('serve-static');
const express = require('express');
const path = require('path');

// init server
const app = express();

const port = 9900;
const appPath = path.normalize(`${__dirname}/app`);

app.use(serveStatic(appPath));

app.listen(port, () => {
    console.log(`Developing app listening on 109.123.120.200: ${port}!`);
});


