// Import Libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');

const port = process.env.PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }

  console.log(`Connected to database at port: ${dbURL}`);
});

// Get router
const router = require('./router.js');

// Create express app
const app = express();

// Establish assets folder
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

// Handle favicon
app.use(favicon(path.resolve(`${__dirname}/../hosted/img/favicon.png`)));

// Set compression
app.use(compression());

app.use(bodyParser.urlencoded({
  extended: true,
}));

// Set template engine
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
