const mongoose = require("mongoose");
const db = require("./models");
const movieData = (require("./moviedb.js"))
mongoose.Promise = global.Promise;

// This file empties the levels collection and inserts the levels below

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/ssc", { useNewUrlParser: true });

console.log(movieData)
db.Movies.insertMany(movieData)
  .then(data => {
      console.log(data)
    // console.log(data.instertedCount + " records inserted!");
    process.exit(0);
  }).catch(error => { console.log('caught', error.message); });
