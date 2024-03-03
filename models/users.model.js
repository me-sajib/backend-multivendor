const connection = require("../config/db");

const allUsers = connection.query(
  "SELECT * FROM users",
  (error, results, fields) => {
    if (error) res.status(202).json({ status: false, message: error });
    return results;
  }
);

module.exports = allUsers;
