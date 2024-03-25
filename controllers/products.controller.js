const connection = require("../config/db");

exports.saveProduct = async (req, res) => {
	const images = req?.file?.filename; // Binary image data from multer

	const {
		name,
		regular_price,
		sale_price,
		description,
		brand,
		category,
		quantity,
		color,
		size,
	} = req.body;

	// validation
	if ((!name, !regular_price, !sale_price, !quantity)) {
		res.status(200).json({ message: "All fields are required" });
		return;
	}
	// Save image data to database
	const insertQuery = `INSERT INTO products (name, regular_price, sale_price, description, brand, category, images, quantity, color, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
			color,
			size,
		],
		(error, results) => {
			if (error) {
				res
					.status(200)
					.json({ status: false, message: "Something went wrong" });
				return;
			}

			if (results) {
				// send all products
				connection.query(
					"SELECT * FROM products ORDER BY id DESC",
					(error, results) => {
						if (error) {
							console.error(error);
							res
								.status(500)
								.json({ message: "Error retrieving data from database" });
							return;
						}
						if (results) {
							res.status(200).json({ status: true, data: results });
						}
					}
				);
			}
		}
	);
};

exports.getAllProducts = (req, res) => {
	connection.query(
		"SELECT * FROM products ORDER BY id DESC",
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
};

exports.getSingleProduct = (req, res) => {
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
};

exports.deleteProduct = (req, res) => {
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
};

exports.updateProduct = (req, res) => {
	const { id } = req.params;
	const image = req?.file ? req?.file?.filename : null;

	const {
		name,
		regular_price,
		sale_price,
		description,
		size,
		color,
		brand,
		category,
		quantity,
	} = req.body;

	const updateQuery = `UPDATE products SET name = ?, regular_price = ?, sale_price = ?, description = ?,quantity = ?, color = ?, size = ?, brand = ?,  category = ? WHERE id = ?`;

	const values = [
		name,
		regular_price,
		sale_price,
		description,
		quantity,
		color,
		size,
		brand,
		category,
		id,
	];

	if (!name || !regular_price || !sale_price || !description || !quantity) {
		res.status(200).json({ status: false, message: "All fields are required" });
		return;
	}

	if (image) {
		fs.unlinkSync(`public/images/${image}`);
		updateQuery += ", images = ?";
		values.push(image);
	}

	connection.query(updateQuery, values, (error, results) => {
		if (error) {
			res.status(500).json({ message: "Error retrieving data from database" });
			return;
		}
		if (results) {
			// send all updated products
			connection.query("SELECT * FROM products", (error, results) => {
				if (error) {
					res.status(201).json({
						message: "Error retrieving data from database",
					});
					return;
				}
				if (results) {
					res.status(200).json({ status: true, data: results });
				}
			});
		}
	});
};

exports.saveNavbar = (req, res) => {
	const { title, category } = req.body;
	console.log(req.body);
	if (!title || !category) {
		res.status(200).json({ status: false, message: "All fields are required" });
		return;
	}

	const insertQuery = `INSERT INTO navbar (title, category) VALUES (?, ?)`;
	const values = [title, category];
	connection.query(insertQuery, values, (error, results) => {
		if (error) {
			console.error(error);
			res.status(500).json({
				status: false,
				message: "Error retrieving data from database",
			});
			return;
		}
		if (results) {
			// send all updated products
			connection.query(
				"SELECT * FROM navbar ORDER BY id DESC",
				(error, results) => {
					if (error) {
						res.status(201).json({
							message: "Error retrieving data from database",
						});
						return;
					}
					if (results) {
						res.status(200).json({ status: true, data: results });
					}
				}
			);
		}
	});
};

exports.getAllNavBar = (req, res) => {
	connection.query(
		"SELECT * FROM navbar ORDER BY id DESC",
		(error, results) => {
			if (error) {
				console.error(error);
				res
					.status(500)
					.json({ message: "Error retrieving data from database" });
				return;
			}
			if (results) {
				res.status(200).json({ status: true, results });
			}
		}
	);
};

exports.getNavBar = (req, res) => {
	connection.query(
		"SELECT * FROM navbar ORDER BY id DESC",
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
};

exports.updateNavBar = (req, res) => {
	const { id } = req.params;
	const { title, category } = req.body;
	const updateQuery = `UPDATE navbar SET title = ?, category = ? WHERE id = ?`;
	const values = [title, category, id];
	connection.query(updateQuery, values, (error, results) => {
		if (error) {
			console.error(error);
			res.status(500).json({
				status: false,
				message: "Error retrieving data from database",
			});
			return;
		}
		if (results) {
			// send all updated products
			connection.query(
				"SELECT * FROM navbar ORDER BY id DESC",
				(error, results) => {
					if (results) {
						res.status(200).json({ status: true, data: results });
					}
				}
			);
		}
	});
};

exports.deleteNavBar = (req, res) => {
	const { id } = req.params;
	connection.query(
		"DELETE FROM navbar WHERE id = ?",
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
					.json({ status: true, message: "Navbar deleted successfully" });
			}
		}
	);
};

exports.saveSliderProduct = (req, res) => {
	const image = req?.file?.filename;
	const { category } = req.body;

	if (!category) {
		res.status(200).json({ status: false, message: "All fields are required" });
		return;
	}

	const insertQuery = `INSERT INTO sliders ( category, images) VALUES (?, ?)`;
	const values = [category, image];

	connection.query(insertQuery, values, (error, results) => {
		if (error) {
			console.error(error);
			res.status(500).json({
				status: false,
				message: "Error retrieving data from database",
			});
			return;
		}
		if (results) {
			// send all updated products
			connection.query(
				"SELECT * FROM sliders ORDER BY id DESC",
				(error, results) => {
					if (error) {
						res.status(201).json({
							message: "Error retrieving data from database",
						});
						return;
					}
					if (results) {
						res.status(200).json({ status: true, data: results });
					}
				}
			);
		}
	});
};

exports.getAllSliders = (req, res) => {
	connection.query("SELECT * FROM sliders", (error, results) => {
		if (error) {
			console.error(error);
			res.status(500).json({ message: "Error retrieving data from database" });
			return;
		}
		if (results) {
			res.status(200).json({ status: true, data: results });
		}
	});
};

exports.deleteSlider = (req, res) => {
	const { id } = req.params;
	connection.query(
		"DELETE FROM sliders WHERE id = ?",
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
					.json({ status: true, message: "Slider deleted successfully" });
			}
		}
	);
};

exports.saveCategoryImage = (req, res) => {
	const image = req?.file?.filename;
	const { title, category } = req.body;
	if (!title) {
		res.status(200).json({ message: "All fields are required" });
		return;
	}

	const insertQuery = `INSERT INTO category_images (title, category, images) VALUES (?, ?, ?)`;
	const values = [title, category, image];
	connection.query(insertQuery, values, (error, results) => {
		if (error) {
			res.status(500).json({ message: "Error retrieving data from database" });
			return;
		}
		if (results) {
			// send all updated products
			connection.query(
				"SELECT * FROM category_images ORDER BY id DESC",
				(error, results) => {
					if (error) {
						res.status(201).json({
							message: "Error retrieving data from database",
						});
						return;
					}
					if (results) {
						res.status(200).json({ status: true, data: results });
					}
				}
			);
		}
	});
};

exports.getAllCategoryImages = (req, res) => {
	connection.query("SELECT * FROM category_images", (error, results) => {
		if (error) {
			console.error(error);
			res.status(500).json({ message: "Error retrieving data from database" });
			return;
		}
		if (results) {
			res.status(200).json({ status: true, data: results });
		}
	});
};

exports.deleteCategoryImage = (req, res) => {
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
};

exports.saveBannerProduct = async (req, res) => {
	const images = req?.file?.filename; // Binary image data from multer

	const { name, regular_price, sale_price, description, brand, quantity } =
		req.body;
	const category = "banner";

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
				// send all updated products
				connection.query(
					"SELECT * FROM products WHERE category = 'banner'",
					(error, results) => {
						if (error) {
							res.status(201).json({
								message: "Error retrieving data from database",
							});
							return;
						}
						if (results) {
							res.status(200).json({ status: true, data: results });
						}
					}
				);
			}
		}
	);
};

exports.getAllBannerProduct = (req, res) => {
	// get all banner products by products table where category = banner
	connection.query(
		"SELECT * FROM products WHERE category = 'banner'",
		(error, results) => {
			if (error) {
				console.error(error);
				res
					.status(500)
					.json({ message: "Error retrieving data from database" });
				return;
			}
			if (results) {
				res.status(200).json({ status: true, data: results });
			}
		}
	);
};

exports.deleteBannerProduct = (req, res) => {
	const { id } = req.params;
	connection.query(
		"DELETE FROM products WHERE id = ?",
		[id],
		(error, results) => {
			if (error) {
				res.status(202).json({
					status: false,
					message: "Error retrieving data from database",
				});
				return;
			}
			if (results) {
				res
					.status(200)
					.json({ status: true, message: "Slider deleted successfully" });
			}
		}
	);
};
