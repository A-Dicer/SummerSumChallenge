let pos = 0; let group; let gurus; let movies;

// Gets players from api ----------------------------------------------------------------
$.ajax({ url: "/players", method: "GET"})
  .done((players) => { 
    group = players
    display(players);
    setTimeout(() => { userInfo(players[0])}, 100)
  });

  $.ajax({ url: "/gurus", method: "GET"})
  .done((res) => { gurus = res });


// Gets box office results from api -----------------------------------------------------
$.ajax({ url: "/boxoffice", method: "GET"})
  .done((res) => { movies = res });

// Function for displaying information into leader board --------------------------------
display = (players) => {

  $("#leaderBoard").html(' ')

  players.forEach((player, i) => { 
    let guru = ""
    let btn = "btn-light"
    let move = "-"

    if(player.guru) guru = "<i class='fas fa-user-astronaut guru'></i> ";
    if(i === 0) btn = "btn-info";
    if(player.direction === "up") move = "<i class='fas fa-arrow-up'></i> " + player.movement
    if(player.direction === "down") move = "<i class='fas fa-arrow-down'></i> " + player.movement

    $("#leaderBoard").append(
      "<button id='"+ i +"' type='button' class='btn btn-sm " + btn+ " btn-block'>" +
        "<div class='row'>" +
          "<div class='col-1'>" + player.pos + ":</div>" +
          "<div class='col-7 text-left'>" + guru + player.name + "</div>" +
          "<div class'col-2'>" + player.points + "pts </div>" + 
          "<div class='col-1'>" + move + "</div>" +   
        "</div>" +
      "</button>"
    );
  })  

  $("button").click(function(){
    userInfo(players[$(this).attr('id')]);
    $("#" + pos).removeClass('btn-info').addClass('btn-light')
    pos = $(this).attr('id');
    $(this).removeClass('btn-light').addClass('btn-info')
  })
}

// Function for displaying information about selected user ------------------------------
userInfo = (player) =>{
  
  let data = []
  
  player.picks.forEach((pick, i) => {
    let point = '-';
    movies.forEach((title, a) => {
      if(pick === title.title && i < 10){
          if(a === i) point = 10;
          else point = (8 - Math.abs(i-a));
      }
      else if(pick === title.title ) point = 1;
    }) 
    data.push({ title: pick, points: point})  
  })

  $("#playerImg, .userBgImg").attr('src', player.img);
  $(".card-title").text(player.name + " - " + player.points + " Points")
      
  $("#picks").html(' ')
  data.forEach((pick, i) => {
    let line = ''
    if(i === 9) line = '<hr>'

    pick.points === '-'
    ? icon = " <i class='far fa-times-circle down'></i>"
    : icon =  "<i class='far fa-check-circle up'></i>"
    
    $("#picks").append(
      "<div class='row uds'>" +
        "<div class='col-2'>" + icon + "</div>" +
        "<div class='col-8 text-truncate'>" + pick.title + "</div>" +
        "<div class='col-2 text-left'>" + pick.points + "</div>" +
      "</div>" + line
      
    ); 
  })
}

// Click function for displaying all users ----------------------------------------------
$(".fa-users").click(() => {
  
  $(".fa-user-astronaut").removeClass('selected')
  $(".fa-users").addClass('selected')
  
  pos = 0;
  display(group);
  setTimeout(() => { userInfo(group[0])}, 100)})

// Click function for displaying only guru's --------------------------------------------
$(".fa-user-astronaut").click(() => {
  
  $(".fa-users").removeClass('selected')
  $(".fa-user-astronaut").addClass('selected')
  
  pos = 0;
  display(gurus);
  setTimeout(() => { userInfo(gurus[0])}, 100)
})