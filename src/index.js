require("dotenv").config();

const express = require("express");
const { verifyShopifyWebhook } = require("./verifyShopifyWebhook");
const { handleProductUpdate } = require("./handlers/productUpdate");

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use(express.raw({ type: 'application/json' }));
app.post(
  "/webhooks/products/update",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const hmac = req.get("X-Shopify-Hmac-Sha256");
    console.log("headers: ", req.headers);
    console.log("hmac: ", hmac);
    console.log("secret: ", WEBHOOK_SECRET);
    console.log("received webhook: ", req.body);
    if (!verifyShopifyWebhook(req.body, hmac, WEBHOOK_SECRET)) {
      return res.status(401).send("Unauthorized");
    }

    let product;
    try {
      product = JSON.parse(req.body.toString("utf8"));
    } catch {
      return res.status(400).send("Invalid JSON");
    }

    try {
      handleProductUpdate(product, req.headers);
      res.status(200).send("OK");
    } catch (err) {
      console.error("Failed to process product update:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Shopify webhook server listening on http://localhost:${PORT}`);
  console.log(`Webhook endpoint: POST /webhooks/products/update`);
});
