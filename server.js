const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const routes = require("./controllers/router.js");

const PORT = process.env.PORT || 3000;

const app = express();

app.use("/", routes);
app.use(express.static("./public"));


app.listen(PORT, function(){
	console.log("pay no attention to the app listening on port", PORT);
});