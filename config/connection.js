const dbConnection = (function(){
	const mongoose = require("mongoose");
	const env = process.env.NODE_ENV || "development";
	const config = require("./config.json")[env];
	const db = require("../models");
	const uri = process.env[config.use_env_variable];
	console.log('uri', uri);
	mongoose.Promise = Promise;
	mongoose.connect(uri, {
		useMongoClient: true
	}, function(err, res){
		if(err){
			console.log("Error connecting to database:", err);
		}else{
			console.log("Successfully connected to", uri);
		}
	});


	return db;
})();

module.exports = dbConnection;