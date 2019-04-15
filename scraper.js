const Scraper = (function (){
	const cheerio = require("cheerio");
	const axios = require("axios");
	const entities = require("entities");
	// const db = require("./config/connection.js");

	const scrapeUrl = function (url, callback){
		axios.get(url).then(function(res){
			const $ = cheerio.load(res.data);
			const articleArray = findArticles($, url);
			return callback(articleArray);
		}).catch(function(err){
			return console.log(err.stack);
		});
	}

	const findArticles = function ($, url){
		let articleArray = [];
		$("main article").each(function (i, articleElement){
			const article = {};
			article.title = $(articleElement).find("h1, h2, h3, h4").text().trim() || null;
			let link = $(articleElement).find("a").attr("href") || "Link missing";
			article.link = link.slice(0,4) === "http" ? link : url + link;
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
