import * as cartService from "../services/cart.service.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCartByUserId(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    const cart = await cartService.addToCart(req.user.id, Number(productId), Number(quantity));
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(
      req.user.id,
      Number(req.params.itemId),
      Number(quantity)
    );
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeCartItem(req.user.id, Number(req.params.itemId));
    res.json(cart);
  } catch (error) {
    next(error);
  }
};
