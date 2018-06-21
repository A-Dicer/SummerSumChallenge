const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");
const cheerio = require("cheerio");
const players = require('./public/assets/javascript/players.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));




let data =  [{title: "Avengers: Infinity War", amount: "$664,987,816"}]
 
request("http://www.boxofficemojo.com/seasonal/?view=releasedate&yr=2018&season=Summer", function(error, response, html) {

  const $ = cheerio.load(html);

  $('div#body').children('center').children('table').children('tbody').children().each(function(i, element) {
    // Save the data in variables 
    if(i < 10 && i > 0) {
    const title = $(element).children().eq(1).text();
    const amt = $(element).children().eq(3).text();

    let movieInfo = { title: title, amount: amt}
    data.push(movieInfo)
    }
  })

  players.forEach(function(player){
    player.picks.forEach(function(pick, i){
      data.forEach(function(title, a){
        if(pick === title.title && i < 10){
          if(a === i) player.points += 10;
          else player.points += (8 - Math.abs(i-a));
        }
        else if(pick === title.title )player.points += 1;
      })     
    })
  })

  players.sort(function compareNumbers(a, b){return b.points - a.points})
})

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/boxoffice", function(req, res){
  res.send(data)
})

app.get("/players", function(req, res){
  res.send(players)
})

app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
 