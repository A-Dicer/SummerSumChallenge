$.ajax({
    url: "/boxoffice",
    method: "GET"
  }).done(function(res) {
      res.forEach( function(item, i) {
        $("tbody").append(
            "<tr>" +
                "<th scope='row'>" + (i+1) + "</th>" +    
                "<td class='text-truncate'>" + item.title + "</td>" + 
                "<td>" + item.amount + "</td>" +
            "</tr>"
        );
    })       
});
