const db = require("../models");
const request   = require("request");
const cheerio   = require("cheerio");

module.exports = {

//------------------------- Find All Movies -------------------------------
  findAll: function (req, res) {    
      db.Movies.find(req.query)
        .then(dbModel => res.json({results: dbModel, sess: req.session}))
        .catch(err => res.status(422).json(err));
  },
  //-------------------------- Update Movies ------------------------------
  update: function(req, res) {
    db.Movies.findOneAndUpdate({ _id: req.params.id }, req.body )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  //-------------------------- Update Movies ------------------------------
  check: function(req, res) {
    console.log("Checking")
    db.Movies.find(req.query)
        .then(dbModel => res.json({results: dbModel, sess: req.session}))
        .catch(err => res.status(422).json(err));
  },
}