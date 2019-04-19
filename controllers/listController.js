const db = require("../models");

module.exports = {

//------------------------- Find All Movies for list -------------------------------
findAll: function (req, res) {
    db.List.find(req.query)
    .then(dbModel => res.json({results: dbModel, sess: req.session}))
    .catch(err => res.status(422).json(err));
},

  //------------------------- Find All Movies for list -------------------------------
  create: function(req, res) {
    db.List
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
}