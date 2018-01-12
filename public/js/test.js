$(document).ready(function(){
	console.log("test.js loaded.");

	$("#submitButton").on("click", function(){
		console.log("#submitButton clicked.");
		const title = $("#title").val();
		const body = $("#body").val();
		const link = $("#link").val().trim();
		const noteBody = $("#noteBody").val();
		const article = {
			title: title,
			body: body,
			link: link,
			note: noteBody
		};
		console.log('article', article);
		$.post("/article", article).done(function(data){
			console.log("data =", data);
		});
	});
});