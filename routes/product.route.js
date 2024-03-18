const router = require("express").Router();
const connection = require("../config/db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Define the destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname.slice(0, 4) +
        path.extname(file.originalname)
    ); // Define the file name for the uploaded file
  },
});

const upload = multer({ storage: storage });

router.post("/api/v1/product", upload.single("image"), (req, res) => {
  const images = req?.file?.filename; // Binary image data from multer

  const {
    name,
    regular_price,
    sale_price,
    description,
    brand,
    category,
    quantity,
  } = req.body;

  // validation
  if ((!name, !regular_price, !sale_price, !description, !quantity)) {
    res.status(200).json({ message: "All fields are required" });
    return;
  }

  // Save image data to database
  const insertQuery = `INSERT INTO products (name, regular_price, sale_price, description, brand, category, images, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    insertQuery,
    [
      name,
      regular_price,
      sale_price,
      description,
      brand,
      category,
      images,
      quantity,
    ],
    (error, results) => {
      if (error) {
        res.status(200).json({ message: "Error saving image to database" });
        return;
      }

      if (results) {
        res.status(200).json({ message: "Image saved successfully" });
      }
    }
  );
});

router.get("/api/v1/products", (req, res) => {
  connection.query("SELECT * FROM products", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving data from database" });
      return;
    }
    if (results) {
      res.status(200).json(results);
    }
  });
});

router.get("/api/v1/product/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "Error retrieving data from database" });
        return;
      }
      if (results) {
        res.status(200).json(results);
      }
    }
  );
});

router.delete("/api/v1/product/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          status: false,
          message: "Error retrieving data from database",
        });
        return;
      }
      if (results) {
        res
          .status(200)
          .json({ status: true, message: "Product deleted successfully" });
      }
    }
  );
});

router.put("/api/v1/product/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const image = req?.file ? req?.file?.filename : null;
  console.log(req.body.image);

  const {
    name,
    regular_price,
    sale_price,
    description,
    brand,
    category,
    quantity,
  } = req.body;

  const updateQuery = `UPDATE products SET name = ?, regular_price = ?, sale_price = ?, description = ?, brand = ?, category = ?, quantity = ? WHERE id = ?`;
  const values = [
    name,
    regular_price,
    sale_price,
    description,
    brand,
    category,
    quantity,
    id,
  ];

  if (!name || !regular_price || !sale_price || !description || !quantity) {
    res.status(200).json({ message: "All fields are required" });
    return;
  }

  if (image) {
    console.log("File deleted successfully");
    fs.unlinkSync(`public/images/${image}`);
    updateQuery += ", images = ?";
    values.push(image);
  }

  connection.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving data from database" });
      return;
    }
    if (results) {
      res
        .status(200)
        .json({ status: true, message: "Product updated successfully" });
    }
  });
});

module.exports = router;
