$(document).ready(function(){
	console.log("test.js loaded.");

	$("#submitButton").on("click", function(){
		console.log("#submitButton clicked.");
		const title = $("#title").val();
		const body = $("#body").val();
		const link = $("#link").val().trim();
		const noteContent = $("#noteContent").val();
		const article = {
			title: title,
			body: body,
			link: link,
			note: noteContent
		};
		console.log('article', article);
		$.post("/article", article).done(function(data){
			console.log("data =", data);
		});
	});
});