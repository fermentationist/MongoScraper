const Article = (function(){
	const mongoose = require("mongoose");

	const articleSchema = new mongoose.Schema({
		title: {
			type: String,
			trim: true, 
			required: true
		},
		body: {
			type: String,
			required: true
		},
		link: {
			type: String,
			required: true
		},
		photo: {
			type: String
		}

	});

	const articleModel = mongoose.model("Article", articleSchema);

	return articleModel;

})();

module.exports = Article;


