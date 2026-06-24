function handleProductUpdate(product, headers) {
  console.log("Product update received:", {
    shop: headers["x-shopify-shop-domain"],
    topic: headers["x-shopify-topic"],
    productId: product.id,
    title: product.title,
    status: product.status,
    updatedAt: product.updated_at,
  });

  // Add your business logic here (sync to DB, notify services, etc.)
}

module.exports = { handleProductUpdate };
