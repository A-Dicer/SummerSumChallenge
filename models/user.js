const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String},
  picks:    [{type: String}],
  points:   {type: Number, default: 0},
  perfect:  {type: Number, default: 0},
  movement: {type: String, default: "-"},
  direction:{type: String, default: "-"},
  guru:     {type: Boolean, default: false},
  twitter:  {type: Boolean},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
