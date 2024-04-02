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
  saveBannerProduct,
  getAllBannerProduct,
  deleteBannerProduct,
  saveCategoryImage,
  getAllCategoryImages,
  deleteCategoryImage,
  getAllNavBar,
  getNavBar,
  saveNavbar,
  updateNavBar,
  deleteNavBar,
  getProductCategoryItems,
  saveSocialLink,
  deleteSocialLink,
  getAllSocialLink,
  updateSocialLink,
  getColorImages,
} = require("../controllers/products.controller");
const { verifyAuth, checkIsAdmin } = require("../middlewares/authMiddlewares");

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
  limits: {
    files: 10,
    fileSize: 1024 * 1024 * 5,
  },
});

const upload = multer({ storage: storage });

// save product
router.post("/api/v1/product", upload.array("photos", 10), saveProduct);

router.get("/api/v1/products", getAllProducts);

router.get("/api/v1/product/:id", getSingleProduct);

router.get("/api/v1/product/color-image/:id", getColorImages);

router.delete("/api/v1/product/:id", deleteProduct);

router.put("/api/v1/product/:id", upload.single("image"), updateProduct);

// navbar items
router.get("/api/v1/navbar", getAllNavBar);
router.get("/api/v1/navbar/:id", verifyAuth, getNavBar);
router.post("/api/v1/navbar", saveNavbar);
router.put("/api/v1/navbar/:id", verifyAuth, updateNavBar);
router.delete("/api/v1/navbar/:id", verifyAuth, deleteNavBar);

// save sliders images and title
router.post("/api/v1/slider", upload.single("image"), saveSliderProduct);

router.get("/api/v1/slider", getAllSliders);

router.delete("/api/v1/slider/:id", deleteSlider);

// get category wise products
router.get("/api/v1/category/:category", getProductCategoryItems);

// save category images and title
router.post(
  "/api/v1/category-image",
  upload.single("image"),
  saveCategoryImage
);

router.get("/api/v1/category-image", getAllCategoryImages);

router.delete("/api/v1/category-image/:id", deleteCategoryImage);

// banner product image
router.post("/api/v1/banner", upload.single("image"), saveBannerProduct);

router.get("/api/v1/banner", verifyAuth, getAllBannerProduct);

router.delete("/api/v1/banner/:id", verifyAuth, deleteBannerProduct);

// social link

router.get("/api/v1/social", getAllSocialLink);
router.post("/api/v1/social", verifyAuth, saveSocialLink);
router.put("/api/v1/social/:id", verifyAuth, updateSocialLink);
router.delete("/api/v1/social/:id", verifyAuth, deleteSocialLink);

module.exports = router;
