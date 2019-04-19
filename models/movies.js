const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moviesSchema = new Schema({
    movies: {
        title: { type: String },
        ammount: { type: Number},
    },
});

const Movies = mongoose.model("Movies", moviesSchema);

module.exports = Movies;