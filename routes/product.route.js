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
  const images = req.file.filename; // Binary image data from multer

  const {
    name,
    regular_price,
    sale_price,
    description,
    brand,
    category,
    quantity,
  } = req.body;

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
        console.error(error);
        res.status(500).json({ message: "Error saving image to database" });
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

module.exports = router;
