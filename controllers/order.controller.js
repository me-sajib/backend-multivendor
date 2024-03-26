const connection = require("../config/db");
const { checkAdmin } = require("../hooks/checkAdmin");
const { get_or_create_user } = require("../hooks/checkUser");

exports.createOrder = async (req, res) => {
  const {
    username,
    mobile,
    ordered_products,
    delivery_address,
    total,
    delivery_charge,
  } = req.body;
  const products = JSON.stringify(ordered_products);
  const user_id = await get_or_create_user(username, mobile);

  // validation data
  if (username === "" || mobile === "" || delivery_address === "") {
    return res
      .status(200)
      .json({ status: false, message: "Please fill all the fields" });
  }

  const saveOrderQuery =
    "INSERT INTO orders (user_id, username, mobile, ordered_products, total, delivery_charge, delivery_address) VALUES (?, ?, ?, ?, ?, ?, ?)";

  connection.query(
    saveOrderQuery,
    [
      user_id,
      username,
      mobile,
      products,
      total,
      delivery_charge,
      delivery_address,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      res.json({ results, status: true });
    }
  );
};

exports.getOrder = async (req, res) => {
  const { id, isAdmin } = req.user;
  const adminQuery = "SELECT * FROM orders ORDER BY id DESC";
  const userQuery = "SELECT * FROM orders WHERE user_id=? ORDER BY id DESC";
  connection.query(isAdmin ? adminQuery : userQuery, [id], (error, results) => {
    if (error) {
      console.log(error);
    }
    if (results) {
      res.json({ results, status: true });
    }
  });
};

exports.deleteOrder = async (req, res) => {
  const sql = "DELETE FROM orders WHERE id=?";
  connection.query(sql, [req.params.id], (error, results) => {
    if (error) {
      console.log(error);
    }
    if (results) {
      res.json({ results, status: true });
    }
  });
};
