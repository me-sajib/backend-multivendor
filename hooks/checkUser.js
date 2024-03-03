const connection = require("../config/db");

const existingUser = (email) => {
	return new Promise((resolve, reject) => {
		connection.query(
			"SELECT * FROM users WHERE email=?",
			[email],
			(error, results, fields) => {
				if (error) res.status(202).json({ status: false, message: error });
				resolve(results.length > 0);
			}
		);
	});
};

module.exports = existingUser;
