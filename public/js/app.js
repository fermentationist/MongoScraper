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

	//Alert modal for invalid input
	function alertInvalidInput(msg){
		const modal = $("#alert-modal").modal({
			show: false
		});
		$(".modal-body").text(msg);
		return modal.modal("show");
	}

	$("#scrape-button").on("click", function(event){
		event.preventDefault();
		console.log("#scrape-button clicked.");
		let unencodedUrl = $("#url-input").val().trim();
		if(!validator.isURL(unencodedUrl)){
			return alertInvalidInput(`${unencodedUrl} is not a valid URL.`);
		}
		if (unencodedUrl.substring(0, 7) !== "http://"){
				unencodedUrl = `http://${unencodedUrl}`;
			}
		const url = encodeURIComponent(unencodedUrl);
		console.log('url =', url);
		$("html").load(`/scrape/${url}`, function (res, status){
			console.log(`loading /scrape/${url}`);
			});
	});

	$("#saved-link").on("click", function(event){
		$.get("/saved", function(data){
			console.log(data);
		});
	});

	$(document).on("click", ".save-article", function(event){
		const articleId = $(this).attr("id");
		console.log('saveArticle() invoked-', articleId);
		saveArticle(articleId);
	});

	$(document).on("click", ".delete-article", function(event){
		console.log("delete button clicked");
		const articleId = ($(this).attr("id")).slice(15);
		console.log('delete-', articleId);
		$.post(`/delete/article/${articleId}`).done((req,res) => {
			console.log(res);
			$(`#${articleId}`).empty();
		});
	});

	$(document).on("click", ".add-notes", function(event){
		console.log("add notes button clicked");
		const articleId = ($(this).attr("id")).slice(9);
		console.log("add notes to article", articleId);
		$("#submit-note").data("article-id", articleId);
		$("#add-notes-modal").modal("show");
	});

	$(document).on("click", "#submit-note", function(event){
		event.preventDefault();
		let currentPosition = $(window).scrollTop;
		localStorage.setItem("previous-position", currentPosition);
		console.log("submit new note button clicked");
		const articleId = $(this).data("article-id");
		console.log('__articleId__', articleId);
		const noteContent = $("#new-note-content").val();
		$("#new-note-content").val("");
		$("#add-notes-modal").modal("hide");
		location.reload();
		let previousPosition = localStorage.getItem("previous-position");
		if (previousPosition){
			$(window).scrollTop(previousPosition);
			localStorage.removeItem("previous-position");
		}
		$.post(`/notes/${articleId}`, {content: noteContent}).done(function(req,res){
				console.log(res);
		});
	});

	$(document).on("click", ".view-notes", function(event){
		console.log("view notes button clicked");
		const articleId = ($(this).attr("id")).slice(11);
		console.log("this will eventually view notes to article", articleId);
		$("#modal-add-note").data("article-id", articleId);
		$.getJSON(`/notes/${articleId}`, function(notesArray){
			console.log(notesArray);
			viewNotes(notesArray, articleId);
		});
	});

	$(document).on("click", "#modal-add-note", function(event){
		console.log("modal add note button clicked");
		const articleId = $(this).data("article-id");
		console.log("add notes to article", articleId);
		$("#submit-note").data("article-id", articleId);
		$("div.notes-modal-body").empty();
		$("#view-notes-modal").modal("hide");
		$("#add-notes-modal").modal("show");
	});

	$(document).on("click", ".delete-note", function(event){
		const {articleId, noteId} = $(this).data();
		console.log(`delete: articleId: ${articleId}, noteId: ${noteId}`);
		$.post(`/delete/note/${articleId}/${noteId}`).done((req,res) => {
			console.log("back to the front", res);
			$(`#note-id-${noteId}`).empty();
		});
	});

	//Notes modal 
	function viewNotes(notesArray, articleId){
		let notesBody = $("<div>").addClass(`notes-${articleId}`);
		console.log('notesBody', notesBody)
		notesArray.forEach(function(note, index){
			let noteId = note._id;
			console.log('noteId', noteId);
			let noteDiv = $(`<div id="note-id-${noteId}">`);
			let time = $("<p>").text(note.time);
			let content = $("<p>").text(note.content);
			let deleteButtonStr = `<button type="button" data="delete-note-${note._id}" class="btn btn-danger delete-note">delete note</button>`;
			let idObject = {
				"article-id": articleId,
				"note-id" : noteId
			}
			let deleteButton = $(deleteButtonStr).data(idObject);
			noteDiv = noteDiv.append(time)
							 .append(content)
							 .append(deleteButton)
							 .append($(`<hr style="color:white">`));
			notesBody.append(noteDiv);
		});
		$("div.notes-modal-body").empty().append(notesBody);
		$("#view-notes-modal").modal("show");
	}

	const saveArticle = function (articleId){
		const articleData = {};
		const index = articleId.slice(13);
		console.log('index', index);
		articleData.title = $(`#title-${index}`).text();
		articleData.link = $(`#link-${index}`).attr("href");
		articleData.summary = $(`#summary-${index}`).text() || null;
		articleData.photoURL = $(`#photoURL-${index}`).attr("href") || null;
		console.log('articleData', articleData);
		$(`#row-${index}`).remove();
		$.post("/article", articleData).done(function (req, res){
			return console.log(res);
		});
	}
});