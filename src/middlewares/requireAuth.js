const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res
			.status(401)
			.send({ error: "You did not provide authorization header " });
	}

	const token = authorization.replace("Bearer ", "");
	// verifying the token in authorizaton header
	jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
		if (err) {
			return res.status(401).send({ error: "JWT key not verified" });
		}
		const { userId } = payload;

		const user = await User.findById(userId);
		req.user = user; // making user property global by attaching it to req so that it can be used in index.js
		next();
	});
};
