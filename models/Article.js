const Article = (function(){
	const mongoose = require("mongoose");
	const Note = require("./Note.js");

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
		notes: {
			type: [Note.schema]
		},

		photoURL: {
			type: String
		}

	});

	const articleModel = mongoose.model("Article", articleSchema);

	return {
		model: articleModel,
		schema: articleSchema
	}

})();

module.exports = Article;


