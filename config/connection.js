const db = (function(){
	const mongoose = require("mongoose");
	const env = process.env.NODE_ENV || "development";
	console.log('*env', env)
	const config = require("./config.json")[env];
	console.log('config.use_env_variable', config.use_env_variable);
	const dbModels = require("../models");
	const uri = process.env[config.use_env_variable];
	// console.log('uri', uri);
	mongoose.Promise = Promise;
	mongoose.connect(uri, {
		useMongoClient: true
	}, function(err, res){
		if(err){
			console.log("Error connecting to database:", err);
		}else{
			console.log("Successfully connected to database");
		}
	});
	return dbModels;
})();

module.exports = db;