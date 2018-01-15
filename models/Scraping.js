const Scraping = (function(){
	const mongoose = require ("mongoose");
	const Article = require("./Article.js");

	const scrapingSchema = new mongoose.Schema({
		lastScrape: [Article.schema],
		url: {
			type:String,
			required: true
		},
		time: {
			type: Date,
			default: Date.now
		},
		id: {
			type: Number,
			default: 1
		}
	});

	const scrapingModel = mongoose.model("Scraping", scrapingSchema);

	return {
		schema: scrapingSchema,
		model: scrapingModel
	}
})();

module.exports = Scraping;
