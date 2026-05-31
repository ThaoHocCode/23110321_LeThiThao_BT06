import { pool } from "../config/db.js";
import { normalizeProductRow } from "./product.service.js";

export const getCartByUserId = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT ci.id AS cart_item_id, ci.quantity, p.*
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = ?
    ORDER BY ci.updated_at DESC
    `,
    [userId]
  );

  const items = rows.map((row) => {
    const product = normalizeProductRow(row);
    const lineTotal = Number(product.price) * row.quantity;
    return {
      cartItemId: row.cart_item_id,
      quantity: row.quantity,
      lineTotal,
      product: {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        stock: product.stock,
        images: product.images,
      },
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, subtotal, itemCount };
};

export const addToCart = async (userId, productId, quantity = 1) => {
  const [products] = await pool.query(
    "SELECT id, stock FROM products WHERE id = ? LIMIT 1",
    [productId]
  );
  if (!products[0]) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }
  if (products[0].stock <= 0) {
    const err = new Error("Product out of stock");
    err.status = 400;
    throw err;
  }

  const [existing] = await pool.query(
    "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? LIMIT 1",
    [userId, productId]
  );

  const newQty = (existing[0]?.quantity || 0) + quantity;
  if (newQty > products[0].stock) {
    const err = new Error(`Only ${products[0].stock} items available in stock`);
    err.status = 400;
    throw err;
  }

  if (existing[0]) {
    await pool.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [newQty, existing[0].id]);
  } else {
    await pool.query(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, productId, quantity]
    );
  }

  return getCartByUserId(userId);
};

export const updateCartItem = async (userId, cartItemId, quantity) => {
  const [rows] = await pool.query(
    `
    SELECT ci.id, ci.product_id, p.stock
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.id = ? AND ci.user_id = ?
    LIMIT 1
    `,
    [cartItemId, userId]
  );

  if (!rows[0]) {
    const err = new Error("Cart item not found");
    err.status = 404;
    throw err;
  }

  if (quantity <= 0) {
    await pool.query("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [cartItemId, userId]);
    return getCartByUserId(userId);
  }

  if (quantity > rows[0].stock) {
    const err = new Error(`Only ${rows[0].stock} items available in stock`);
    err.status = 400;
    throw err;
  }

  await pool.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [quantity, cartItemId]);
  return getCartByUserId(userId);
};

export const removeCartItem = async (userId, cartItemId) => {
  await pool.query("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [cartItemId, userId]);
  return getCartByUserId(userId);
};

export const clearCart = async (userId, connection = pool) => {
  await connection.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
};
