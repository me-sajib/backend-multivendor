const router = require("express").Router();
const {
  saveUser,
  userLogin,
  checkUser,
} = require("../controllers/users.controller");
const { verifyAuth } = require("../middlewares/authMiddlewares");
const {
  registrationValidateMiddleware,
} = require("../middlewares/validationMiddleware");

// routes
router.get("/api/v1/check_user", verifyAuth, checkUser);
router.post("/api/v1/login", userLogin);
router.post("/api/v1/register", registrationValidateMiddleware, saveUser);

module.exports = router;
