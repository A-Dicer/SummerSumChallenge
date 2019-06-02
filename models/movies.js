const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moviesSchema = new Schema({
    date: {type: Date, default: Date.now},
    movies: [{ 
        title: {type: String },
        amount: {type: String} 
    }],
    
});

const Movies = mongoose.model("Movies", moviesSchema);

module.exports = Movies;