const crypto = require('crypto');
const urlShortener = async (longUrl) => {
  const shortUrl = await crypto.createHash('sha256')
      .update(longUrl.toString() + new Date().toString())
      .digest('hex').substring(0, 9);
  return shortUrl;
};
module.exports = urlShortener;
