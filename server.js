process.stdout.write('\033c');

const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const routes = require("./controllers/router.js");

const PORT = process.env.PORT || 3000;

const app = express();

//Express-handlebars
const hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    defaultLayout: "main",
   extname:".hbs"
});
app.engine("hbs", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use("/", routes);

app.listen(PORT, function(){
	console.log("\n\n\n\npay no attention to the app listening on port", PORT);
});




app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');