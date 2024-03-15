const connection = require("../config/db");

exports.checkAdmin = (mobile) => {
  const sql = "SELECT * FROM users WHERE mobile=?";
  connection.query(sql, [mobile], (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    if (results) {
      if (results[0].is_admin === "yes") {
        return true;
      } else {
        return false;
      }
    }
  });
};
