const Note = (function(){
	const mongoose = require("mongoose");

	const noteSchema = new mongoose.Schema({
		body: {
			type: String,
			required: true
		},
		time: {
			type: Date,
			required: Date.now
		}
	});

	const noteModel = mongoose.model("Note", noteSchema);

	return {
		model: noteModel,
		schema: noteSchema
	};

})();

module.exports = Note;


