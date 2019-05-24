const db = require("../models");

module.exports = {
//---------------------------- Find All Users -------------------------------
  findAll: function (req, res) {
      db.User.find(req.query)
        .then(dbModel => res.json({results: dbModel, sess: req.session}))
        .catch(err => res.status(422).json(err));
  },

//-------------------------- Find A User By ID ------------------------------
  findById: function (req, res) {
      db.User.findById(req.params.id)
        .then(dbModel => res.json({results: dbModel, sess: req.session}))
        .catch(err => res.status(422).json(err));
  },

//-------------------------- Update User By ID ------------------------------
  update: function(req, res) {
      db.User.findOneAndUpdate({ _id: req.params.id }, req.body )
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
  },
  
 //------------------------- Create A User -------------------------------
  create: function(req, res) {
    let user = new Object()
    user.username = req.body.username
    user.picks = JSON.parse(req.body.picks)
    user.twitter = req.body.twitter
    
    db.User
      .create(user)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};


