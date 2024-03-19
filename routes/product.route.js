const router = require("express").Router();
const connection = require("../config/db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
	saveProduct,
	getAllProducts,
	getSingleProduct,
	deleteProduct,
	updateProduct,
	saveSliderProduct,
	getAllSliders,
	deleteSlider,
} = require("../controllers/products.controller");

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

// save product
router.post("/api/v1/product", upload.single("image"), saveProduct);

router.get("/api/v1/products", getAllProducts);

router.get("/api/v1/product/:id", getSingleProduct);

router.delete("/api/v1/product/:id", deleteProduct);

router.put("/api/v1/product/:id", upload.single("image"), updateProduct);

// save sliders images and title
router.post("/api/v1/slider", upload.single("image"), saveSliderProduct);

router.get("/api/v1/slider", getAllSliders);

router.delete("/api/v1/slider/:id", deleteSlider);

// save category images and title
router.post("/api/v1/category-image", upload.single("image"), (req, res) => {
	const image = req?.file?.filename;
	const { title } = req.body;
	if (!title) {
		res.status(200).json({ message: "All fields are required" });
		return;
	}

	const insertQuery = `INSERT INTO category_images (title, images) VALUES (?, ?)`;
	const values = [title, image];
	connection.query(insertQuery, values, (error, results) => {
		if (error) {
			console.error(error);
			res.status(500).json({ message: "Error retrieving data from database" });
			return;
		}
		if (results) {
			res
				.status(200)
				.json({ status: true, message: "Category image saved successfully" });
		}
	});
});

router.get("/api/v1/category-image", (req, res) => {
	connection.query("SELECT * FROM category_images", (error, results) => {
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

router.delete("/api/v1/category-image/:id", (req, res) => {
	const { id } = req.params;
	connection.query(
		"DELETE FROM category_images WHERE id = ?",
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
				res.status(200).json({
					status: true,
					message: "Category image deleted successfully",
				});
			}
		}
	);
});

module.exports = router;
