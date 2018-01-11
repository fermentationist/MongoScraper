const routes = (function(){
	const express = require("express");
	const db = require("../config/connection.js");
	const path = require("path");
	const bodyParser = require("body-parser");

	const router = express.Router();

	router.use(bodyParser.urlencoded({extended: false}));
	router.use(bodyParser.json());

	router.get("/", function (req, res){
		res.send("server works!");
	});

	router.get("/articles", function (req, res){
		res.send("server works!");
	});

	router.get("/notes", function (req, res){
		res.send("server works!");
	});

	router.post("/article", function (req, res){
		const articleData = req.body;
		console.log('articleData', articleData);
		if(articleData){
			const article = new db.Article.model(articleData);
			article.save(function(err){
				if(err){
					console.log("Error writing Article to database.", err);
				}else{
					console.log("new Article written to database.");
				}
			})
		}
	});

	router.post("/note", function (req, res){
		console.log("req.body:", req.body);
		if(req.body){
			const note = new db.Note.model(req.body);
			note.save(function(err){
				if(err){
					console.log("Error writing note to database.", err);
				}else{
					console.log("new Note written to database.");
				}
			})
		}
	});

	return router;
})();


module.exports = routes;