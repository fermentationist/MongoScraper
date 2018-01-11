const routes = (function(){
	const express = require("express");
	const dbConnection = require("../config/connection.js");
	const path = require("path");


	const router = express.Router();

	router.get("/", function (req, res){
		res.send("server works!");
	})

	return router;
})();


module.exports = routes;