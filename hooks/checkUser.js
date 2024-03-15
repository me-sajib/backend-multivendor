const connection = require("../config/db");
const { hashingPwd } = require("./checkHashPwd");

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

const get_or_create_user = (username, mobile) => {
  return new Promise((resolve, reject) => {
    const getUser = "SELECT * FROM users WHERE mobile=?";
    connection.query(getUser, [mobile], (error, results, fields) => {
      // if no user then create user using mobile number
      if (results.length === 0) {
        const createUserQuery = "INSERT INTO users SET ?";
        connection.query(
          createUserQuery,
          { username, mobile, password: "", token: mobile + "123456" },
          (error, results) => {
            if (results) {
              return resolve(results.insertId);
            }
          }
        );
      }
      if (results.length > 0) {
        return resolve(results[0].id);
      }
    });
  });
};

module.exports = { existingUser, get_or_create_user };
