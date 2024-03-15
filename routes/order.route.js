const router = require("express").Router();
const { createOrder, getOrder } = require("../controllers/order.controller");
const {
  verifyAuth,
  checkIsAdmin,
  getUserID,
} = require("../middlewares/authMiddlewares");

// routes
router.post("/api/v1/order", createOrder);
router.get("/api/v1/orders", verifyAuth, getUserID, getOrder);

module.exports = router;
