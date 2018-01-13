const Scraper = (function (){
	const cheerio = require("cheerio");
	const axios = require("axios");
	const entities = require("entities");
	// const db = require("./config/connection.js");

	const scrapeUrl = function (url, callback){
		axios.get(url).then(function(res){
			const $ = cheerio.load(res.data);
			const articleArray = findArticles($);
			return callback(articleArray);
		}).catch(function(err){
			return console.log(err.stack);
		});
	}

	const findArticles = function ($){
		let articleArray = [];
		$("article").each(function (i, articleElement){
			const article = {};
			article.title = $(articleElement).find("a").text().trim();
			article.link = $(articleElement).find("a").attr("href");
			article.photoURL = $(articleElement).find("img").attr("src") || null;
			article.summary = $(articleElement).find("p.summary").html() || null;
			if(article.summary){
				article.summary = entities.decodeHTML(article.summary.trim());
			}
			articleArray.push(article);
		});
		return articleArray;
	}
	return {
		scrapeUrl: scrapeUrl
	}

})();

module.exports = Scraper;

// let url = "http://www.nytimes.com"
// Scraper.scrapeUrl(url, function(articleArray){
// 	articleArray.forEach(function(article){
// 		console.log(article);
// 	});
// });
// 	