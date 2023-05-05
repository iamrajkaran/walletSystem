require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { client, } = require('./database/mongoDb/setup');
const router = require('./router');
const config = require('./config.js');

const port = config.port || 8080; // port number of app

const corsOptions = {
    origin: config.UI_APP,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
app.set('mongoClient', client);

router.createRouter(app);

// *****************************************************************
// start the server
// *****************************************************************

app.listen(port);
console.log('Server runs at http://localhost:' + port);
