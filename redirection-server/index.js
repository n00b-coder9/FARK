const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Url = require('./models/Url');
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
app.get(/^\/[a-zA-Z0-9]{4,16}$/, (req, res) => {
  // Get the hash
  const hash = req.url.slice(1);
  /**
     * Check whether current Url is present in the database or not
     * If yes , then redirect the user
     * Otherwise , send a 404
     */

  return Url.findOne({ shortUrl: hash }).then((_res) => {
    if (_res == null) {
      {/* url does not exist in the db */}
      res.status(404);
      res.setHeader('Error');
      return null;
    }
    // Regex expression to check whether long url starts with a protocol or not
    const protocolRegex = /^(ftp: \/\/|http:\/\/|https:\/\/)/;
    let longUrl = null;
    /**
     * Check if long url matches the regex
     * If yes , no change required
     * Otherwise add a http protocol infront of the long url
     */
    if (protocolRegex.test(_res.longUrl.toString())) {
      longUrl = _res.longUrl;
    } else {
      longUrl = 'http://' + _res.longUrl;
    }
    res.redirect(301, longUrl);
    return _res;
  },
  ).then((_res) => {
    if (_res == null) {
      return;
    }
    /**
         * TODO : if long url exists then update the logistics
         */
    return _res;
  });
});
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
