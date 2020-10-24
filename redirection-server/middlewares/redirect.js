const Url = require('../models/Url');

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
     * TODO : Update the logistics
     * after every redirection request
     */
  } catch (err) {
  // Handle the async errors
  }
};
module.exports = redirect;
