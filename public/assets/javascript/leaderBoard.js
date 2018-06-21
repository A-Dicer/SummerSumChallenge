let pos = 0; let group; let gurus; let movies;

$.ajax({
  url: "/players",
  method: "GET"
}).done(function(players) { 
  
  group = players
  gurus = players.filter(player => player.guru)

  display(players);
  setTimeout(function(){
    userInfo(players[0]);
  }, 100)
});

$.ajax({
  url: "/boxoffice",
  method: "GET"
}).done(function(res) { 
  movies = res
  
});

display = (players) =>{

  $("#leaderBoard").html(' ')

  players.forEach( function(player, i) { 
    let guru = ""
    let btn = "btn-light"

    if(player.guru) guru = "<i class='fas fa-user-astronaut guru'></i>";
    if(i === 0) btn = "btn-info";

    $("#leaderBoard").append(
      "<button id='"+ i +"' type='button' class='btn btn-sm " + btn+ " btn-block'>" +
        "<div class='row'>" +
          "<div class='col-1'>" + (i +1) + ":</div>" +
          "<div class='col-7 text-left'>" + player.name + "</div>" +
          "<div class'col-3'>" + player.points + "pts </div><div class='col-1'>" + guru + "</div>" +
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
 
userInfo = (player) =>{
  
  let data = []
  
  player.picks.forEach(function(pick, i){
    let point = '-';
    movies.forEach(function(title, a){
      
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
  data.forEach( function(pick, i) {
    let line = ''
    if(i === 9) line = '<hr>'
    if(pick.points === '-') icon = " <i class='far fa-times-circle'></i>";
    else icon =  "<i class='far fa-check-circle'></i>";
    
    $("#picks").append(
      "<div class='row uds'>" +
        "<div class='col-2'>" + icon + "</div>" +
        "<div class='col-8 text-truncate'>" + pick.title + "</div>" +
        "<div class='col-2 text-left'>" + pick.points + "</div>" +
      "</div>" + line
      
    ); 
  })
}

$(".fa-users").click(function(){
  $(".fa-user-astronaut").removeClass('selected')
  $(".fa-users").addClass('selected')
  pos = 0;
  display(group);
  setTimeout(function(){
    userInfo(group[0]);
  }, 100)
}).addClass('selected')

$(".fa-user-astronaut").click(function(){
  $(".fa-users").removeClass('selected')
  $(".fa-user-astronaut").addClass('selected')
  pos = 0;
  display(gurus);
  setTimeout(function(){
    userInfo(gurus[0]);
  }, 100)
})

                          
                          
                         


 

