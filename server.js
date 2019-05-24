//------------------------------ Requirements -------------------------------------------
const express   = require("express");
const bodyParser = require("body-parser");
const mongoose  = require("mongoose");
const routes    = require("./routes");

const PORT = process.env.PORT || 3000;

//-------------------------------- Express ----------------------------------------------
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
app.use(routes);

//------------------------------- Mongoose ----------------------------------------------
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/ssc",
  { useNewUrlParser: true }
);

//------------------------------ Start Server -------------------------------------------
app.listen(PORT, function() { console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`) });

