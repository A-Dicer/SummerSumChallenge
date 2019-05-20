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

  //-------------------------- Check Movies ------------------------------
  check: function(req, res) {
    console.log("Checking")
    let data = [];
    
    
    boxofficeScrape = (url, number) => {
      request(url, function(error, response, html) {
        const $ = cheerio.load(html);
        $('div#body').children('center').children('table').children('tbody').children().each(function(i, element) {  
          if(i < number && i > 0) {
          const title = $(element).children().eq(1).text();
          const amt = $(element).children().eq(3).text();
          let movieInfo = { title: title, amount: amt }
          console.log(movieInfo)
          data.push(movieInfo)
          }
        })
        console.log("DONE ---------------------")
        if(number === 2)boxofficeScrape("http://www.boxofficemojo.com/seasonal/?view=releasedate&yr=2018&season=Summer", 10);
        else res.json({results: data})
      })
    }

    boxofficeScrape("http://www.boxofficemojo.com/seasonal/?chart=&season=Spring&yr=2019&view=releasedate", 2)

    // db.Movies.find(req.query)
    //     .then(dbModel => res.json({results: dbModel, sess: req.session}))
    //     .catch(err => res.status(422).json(err));
  },
}