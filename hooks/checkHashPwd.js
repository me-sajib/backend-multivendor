const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashingPwd = (pwd) => {
	return new Promise((resolve, reject) => {
		bcrypt.hash(pwd, saltRounds, (err, hash) => {
			if (err) {
				reject(err);
			} else {
				resolve(hash);
			}
		});
	});
};

const comparePwd = (pwd, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(pwd, hash, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

module.exports = { hashingPwd, comparePwd };
