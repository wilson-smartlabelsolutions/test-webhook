# Shopify Product Update Webhook

A minimal Express.js server that receives and verifies Shopify `products/update` webhooks.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set `SHOPIFY_WEBHOOK_SECRET` to the signing secret shown when you create the webhook in Shopify.

## Run

```bash
npm run dev    # development with auto-reload (Node 18+)
npm start      # production
```

Health check: `GET http://localhost:3000/health`

## Webhook endpoint

```
POST /webhooks/products/update
```

## Register the webhook in Shopify

1. In your Shopify admin, go to **Settings → Notifications → Webhooks** (or use the Admin API).
2. Create a webhook:
   - **Event:** Product update
   - **Format:** JSON
   - **URL:** `https://your-domain.com/webhooks/products/update`
3. Copy the **signing secret** into `SHOPIFY_WEBHOOK_SECRET` in your `.env` file.

### Local development with ngrok

```bash
ngrok http 3000
```

Use the ngrok HTTPS URL as your webhook endpoint in Shopify.

## How it works

1. Shopify sends a `POST` with the product JSON body and an `X-Shopify-Hmac-Sha256` header.
2. The server verifies the HMAC signature using your webhook secret.
3. On success, `handleProductUpdate` in `src/handlers/productUpdate.js` processes the payload.

Add your own logic in `src/handlers/productUpdate.js` (database sync, cache invalidation, etc.).
