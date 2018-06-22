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




let data =  []



avengers = () => {
    data = []
  console.log("ran update")
  request("https://www.marketwatch.com/investing/stock/live", function(error, response, html) {
    const $ = cheerio.load(html);
    $('.markets').children('div').children('table').children('tbody').children().each(function(i, element) {
      
      const title = $(element).children().eq(1).text();
      const amt = $(element).children().eq(3).text();
      let movieInfo = { title: title, amount: amt}
      data.push(movieInfo)
      
    })
  })
}



avengers();
setInterval(avengers, 30000);

app.get("/boxoffice", function(req, res){
  res.send(data)
})


app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
 