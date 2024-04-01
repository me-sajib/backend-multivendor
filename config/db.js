const mysql = require("mysql");
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "multivendor",
});

connection.connect((err) => {
	if (err) {
		console.error("Error connecting to the database: " + err.stack);
		return;
	}
	console.log("Connected to the database as ID " + connection.threadId);
});

module.exports = connection;
