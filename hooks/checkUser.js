const connection = require("../config/db");

const existingUser = (mobile) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE mobile=?",
      [mobile],
      (error, results, fields) => {
        if (error) res.status(202).json({ status: false, message: error });
        resolve(results.length > 0);
      }
    );
  });
};

module.exports = existingUser;
