const connection = require("../config/db");
// meta value debugger middleware
exports.getTaskMetaValue = async (req, res, next) => {
	const { id } = req.params;
	const sql = "SELECT * FROM tasks WHERE id=?";
	connection.query(sql, [id], (error, results) => {
		if (error) res.status(202).json({ status: false, message: error });
		return res.status(200).json({ status: true, data: results });
	});
	console.log(req.params);
};

// get value function , params id and meta name
exports.getTaskMetaValues = async (id, meta_name) => {
	const sql = "SELECT * FROM tasks_meta WHERE task_id=? AND meta_key=?";
	return new Promise((resolve, reject) => {
		connection.query(sql, [id, meta_name], (error, results) => {
			if (error) reject(error);
			resolve(results[0].meta_value);
		});
	});
};
