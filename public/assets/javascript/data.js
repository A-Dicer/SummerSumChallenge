$.ajax({ url: "/api/users", method: "GET"})
        .done((res) => { 
            const data = res.results.sort(function(a, b){return a.guru - b.guru})
            res.results.map((user, i)=> {
                $("#data").append("<div>" + (i+1) + " - Name: " + user.username + " / guru: " + user.guru + " / twitter: " + user.twitter + "<hr/></div>")      
            })
        });