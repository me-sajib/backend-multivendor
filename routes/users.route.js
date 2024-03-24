const router = require("express").Router();
const connection = require("../config/db");
const {
	saveUser,
	userLogin,
	checkUser,
	updateUserInfo,
	updatePwd,
	sendOtp,
	verifyOtp,
	setPassword,
} = require("../controllers/users.controller");
const { verifyAuth } = require("../middlewares/authMiddlewares");
const {
	registrationValidateMiddleware,
} = require("../middlewares/validationMiddleware");

// routes
router.get("/api/v1/check_user", verifyAuth, checkUser);
router.post("/api/v1/login", userLogin);
router.post("/api/v1/register", registrationValidateMiddleware, saveUser);
router.put("/api/v1/update_user", verifyAuth, updateUserInfo);
router.put("/api/v1/update_pwd", verifyAuth, updatePwd);
router.post("/api/v1/send_otp", sendOtp);
router.post("/api/v1/verify_otp", verifyOtp);
router.post("/api/v1/set_password", verifyAuth, setPassword);
router.get("/api/v1/chartdata", (req, res) => {
	const query = `
  SELECT 
    DATE_FORMAT(added_on, '%b') AS month_name, 
    COUNT(*) AS total_orders,
    SUM(total) AS total
  FROM orders 
  GROUP BY MONTH(added_on), DATE_FORMAT(added_on, '%b')
`;
	connection.query(query, (err, results) => {
		if (err) {
			console.log(err);
			res.status(500).send("Error fetching data");
			return;
		}

		res.status(200).json(results);
	});
});

module.exports = router;
