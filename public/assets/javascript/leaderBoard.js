let players

$.ajax({
    url: "/players",
    method: "GET"
  }).done(function(players) { 
    display(players)
  });




display = (players) =>{
  players.forEach( function(player, i) { 
    if(player.guru) {
      $("#lb").append(
        "<tr id='player" + i +"'>" +
        "<th scope='row'>" + (i+1) + ":</th>" +
        "<div class='pos col-1'>" + (i + 1) + ":</div>" + 
        "<td>" + player.name + "</td>" + 
        "<td>" + player.points + "pts</td>"+
        "<td><img src='assets/img/guru.png' class='guru' alt=''></td>" +
        "</tr>"
      );
    } else {
      $("#lb").append(
        "<tr id='player" + i +"'>" +
        "<th scope='row'>" + (i+1) + ":</th>" +
        "<div class='pos col-1'>" + (i + 1) + ":</div>" + 
        "<td>" + player.name + "</td>" + 
        "<td>" + player.points + "pts</td>"+
        "<td></td></tr>"
      );
    }
  })  
}

                  
                  
                

