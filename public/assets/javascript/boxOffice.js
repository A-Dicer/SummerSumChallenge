
$.ajax({
    url: "/boxoffice",
    method: "GET"
  }).done(function(res) {
     
      
      res.forEach( function(item, i) {
        $("#boxOffice").append(
            "<div class='col-12 data' id='pos" +i +"'> <div class='row'>" +
            "<div class='pos col-1'>" + (i + 1) + ":</div>" + 
            "<div class='title col-7'>" + item.title + "</div>" + 
            "<div class='amount col-4'>" + item.amount + "</div>" +
            "</div></div>"
        );

    })  
  });
