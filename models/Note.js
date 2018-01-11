const Note = (function(){
	const mongoose = require("mongoose");

	const noteSchema = new mongoose.Schema({
		body: {
			type: String,
		},
		time: {
			type: Date,
			required: Date.now
		}
	});

	const noteModel = mongoose.model("Note", noteSchema);

	return noteModel;

})();

module.exports = Note;


