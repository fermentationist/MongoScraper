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
		const scraping = new db.Scraping.model({url:url});
		console.log(`scrape request for ${url} received.`);
		scrapeUrl(url, function (articleArray){
			console.log('articleArray before', articleArray);
			articleArray.forEach((articleData) => {
				let article = new db.Article.model(articleData);
				console.log('~ article', article);
				scraping.lastScrape.push(article);
				console.log('scraping', scraping);
			});
			db.Scraping.model.remove({}, function(err){
				if(err){
					console.log(err);
					return res.status(500).end();
				}
				scraping.save(function(err, scraping){
					if(err){
						console.log(err);
						return res.status(500).end();
					}
				});
			});
			console.log('articleArray after', articleArray);
			return res.render("results", {articleArray});
		});
	});

	router.get(["/","/scraped"], function (req, res){
		db.Scraping.model.findOne({"id":1}, function(err, data){
			if(!err){
				let articleArray = [{}];
				if(data){
					articleArray = data.lastScrape;
				}
				console.log('/scraped articleArray[0]', articleArray[0]);
				return res.render("results", {articleArray});
			}
			return res.status(500).send(err);
		});
	});

	router.get("/saved", function (req, res){
		console.log("/saved called");
		let articleArray;
		db.Article.model.find({},function (err, articles){
			if(err){
				return res.status(500).send("Database error occurred-", err);
			}
			// console.log('{articles}',  {articles});
			articleArray = articles;	
		});
		console.log('articleArray', articleArray)
		return res.render("results", {articleArray});
	});

	router.get("/validator", function (req, res){
		console.log("validator attempting to load")
		return res.sendFile("../node_modules/validator/validator.min.js");
	});

	router.post("/article", function (req, res){
		const articleData = req.body;
		console.log('articleData on back end:', articleData);
		let note;
		if(articleData){
			if(articleData.note){
				const noteData = {content: articleData.note};
				note = new db.Note.model(noteData);
				delete articleData.note;
			}
			console.log()
			const article = new db.Article.model(articleData);
			if(note){
				article.notes.push(note);
			}
			article.save(function(err, article){
				if(err){
					return res.status(500).end()//send("Error writing Article to database.", err);
				}else{
				
					return res.status(200).end()//send("new Article written to database-", article);
				}
			});
		}else{
			//return res.status(400).end();
		}
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