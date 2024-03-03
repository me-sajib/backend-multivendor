const connection = require("../config/db");
const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(202).send({ message: "UnAuthorized access" });
	}
	const token = authHeader.split(" ")[1];
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(202).send({ message: "UnAuthorized access" });
		}
		req.user = decoded;
		next();
	});
};

const verifyGetUserID = (req, res, next) => {
	const authEmail = req.user.email;
	const sql = "SELECT * FROM users WHERE email=?";
	connection.query(sql, [authEmail], async (error, results, fields) => {
		if (error) res.status(202).json({ status: false, message: error });
		if (!results.length) {
			return res
				.status(202)
				.json({ status: false, message: "User does not exist" });
		}
		req.user = { id: results[0].id, email: results[0].email };
		next();
	});
};

const getUserID = async (req, res, next) => {
	const authEmail = req.user.email;
	const sql = "SELECT * FROM users WHERE email=?";
	connection.query(sql, [authEmail], async (error, results, fields) => {
		if (error) res.status(202).json({ status: false, message: error });
		if (!results.length) {
			return res
				.status(202)
				.json({ status: false, message: "User does not exist" });
		}
		req.user = { id: results[0].id, email: results[0].email };
		next();
	});
};

module.exports = { verifyAuth, getUserID, verifyGetUserID };
