const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");
const cheerio = require("cheerio");
const players = require('./public/assets/javascript/players.js');
const movies = require('./public/assets/javascript/movies.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));

let infoCopy = { boxoffice: null, all: null, gurus: null } 
let data =  []
let all = JSON.parse(JSON.stringify(players))
let gurus = JSON.parse(JSON.stringify(players.filter(player => player.guru)))

boxofficeBuild = () => {
  data = []

  boxofficeScrape("http://www.boxofficemojo.com/seasonal/?chart=&season=Spring&yr=2018&view=releasedate", 2);
  setTimeout(() => { boxofficeScrape("http://www.boxofficemojo.com/seasonal/?view=releasedate&yr=2018&season=Summer", 10)}, 500);
 
  setTimeout(() => {
    playerBuild(all, "all")
    playerBuild(gurus, "gurus")
  }, 700);
}

playerBuild = (group, type) => {
  group.forEach((player) => {
    player.points = 0
      player.picks.forEach((pick, i) => {
          data.forEach((title, a) => {
          if(pick === title.title && i < 10){
              a === i
              ? (player.points += 10, player.perfect += 1)
              : player.points += (8 - Math.abs(i-a));
          }
          else if(pick === title.title )player.points += 1;
          })     
      })
  })

  group.sort(function compareNumbers(a, b){   
  if(a.points === b.points) return b.perfect - a.perfect
  else return b.points - a.points
  })

  let same = 1;
  let position = 1;

  group.forEach((player, i)=>{
    all[i-1]
    ? 
      player.points === group[i-1].points && player.perfect === group[i-1].perfect
      ? same += 1
      : ( position += same, same = 1 )
    : null

  player.pos = position;
  })

  
  let check = false

  infoCopy.boxoffice
  ? (
    data.forEach((movie, i) => {
      movie.title !== infoCopy.boxoffice[i].title
      ? check = true
      : null
    }), 
    
    check
    ? (
      
      group.forEach((player, i) => {
        infoCopy[type].forEach((copy)=>{
          if(player.name === copy.name){
            if(player.pos === copy.pos){
              player.movement = "-";
              player.direction = '';
            } else if(player.pos < copy.pos) {
              player.movement = Math.abs(player.pos - copy.pos);
              player.direction = "up"; 
            } else {
              player.movement = Math.abs(player.pos - copy.pos);
              player.direction = "down";     
            }
          }
        })
      }),
       setTimeout(()=>{
        infoCopy.boxoffice = JSON.parse(JSON.stringify(data))
        infoCopy.all = JSON.parse(JSON.stringify(all))
        infoCopy.gurus = JSON.parse(JSON.stringify(gurus))
      }, 200)
    )
    : null
  )
  :( 
    
    setTimeout(()=>{
      infoCopy.boxoffice = JSON.parse(JSON.stringify(data))
      infoCopy.all = JSON.parse(JSON.stringify(all))
      infoCopy.gurus = JSON.parse(JSON.stringify(gurus))
    }, 200)
  )
}

boxofficeScrape = (url, number) => {
  request(url, function(error, response, html) {
      const $ = cheerio.load(html);
      $('div#body').children('center').children('table').children('tbody').children().each(function(i, element) {  
          if(i < number && i > 0) {
          const title = $(element).children().eq(1).text();
          const amt = $(element).children().eq(3).text();
          let movieInfo = { title: title, amount: amt}
          data.push(movieInfo)
          }
      })
  })
}

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/boxoffice", function(req, res){
  res.send(data)
})

app.get("/players", function(req, res){
  res.send(all)
})

app.get("/gurus", function(req, res){
  res.send(gurus)
})

app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
  
boxofficeBuild();
setInterval(boxofficeBuild, 43200000);
