const routes = (function(){
	const express = require("express");
	const db = require("../config/connection.js");
	const path = require("path");
	const bodyParser = require("body-parser");
	const scrapeUrl = require("../scraper.js").scrapeUrl;

	const router = express.Router();

	router.use(bodyParser.urlencoded({extended: false}));
	router.use(bodyParser.json());

	router.get("/scrape/:url", function (req, res){
		const url = req.params.url;
		console.log(`scrape request for ${url} received.`);
		scrapeUrl(url, function (articleArray){
			return res.render("results", {articleArray});
		});
	});

	router.get("/articles", function (req, res){
		res.send("server works!");
	});

	router.get("/", function (req, res){
		res.render("index");
	});

	router.get("/saved", function (req, res){
		let savedArticles;
		db.Article.model.find(function (err, articles){
			if(err){
				return res.status(500).send("Database error occurred-", err);
			}
			console.log('articles', articles);
			savedArticles = articles;
		});
		res.render("results", {savedArticles});
	});


	router.post("/article", function (req, res){
		const articleData = req.body;
		let note;
		if(articleData){
			if(articleData.note){
				const noteData = {content: articleData.note};
				note = new db.Note.model(noteData);
				delete articleData.note;
			}
			const article = new db.Article.model(articleData);
			if(note){
				article.notes.push(note);
			}
			article.save(function(err, article){
				if(err){
					return res.status(500).send("Error writing Article to database.", err);
				}
				return res.status(200).send("new Article written to database-", article);
			});
		}
		return res.status(400).end();
	});

	router.put("/note/:articleId", function (req, res){
		console.log("req.body:", req.body);
		const articleId = req.params.articleId;
		db.Article.model.findById(articleId, function(err, article){
			if (err){
				return res.status(500).send("find article failed-", err);
			}
			const noteData = {content: req.body.content};
			const note = new db.Note.model(noteData);
			article.notes.push(note);
			article.save(function(err, article){
				if(err){
					return res.status(500).send("save article failed-", err);
				}
				return res.status(200).send(article);
			});
		});
	});

	router.delete("/article/:articleId", function (req, res){
		const articleId = req.params.articleId;
		db.Article.model.findByIdAndRemove(articleId, function (err, article){
			if(err){
				return res.status(500).send("delete article failed-", err);
			}
			return res.status(200).send(`article- ${article} deleted.`);
		});
	});

	return router;
})();


module.exports = routes;