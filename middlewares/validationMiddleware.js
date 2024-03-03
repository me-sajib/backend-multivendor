const { registrationSchema } = require("../schema/auth.schema");

exports.registrationValidateMiddleware = (req, res, next) => {
	const { error, value } = registrationSchema.validate(req.body);
	if (error) {
		// If validation fails, send an error response
		console.log(error.details[0].message);
		res.status(202).send(error.details[0].message);
	} else {
		// If validation is successful, call the next middleware
		next();
	}
};

exports.urlValidationMiddleware = (req, res, next) => {
	req.body.website_url = req.body.website_url.replace(/\/+$/, "").trim();
	next();
};

exports.saveUrlValidationMiddleware = (req, res, next) => {
	req.body.full_url = req.body.full_url.replace(/\/+$/, "").trim();
	next();
};
