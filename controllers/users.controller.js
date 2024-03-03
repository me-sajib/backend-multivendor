const connection = require("../config/db");
const jwt = require("jsonwebtoken");
const { hashingPwd, comparePwd } = require("../hooks/checkHashPwd");
const existingUser = require("../hooks/checkUser");

// check for existing user
exports.checkUser = async (req, res) => {
	const { email } = req.user;
	const sql = "SELECT * FROM users WHERE email=?";
	connection.query(sql, [email], async (error, results, fields) => {
		if (error) res.status(202).json({ status: false, message: error });
		if (results.length === 0) {
			return res
				.status(202)
				.json({ status: false, message: "User does not exist" });
		}
		return res.status(200).json({ status: true, data: results });
	});
};

exports.userLogin = async (req, res) => {
	const { email, password } = req.body;
	const authJwt = jwt.sign({ email: email }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
	if (!email || !password) {
		return res
			.status(202)
			.json({ status: false, message: "Please enter all fields" });
	}
	const sql = "SELECT * FROM users WHERE email=?";
	connection.query(sql, [email], async (error, results, fields) => {
		if (error) res.status(202).json({ status: false, message: error });
		if (!results.length) {
			return res
				.status(202)
				.json({ status: false, message: "User does not exist" });
		}
		if (!results[0].password) {
			return res
				.status(202)
				.json({ status: false, message: "User does not exist" });
		}
		const compare = await comparePwd(password, results[0].password);
		if (error) res.status(202).json({ status: false, message: error });
		if (!compare) {
			return res
				.status(202)
				.json({ status: false, message: "Incorrect password" });
		}
		res.send({ status: true, result: authJwt });
	});
};

/**
 * Saves a user to the database.
 */
exports.saveUser = async (req, res) => {
	const { name, email, password } = req.body;

	//validate data
	if (!name || !email || !password) {
		return res
			.status(202)
			.json({ status: false, message: "Please enter all fields" });
	}
	// check email is valid
	// Validate email
	if (!/\S+@\S+\.\S+/.test(email)) {
		return res.status(202).json({ status: false, message: "Invalid email" });
	}
	// check password length
	if (password.length < 6) {
		return res.status(202).json({
			status: false,
			message: "Password must be at least 6 characters",
		});
	}

	const sql = "INSERT INTO users SET ?";
	const hashPwd = await hashingPwd(password);
	const data = { name, email, password: hashPwd };
	const authJwt = jwt.sign({ email: email }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
	//check for existing user
	const existing = await existingUser(email);
	if (existing) {
		return res
			.status(202)
			.json({ status: false, message: "User already exists" });
	}

	connection.query(sql, data, (error) => {
		if (error) res.status(202).json({ status: false, message: error });
		res.send({ status: true, result: authJwt });
	});
};
