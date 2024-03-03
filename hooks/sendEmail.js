require("dotenv").config();
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const auth = {
	auth: {
		api_key: process.env.MAILGUN_API_KEY,
		domain: "sandbox0e5f2e555625460aa64c2fc09ee5d87b.mailgun.org",
	},
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));
console.log(nodemailerMailgun);
exports.sendUserEmail = () => {
	nodemailerMailgun.sendMail(
		{
			from: "memrsajib@gmail.com",
			to: "memrsajib@gmail.com",
			subject: "Account Confirmation Email",
			//You can use "html:" to send HTML email content. It's magic!
			html: "<b>Your account has been created. Your OTP is 292941</b>",
			//You can use "text:" to send plain-text content. It's oldschool!
			text: "Your account has been created. Your OTP is 292941!",
		},
		(err, info) => {
			if (err) {
				console.log(`Error: ${err}`);
			} else {
				// console.log(`Response: ${info}`);
			}
		}
	);
};
