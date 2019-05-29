let pos = 0; let all; let gurus; let movies;
let previous = { all: null, gurus: null } 
let current = { all: null, gurus: null } 


// tally --------------------------------------------------------------------------------
tally = (data, loc) => {

  data.forEach((player) => {
    player.points = 0;
    player.perfect = 0;

    player.picks.forEach((pick, i) => {
        movies[loc].movies.forEach((title, a) => {
        if(pick === title && i < 10){
            a === i
            ? ( player.points += 10, player.perfect += 1 )
            : player.points += (8 - Math.abs(i-a));
        }
        else if(pick === title) player.points += 1;
        })     
    })
  })

  //sort by points
  data.sort(function compareNumbers(a, b){   
    if(a.points === b.points) return b.perfect - a.perfect
    else return b.points - a.points
  })

  let same = 1;
  let position = 1;

  //find position
  data.forEach((player, i)=>{
    data[i-1]
    ? 
      player.points === data[i-1].points && player.perfect === data[i-1].perfect
      ? same += 1
      : ( position += same, same = 1 )
    : null

  player.pos = position;
  })

  return data;
  
}

// movieList ----------------------------------------------------------------------------
movieList = () => {
  $.ajax({ url: "/api/movies/", method: "GET"}).done((res) => { 
    movies = res.results
    playerBuild()
  })
}




// diff ---------------------------------------------------------------------------------
diff = (a, b) => {
  a.forEach((player, i) => {
    b.forEach((copy)=>{
      if(player.username === copy.username){
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
  })
}

// playerBuild --------------------------------------------------------------------------
playerBuild = () => {
  $.ajax({ url: "/players", method: "GET"})
    .done((res) => { 
      
      previous.all = JSON.parse(JSON.stringify(res.results))
      previous.gurus = JSON.parse(JSON.stringify(res.results.filter(player => player.guru)))

      current.all = JSON.parse(JSON.stringify(res.results))
      current.gurus = JSON.parse(JSON.stringify(res.results.filter(player => player.guru)))
      
      tally(previous.all, movies.length-2)
      tally(current.all, movies.length-1)
      tally(previous.gurus, movies.length-2)
      tally(current.gurus, movies.length-1)

      setTimeout(()=>{
        diff(current.all, previous.all)
        diff(current.gurus, previous.gurus)
      }, 300)

      setTimeout(() =>{
          display(current.all)
          all = current.all
          userInfo(current.all[0])
          stats()
      }, 500)
    });
}
 
// display ------------------------------------------------------------------------------
display = (players) => {

  $("#leaderBoard").html(' ')

    players.forEach((player,i) => { 

    let guru = ""
    let btn = "btn-light"
    let move = "-"

    if(player.guru) guru = "<i class='fas fa-user-astronaut guru'></i> ";
    if(i === 0) btn = "btn-info";
    if(player.direction === "up") move = "<i class='fas fa-arrow-up'></i> " + player.movement
    if(player.direction === "down") move = "<i class='fas fa-arrow-down'></i> " + player.movement

    $("#leaderBoard").append(
      "<button id='"+ i +"' type='button' class='btn btn-sm " + btn + " btn-block'>" +
        "<div class='row'>" +
          "<div class='col-1'>" + player.pos +"</div>" +
          "<div class='col-6 text-left text-truncate'>" + guru + player.username + "</div>" +  
          "<div class'col-2'>" + player.points + "pts </div>" + 
          "<div class='col-3'>" + move + "</div>" +   
        "</div>" +
      "</button>"
    );
    $("button").click(function(){
      userInfo(players[$(this).attr('id')]);
      $("#" + pos).removeClass('btn-info').addClass('btn-light')
      pos = $(this).attr('id');
      $(this).removeClass('btn-light').addClass('btn-info')
    })

    })
}

// userInfo -----------------------------------------------------------------------------
userInfo = (player) =>{
  
  let dataFresh = []

  player.picks.forEach((pick, i) => {
    let point = '-';
    movies[movies.length-1].movies.forEach((title, a) => {
      if(pick === title && i < 10){
          if(a === i) point = 10;
          else point = (8 - Math.abs(i-a));
      } else if(pick === title) point = 1;
    }) 
    dataFresh.push({ title: pick, points: point})  
  })

  $("#playerImg, .userBgImg").attr('src', player.img);
  $(".card-title").text(player.username + " - " + player.points + " Points")
      
  $("#pick").html(' ')
  dataFresh.forEach((pick, i) => {
    let line = ''
    if(i === 9) line = '<hr>'

    pick.points === '-'
    ? icon = " <i class='far fa-times-circle down'></i>"
    : icon =  "<i class='far fa-check-circle up'></i>"
    
    $("#pick").append(
      "<div class='row uds'>" +
        "<div class='col-2'>" + icon + "</div>" +
        "<div class='col-7 text-truncate'>" + pick.title + "</div>" +
        "<div class='col-3 text-left'>" + pick.points + "</div>" +
      "</div>" + line 
    ); 
  })
}

// Click function for displaying all users ----------------------------------------------
$(".fa-users").click(() => {
  
  $(".fa-user-astronaut").removeClass('selected')
  $(".fa-users").addClass('selected')
  
  pos = 0;
  display(current.all);
  all = current.all
  userInfo(current.all[0])
})

// Click function for displaying only guru's --------------------------------------------
$(".fa-user-astronaut").click(() => {
  
  $(".fa-users").removeClass('selected')
  $(".fa-user-astronaut").addClass('selected')
  
  pos = 0;
  display(current.gurus);
  all = current.gurus
  userInfo(current.gurus[0])
})

// Search Bar ---------------------------------------------------------------------------
$("#search").on('input', function(event) {
  const { value } = event.target
  const res = all.filter((player, i) => 
    player.username.toLowerCase().substr(0, value.length) === value.toLowerCase().trim()
  )
  display(res)
  userInfo(res[0])
});

movieList()

$(document).ready(function(){
  $('[data-toggle="popover"]').popover({ trigger: "hover" });   
});