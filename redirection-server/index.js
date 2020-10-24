const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const redirect = require('./middlewares/redirect');
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/fark';
const PORT = 5000;
const app = express();
/**
 *
 * Handles the redirection request from short url to long url
 * If hash is found then it redirects
 * Otherwise sends a 404 error
 */
app.get(/^\/[a-zA-Z0-9]{4,16}$/, redirect);
// Connect to mongodb
mongoose
    .connect(MONGODB_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      // start the App server
      // eslint-disable-next-line no-console
      console.log('Connected to mongodb!');
      // eslint-disable-next-line no-console
      app.listen(PORT, () => console.log(`Listening on port ${PORT} to redirection server `));
    })
    .catch((err) => {
      // If not connected, exit the process
      // eslint-disable-next-line no-console
      console.log('Error while connecting to mongodb: ', err);
      process.exit(1);
    });
