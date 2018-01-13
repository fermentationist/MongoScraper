$(document).ready(function(){
	console.log("app.js loaded.");

	$("#submitButton").on("click", function(){
		console.log("#submitButton clicked.");
		const title = $("#title").val();
		const summary = $("#body").val();
		const link = $("#link").val().trim();
		const noteContent = $("#noteContent").val();
		const article = {
			title: title,
			summary: summary,
			link: link,
			note: noteContent
		};
		console.log('article', article);
		$.post("/article", article).done(function(data){
			console.log("data =", data);
		});
	});

	$("#scrape-button").on("click", function(){
		console.log("#scrape-button clicked.");
		const url = encodeURIComponent($("#url-input").val());
		console.log('url', url);
		// $.get("/scrape/" + url).done(function(data){
		// 	console.log("data =", data);
		// });
		$("html").load(`/scrape/${url}`, function (res, status){
			console.log("loaded");
		});
	});
});