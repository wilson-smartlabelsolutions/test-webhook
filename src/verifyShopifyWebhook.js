const crypto = require("crypto");

function verifyShopifyWebhook(rawBody, hmacHeader, secret) {
  if (!hmacHeader || !secret) {
    return false;
  }

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("base64");

  const digestBuffer = Buffer.from(digest, "base64");
  const hmacBuffer = Buffer.from(hmacHeader, "base64");
  console.log("digestBuffer: ", digestBuffer.toString());
  console.log("hmacBuffer: ", hmacBuffer.toString());
  if (digestBuffer.length !== hmacBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(digestBuffer, hmacBuffer);
}

module.exports = { verifyShopifyWebhook };
