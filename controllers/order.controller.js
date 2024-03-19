const connection = require("../config/db");
const { checkAdmin } = require("../hooks/checkAdmin");
const { get_or_create_user } = require("../hooks/checkUser");

exports.createOrder = async (req, res) => {
	const { username, mobile, ordered_products, delivery_address, total } =
		req.body;
	const products = JSON.stringify(ordered_products);
	const user_id = await get_or_create_user(username, mobile);

	// validation data
	if (username === "" || mobile === "" || delivery_address === "") {
		return res
			.status(200)
			.json({ status: false, message: "Please fill all the fields" });
	}

	const saveOrderQuery =
		"INSERT INTO orders (user_id, username, ordered_products, total, delivery_address) VALUES (?, ?, ?, ?, ?)";

	connection.query(
		saveOrderQuery,
		[user_id, username, products, total, delivery_address],
		(error, results) => {
			if (error) {
				console.log(error);
			}
			res.json({ results, status: true });
		}
	);
};

exports.getOrder = async (req, res) => {
	const sql = "SELECT * FROM orders WHERE user_id=?";
	connection.query(sql, [req.user.id], (error, results) => {
		if (error) {
			console.log(error);
		}
		if (results) {
			res.json({ results, status: true });
		}
	});
};
