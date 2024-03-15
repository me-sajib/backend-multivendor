const connection = require("../config/db");
const jwt = require("jsonwebtoken");
const { hashingPwd, comparePwd } = require("../hooks/checkHashPwd");
const { existingUser } = require("../hooks/checkUser");

// check for existing user
exports.checkUser = async (req, res) => {
  const { mobile } = req.user;
  const sql = "SELECT * FROM users WHERE mobile=?";
  connection.query(sql, [mobile], async (error, results, fields) => {
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
  const { mobile, password } = req.body;
  const authJwt = jwt.sign({ mobile }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  if (!mobile || !password) {
    return res
      .status(202)
      .json({ status: false, message: "Please enter all fields" });
  }
  const sql = "SELECT * FROM users WHERE mobile=?";
  connection.query(sql, [mobile], async (error, results, fields) => {
    if (error) res.status(202).json({ status: false, result: error });
    if (!results.length) {
      return res
        .status(202)
        .json({ status: false, result: "User does not exist" });
    }
    if (!results[0].password) {
      return res
        .status(202)
        .json({ status: false, result: "User does not exist" });
    }
    const compare = await comparePwd(password, results[0].password);
    if (error) res.status(202).json({ status: false, message: error });
    if (!compare) {
      return res
        .status(202)
        .json({ status: false, result: "Incorrect password" });
    }
    res.send({ status: true, result: authJwt });
  });
};

/**
 * Saves a user to the database.
 */
exports.saveUser = async (req, res) => {
  const { username, mobile, password } = req.body;

  //validate data
  if (!username || !mobile || !password) {
    return res
      .status(202)
      .json({ status: false, message: "Please enter all fields" });
  }

  // check password length
  if (password.length < 6) {
    return res.status(202).send({
      status: false,
      message: "Password must be at least 6 characters",
    });
  }

  const sql = "INSERT INTO users SET ?";
  const hashPwd = await hashingPwd(password);
  const data = {
    username,
    mobile,
    password: hashPwd,
    token: mobile + "123456",
  };
  const authJwt = jwt.sign({ mobile }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  //check for existing user
  const existing = await existingUser(mobile);
  if (existing) {
    return res
      .status(202)
      .json({ status: false, result: "User already exists" });
  }

  connection.query(sql, data, (error) => {
    if (error) res.status(202).json({ status: false, result: error });
    res.send({ status: true, result: authJwt });
  });
};

exports.getUserByToken = async (req, res) => {
  const authToken = req.body.authJwt;
  if (!authToken) {
    return res
      .status(202)
      .send({ status: false, message: "UnAuthorized access" });
  }
  const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
  const sql = "SELECT * FROM users WHERE mobile=?";
  connection.query(sql, [decoded.mobile], async (error, results, fields) => {
    if (error) res.status(202).json({ status: false, message: error });

    if (results.length === 0) {
      return res
        .status(202)
        .json({ status: false, message: "User does not exist" });
    }
    return res.status(200).json({ status: true, data: results });
  });
};
