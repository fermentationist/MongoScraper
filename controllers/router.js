const routes = (function(){
	const express = require("express");
	const db = require("../config/connection.js");
	const path = require("path");
	const bodyParser = require("body-parser");
	const scrapeUrl = require("../scraper.js").scrapeUrl;
	

	const router = express.Router();

	router.use(bodyParser.urlencoded({extended: false}));
	router.use(bodyParser.json());

	// delete article route
	router.post("/delete/article/:id", function (req, res){
		console.log("delete article request received on back end");
		const articleId = req.params.id;
		console.log('articleId', articleId);
		db.Article.model.findByIdAndRemove(articleId, function (err, article){
			if(err){
				res.status(500).end("delete article failed-", err);
			}
			return res.status(200).end(`article- ${article} deleted.`);
		});
	});

	// delete note route
	router.post("/delete/note/:articleId/:noteId", function (req, res){
		console.log("delete note request received on back end");
		const noteId = req.params.noteId;
		const articleId = req.params.articleId;
		console.log('articleId', articleId);
		console.log('noteId', noteId);
		db.Article.model.findById(articleId, function (err, article){
			if(err){
				console.log("delete note failed-", err);
				res.status(500).end;
			}
			console.log("article =", article);
			const note = article.notes.id(noteId);
			console.log('note', note);
			article.notes.pull(note);
			article.save((err,note) => err ? console.log(err) : console.log("successfully deleted note -", note));
			return res.status(200).end();
		});
	});

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
				let articleArray = [];
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
		db.Article.model.find({},function (err, articles){
			if(!err){
				let articleArray = [];
				if(articles){
					articleArray = articles;
				}
				console.log('/saved articleArray[0]', articleArray[0]);
				return res.render("saved", {articleArray});
			}
			return res.status(500).send(err);
		});
	});

	router.get("/notes/:articleId", function (req, res){
		console.log("req.body:", req.body);
		const articleId = req.params.articleId;
		console.log(`/notes/${articleId} called` )
		db.Article.model.findById(articleId, function(err, article){
			if (err){
				console.log('err', err);
				return res.status(500).end;
			}
			console.log("notes -", article.notes);
			res.status(200).json(article.notes);

		});
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
					return res.status(500).end()
				}else{
				
					return res.status(200).end()
				}
			});
		}else{
			return res.status(400).end();
		}
	});

	router.post("/notes/:articleId", function (req, res){
		console.log('/notes/:articleId called');
		console.log("req.body:", req.body);
		const articleId = req.params.articleId;
		console.log('\narticleId', articleId, '\n');
		const noteData = {content: req.body.content};
		const query = {_id: articleId};
		db.Article.model.findOneAndUpdate(query, { $push: {notes: noteData}}, function (err, article){
				if(err){
					console.log(err);
					return res.status(500).end();
				}
				return res.status(200).end();
		});
	});

	return router;
})();


module.exports = routes;





