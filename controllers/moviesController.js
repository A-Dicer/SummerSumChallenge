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

  //------------------------- Create Movies -------------------------------
  create: function(req, res) {
    let boxOffice = new Object
    boxOffice.movies = JSON.parse(req.body.movies)
    db.Movies
      .create(boxOffice)
      .then(dbModel => res.json({results: dbModel}))
      .catch(err => res.status(422).json(err));
  },

  //-------------------------- Check Movies ------------------------------
  check: function(req, res) {
    let data = [];

    db.Movies.find(req.query)
        .then(dbModel => {
          boxofficeScrape("http://www.boxofficemojo.com/seasonal/?chart=&season=Spring&yr=2019&view=releasedate", 2, dbModel)
        })
        .catch(err => res.status(422).json(err));
    
    finish = (oldInfo, newInfo) => {
      // console.log(oldInfo[oldInfo.length-1])

      oldInfo.length && newInfo.length 
        ? (
            //set oldMovies to the most recent list
            oldMovie = JSON.parse(JSON.stringify(oldInfo[oldInfo.length- 1].movies,)),
            
            //scrape new list from boxOffice mojo
                //make sure scrape worked
                newInfo.length
                ? (
                    //reset check to false
                    check = false,
                    //go through and check to see if the old and new list match
                    newInfo.map((mov, i) => {mov.title != oldMovie[i].title || mov.amount != oldMovie[i].amount ? check = true : null }), 
                    
                    //if they don't match add new list to database
                    check 
                      ? 
                        db.Movies
                        .create({movies: newInfo})
                        .then(dbModel => res.json({results: dbModel[dbModel.length-1]}))
                        .catch(err => res.status(422).json(err))
                      : res.json({results: newInfo})
                  )
                : null
        )  
        : null
    }

    boxofficeScrape = (url, number, oldInfo) => {
      // console.log(oldInfo[oldInfo.length-1])
      request(url, function(error, response, html) {
        const $ = cheerio.load(html);
        $('div#body').children('center').children('table').children('tbody').children().each(function(i, element) {  
          if(i < number && i > 0) {
          const title = $(element).children().eq(1).text();
          const amt = $(element).children().eq(3).text();
          let movieInfo = { title: title, amount: amt }
          data.push(movieInfo)
          }
        })
        
        number === 2
        ? boxofficeScrape("http://www.boxofficemojo.com/seasonal/?view=releasedate&yr=2019&season=Summer", 10, oldInfo)
        : finish(oldInfo, data)
      })
    }
  },
  

  //-------------------------- Check Daily ------------------------------
  daily: function(req, res) {
    let finalData = []
    idGet = (movie, i) =>{
      let searchTerm = movie[i].title.replace("(2019)", "")
    
      request(`https://www.boxofficemojo.com/search/?q=${searchTerm}`, function(error, response, html) {
        const $ = cheerio.load(html);
        
        let newId = $("table").children("tbody").children("tr").attr('bgcolor', '#FFFFFF').children('td').children('b').children('font').children('a').get(0).attribs.href
        newId = newId.replace("/movies/?id=", "")
      
        if(movie[i].title === "The Intruder (2019) ") newId = "theintruder2019.htm"
        if(movie[i].title === "The Hustle") newId = "hathawawilsoncomedy.htm"

        request(`https://www.boxofficemojo.com/movies/?page=daily&view=chart&id=${newId}`, function(error, response, html) {
          const $ = cheerio.load(html); let dailyValue = []
          $(".chart-wide").children("tbody").children("tr").each(function(i, element) { 
            let value = $(element).children().eq(8).text()
            value = value.replace("$", "")
            value ? dailyValue.push(parseInt(value, 10)):null
          })
          finalData.push({name: movie[i].title, data: dailyValue })
          i === 9 ? res.send({results: finalData}) : idGet(movie, i+1) 
        })
      })
    }

    db.Movies.find(req.query)
        .then(dbModel => {
          idGet(dbModel[dbModel.length -1].movies, 1)
        })
        .catch(err => res.status(422).json(err));
  }
}