﻿import { pool } from "../config/db.js";
import { findProductById, normalizeProductRow, queryProducts } from "../services/product.service.js";

export const getHomeData = async (req, res, next) => {
  try {
    const [newArrivals] = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC LIMIT 8"
    );
    const [bestSellers] = await pool.query(
      "SELECT * FROM products ORDER BY sales_count DESC LIMIT 10"
    );

    res.json({
      promotionBanner: {
        title: "Member Day - Giam 25% Sneaker cao cap",
        description: "Ap dung den het thang nay cho tat ca thanh vien.",
      },
      news: [
        { id: 1, title: "Mien phi giao hang cho don tu 2 trieu" },
        { id: 2, title: "Bao hanh keo de 90 ngay" },
      ],
      newArrivals: (newArrivals || []).map(normalizeProductRow),
      bestSellers: (bestSellers || []).map(normalizeProductRow),
      user: req.user ? {
        id: req.user.id,
        username: req.user.username,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
      } : null,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductDetail = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await findProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await pool.query("UPDATE products SET views_count = views_count + 1 WHERE id = ?", [id]);

    const [related] = await pool.query(
      "SELECT * FROM products WHERE category_id = ? AND id != ? ORDER BY created_at DESC LIMIT 8",
      [product.category_id, id]
    );

    res.json({ ...product, relatedProducts: (related || []).map(normalizeProductRow) });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const result = await queryProducts(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategoryInfinite = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 8);
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      `
      SELECT p.*, c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE c.slug = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [slug, limit, offset]
    );

    const [countRows] = await pool.query(
      "SELECT COUNT(*) AS total FROM products p JOIN categories c ON c.id = p.category_id WHERE c.slug = ?",
      [slug]
    );

    res.json({
      data: rows.map(normalizeProductRow),
      page,
      limit,
      hasMore: offset + rows.length < countRows[0].total,
    });
  } catch (error) {
    next(error);
  }
};

export const getHighlights = async (req, res, next) => {
  try {
    const [bestSellers] = await pool.query(
      "SELECT * FROM products ORDER BY sales_count DESC LIMIT 10"
    );
    const [mostViewed] = await pool.query(
      "SELECT * FROM products ORDER BY views_count DESC LIMIT 10"
    );

    res.json({
      bestSellers: bestSellers.map(normalizeProductRow),
      mostViewed: mostViewed.map(normalizeProductRow),
    });
  } catch (error) {
    next(error);
  }
};
