const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema({
        title: {type: String}
});

const List = mongoose.model("List", listSchema);

module.exports = List;