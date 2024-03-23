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

exports.updateUserInfo = async (req, res) => {
  const { mobile } = req.user;
  const { username, address } = req.body;
  const sql = "UPDATE users SET ? WHERE mobile=?";
  const data = {
    username,
    address,
  };
  connection.query(sql, [data, mobile], (error) => {
    if (error) res.status(202).json({ status: false, message: error });
    res.send({ status: true, message: "Updated successfully" });
  });
};

exports.updatePwd = async (req, res) => {
  const { mobile } = req.user;
  const { current_password, password } = req.body;
  const hashPwd = await hashingPwd(password);

  // check current password
  const currentPwdSql = "SELECT password FROM users WHERE mobile=?";
  connection.query(currentPwdSql, [mobile], async (error, results, fields) => {
    if (error) res.status(202).json({ status: false, message: error });

    const compare = await comparePwd(current_password, results[0].password);
    if (!compare) {
      return res
        .status(202)
        .json({ status: false, message: "Incorrect password" });
    } else {
      const sql = "UPDATE users SET ? WHERE mobile=?";
      const data = {
        password: hashPwd,
      };
      connection.query(sql, [data, mobile], (error) => {
        if (error) res.status(202).json({ status: false, message: error });
        res.send({ status: true, message: "Updated successfully" });
      });
    }
  });
};

exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;
  // check for existing user
  const existingUserSql = "SELECT * FROM users WHERE mobile=?";
  connection.query(existingUserSql, [mobile], (error, results, fields) => {
    if (error) res.status(202).json({ status: false, message: error });
    if (results.length === 0) {
      return res
        .status(202)
        .json({ status: false, message: "User does not exist" });
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const sql = "UPDATE users SET ? WHERE mobile=?";
      const data = {
        otp,
      };
      connection.query(sql, [data, mobile], (error) => {
        if (error) res.status(202).json({ status: false, message: error });
        res.send({ status: true, message: "OTP sent" });
      });
    }
  });
};

exports.verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  const sql = "SELECT * FROM users WHERE mobile=?";
  connection.query(sql, [mobile], (error, results, fields) => {
    if (error) res.status(202).json({ status: false, message: error });
    if (results.length === 0) {
      return res
        .status(202)
        .json({ status: false, message: "User does not exist" });
    } else {
      if (results[0].otp === otp) {
        const authJwt = jwt.sign({ mobile }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        const sql = "UPDATE users SET ? WHERE mobile=?";
        const data = {
          otp: null,
          password: null,
        };

        connection.query(sql, [data, mobile], (error) => {
          if (error) res.status(202).json({ status: false, message: error });
          return res.status(200).json({ status: true, results: authJwt });
        });
      } else {
        return res
          .status(202)
          .json({ status: false, message: "Incorrect OTP" });
      }
    }
  });
};

exports.setPassword = async (req, res) => {
  const { password } = req.body;
  const { mobile } = req.user;
  if (!password || password === "" || password.length < 6) {
    return res
      .status(202)
      .json({ status: false, message: "Password is required" });
  }
  const hashPwd = await hashingPwd(password);
  const sql = "UPDATE users SET ? WHERE mobile=?";
  const data = {
    password: hashPwd,
  };
  connection.query(sql, [data, mobile], (error) => {
    if (error) res.status(202).json({ status: false, message: error });
    res.send({ status: true, message: "Password updated successfully" });
  });
};
