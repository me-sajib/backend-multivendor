const router = require("express").Router();
const connection = require("../config/db");
const {
	createOrder,
	getOrder,
	deleteOrder,
	getOrderInvoice,
} = require("../controllers/order.controller");
const {
	verifyAuth,
	checkIsAdmin,
	getUserID,
} = require("../middlewares/authMiddlewares");

// routes
router.post("/api/v1/order", createOrder);
router.get("/api/v1/orders", verifyAuth, getUserID, checkIsAdmin, getOrder);
router.delete("/api/v1/order/:id", verifyAuth, deleteOrder);
router.get("/api/v1/order/invoice/:id", getOrderInvoice);
router.patch("/api/v1/order/:id", verifyAuth, (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	const query = `UPDATE orders SET status = ? WHERE id = ?`;
	connection.query(query, [status, id], (err, results) => {
		if (err) {
			console.log(err);
			res.status(500).send("Error fetching data");
			return;
		}
		res.status(200).json({ status: true, message: "Order Updated" });
	});
});

module.exports = router;
