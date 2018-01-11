const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, function(error){
	if (error){
		console.log("Server error", error.stack);
	}
	console.log("pay no attention to the app listening on port", PORT);
});