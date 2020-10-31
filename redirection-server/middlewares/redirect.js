const Click = require('../models/Click');
const Url = require('../models/Url');
const axios = require('axios');
// middleware to handle redirect requests
const redirect = async (req, res) => {
  // Get the hash
  try {
    const hash = req.url.slice(1);
    /**
         * Check whether current Url is present in the database or not
         * If yes , then redirect the user
         * Otherwise , send a 404
         */
    const urlInstance = await Url.findOne({ shortUrl: hash });
    //  url does not exist in the db
    if (!urlInstance) {
      return res.sendStatus(404);
    }

    const BASE_URL = 'http://api.ipstack.com/';
    const key = process.env.ACCESS_KEY;
    // Regex expression to check whether long url starts with a protocol or not
    const protocolRegex = /^(ftp|http|https):\/\//;
    let longUrl = null;
    /**
       * Check if long url matches the regex
       * If yes , no change required
       * Otherwise add a http protocol infront of the long url
       */
    if (protocolRegex.test(urlInstance.longUrl.toString())) {
      longUrl = urlInstance.longUrl;
    } else {
      longUrl = 'http://' + urlInstance.longUrl;
    }
    res.redirect(longUrl);
    /**
     * Update the logistics
     * after every redirection request
     */

    let ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    if (ip === '::1') {
      ip = '49.37.5.225';
    }
    const time = new Date().toISOString();
    const apiEndpoint = BASE_URL + ip + '?access_key=' + key;
    const location = await axios.get(apiEndpoint);
    const click = new Click({
      location: { city: location.data.city, state: location.data.region_name },
      time,
      ip,
    });
    return Url.updateOne({ shortUrl: hash }, {
      $push: {
        clicks: click,
      },
    });
  } catch (err) {
    return res.sendStatus(404);
  // Handle the async errors
  }
};
module.exports = redirect;
