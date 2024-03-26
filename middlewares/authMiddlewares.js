const { jwtDecode } = require("jwt-decode");
const connection = require("../config/db");
const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader) {
    return res.status(202).send({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwtDecode(token);
  if (!decoded) {
    return res.status(202).send({ message: "Invalid token" });
  }
  req.user = { mobile: decoded?.mobile };
  next();
};

const verifyGetUserID = (req, res, next) => {
  const authMobile = req.user.mobile;
  const sql = "SELECT * FROM users WHERE email=?";
  connection.query(sql, [authMobile], async (error, results, fields) => {
    if (error) res.status(202).json({ status: false, message: error });
    if (!results.length) {
      return res
        .status(202)
        .json({ status: false, message: "User does not exist" });
    }
    req.user = { user_id: results[0].id, mobile: results[0].mobile };
    next();
  });
};

const getUserID = async (req, res, next) => {
  const authMobile = req.user.mobile;
  const sql = "SELECT * FROM users WHERE mobile=?";
  connection.query(sql, [authMobile], async (error, results, fields) => {
    if (error) res.status(202).json({ status: false, message: error });
    if (!results.length) {
      return res
        .status(202)
        .json({ status: false, message: "User does not exist" });
    }
    req.user = { id: results[0].id, mobile: results[0].mobile };
    next();
  });
};

const checkIsAdmin = async (req, res, next) => {
  const { id, mobile } = req.user;
  const sql = "SELECT * FROM users WHERE mobile=?";
  connection.query(sql, [mobile], async (error, results, fields) => {
    if (error) res.status(202).json({ status: false, message: error });
    if (results) {
      if (results[0]?.role === "admin") {
        req.user = { id, isAdmin: true };
        next();
      } else {
        req.user = { id, isAdmin: false };
        next();
      }
    }
  });
};
module.exports = { verifyAuth, checkIsAdmin, getUserID, verifyGetUserID };
