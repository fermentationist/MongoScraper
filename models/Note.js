const Note = (function(){
	const mongoose = require("mongoose");

	const noteSchema = new mongoose.Schema({
		content: {
			type: String,
		},
		time: {
			type: Date,
			default: Date.now
		}
	});

	const noteModel = mongoose.model("Note", noteSchema);

	return {
		model: noteModel,
		schema: noteSchema
	};

})();

module.exports = Note;


