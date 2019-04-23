const request   = require("request");
const cheerio   = require("cheerio");

let infoCopy = { boxoffice: null, all: null, gurus: null } 
let data =  []

//ajax call to the players database
let all = JSON.parse(JSON.stringify(players))
let gurus = JSON.parse(JSON.stringify(players.filter(player => player.guru)))

start = () => {
  //data base call for the current movie list. 
  data = movies
  playerBuild(all, "all")
  playerBuild(gurus, "gurus")
  // setTimeout(boxofficeBuild, 500)
}

boxofficeBuild = () => {
  data = []
  boxofficeScrape("http://www.boxofficemojo.com/seasonal/?chart=&season=Spring&yr=2018&view=releasedate", 2);
}

playerBuild = (group, type) => {
  group.forEach((player) => {
    player.points = 0;
    player.perfect = 0;

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
      let movieInfo = { title: title, amount: amt }
      data.push(movieInfo)
      }
    })
    if(number === 2)boxofficeScrape("http://www.boxofficemojo.com/seasonal/?view=releasedate&yr=2018&season=Summer", 10);
    else {   
        playerBuild(all, "all")
        playerBuild(gurus, "gurus")
    }
  })
}