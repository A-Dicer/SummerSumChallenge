let movieData = []; let userData = []

//object for movie Chart -------------------------------------------
let movieStats = {
    chart: {
        height: 320,
        type: 'bar',
        toolbar: {show: false}
    },
    plotOptions: { bar: { horizontal: true, }},
    dataLabels: {enabled: false},
    series: [
        {name: 'Top10', data: []},
        {name: 'Perfect', data: []}],
    xaxis: {categories: [],},
   
    legend: {show: false},
}

//object for users Chart -------------------------------------------
let userStats = {
    chart: {
      height: 265,
      type: 'line',
      zoom: {enabled: false},
      toolbar: {show: false}
    },
    legend: {position: 'top', horizontalAlign: 'right'},
    dataLabels: { enabled: false},
    stroke: {curve: 'straight'},
    series: [
        { name: "Top10 Average",data: []},
        { name: "Perfect Average",data: []},
        { name: "Total Points Average",data: []}
    ],
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], 
        opacity: 0.5
      },
    },
    xaxis: {
        labels: {show: false},
        categories: [],
    }
  }

//gets stats -------------------------------------------------------
stats = () => {
    
    movies[movies.length-1].movies.forEach((movie, i) => {
        correct = 0;
        dark = 0;
        movPos = []
        current.all.forEach((player =>  
            player.picks.forEach(((list, a) => 
                a < 9 
                ?  
                    list === movie 
                    ? (
                        correct++, 
                        !movPos[a]
                            ? movPos[a] = {pos: a+1, val: 1 } 
                            : movPos[a].val++
                    )
                    : null 
                : 
                    list === movie 
                    ? dark++ 
                    : null
            )
        )))

       let filtered = movPos.filter((el) => {return el != null});
        filtered.sort(function(a, b){return b.val - a.val});
        let perfect =  current.all.filter((player) => movie === player.picks[i])
        
        
        data = {
            title: movie,
            top10: correct,
            perf: perfect.length,
            dark: dark,
            topPerc: Math.round((correct / 112) * 100),
            perfPerc: Math.round((perfect.length / 112) * 100),
            darkPerc: Math.round((dark / 112) * 100),
            pos: filtered.length 
                ?
                    {
                        pos: filtered[0].pos,
                        amt: filtered[0].val,
                        perc: Math.round((filtered[0].val / 112) * 100)
                    } 
                : 
                    {
                        pos: "none",
                        amt: '0',
                        perc: ''
                    } 
        }
        
        movieData.push(data)
    })
    
    getAvg()
    getImdb()
}


//gets average -----------------------------------------------------
getAvg = () => {
    movies.forEach((group, i) => {

        let playerDupe = JSON.parse(JSON.stringify(current.all))
        let playerInfo = tally(playerDupe, i)

        let info = {}
        info.top10 = []
        info.perfect = []
        info.total = []

        playerInfo.forEach((player)=> info.total.push(player.points))

        let d = new Date(group.date)
        dateOptions = { month: 'long', day: 'numeric' };
        userStats.xaxis.categories.push(d.toLocaleDateString("en-US" , dateOptions))
        
        group.movies.forEach((title, i)=>{
            
            correct = 0;
            current.all.forEach((player =>  
                player.picks.forEach(((list, i) => i<9 ? list === title ? correct++ : null : null)
            )))
            
            let perfect =  current.all.filter((player) => title === player.picks[i])
           
            info.top10.push(correct)
            info.perfect.push(perfect.length)
       })
       userData.push(info)
    })
}

//gets imdb img ----------------------------------------------------
getImdb = () => {
    movieData.forEach((movie) => 
        $.ajax({ 
            url: `http://www.omdbapi.com/?t=${movie.title.replace("(2019)", "")}&y=2019&apikey=c3f38593`,
             method: "GET"
        })
        .done((res) => { 
            movie.img = `http://img.omdbapi.com/?i=${res.imdbID}&h=6000&apikey=c3f38593`  
        }),
    )
}

//builds Charts ----------------------------------------------------
statData = (pos) => {
    
    movieData.forEach ((movie) => {
        movieStats.series[0].data.push(movie.top10)
        movieStats.series[1].data.push(movie.perf)
    })

    movieStats.xaxis.categories = movies[movies.length-1].movies

    var chart = new ApexCharts(
        document.querySelector("#movieStats"),
        movieStats
    );

    chart.render();

    userData.forEach((numbers)=> {

        let sum = numbers.top10.reduce((a, b) => { return a + b })
        let avg = sum / numbers.top10.length 
        userStats.series[0].data.push(Math.round(avg))

        sum = numbers.perfect.reduce((a, b) => { return a + b })
        avg = sum / numbers.perfect.length 
        userStats.series[1].data.push(Math.round(avg))

        sum = numbers.total.reduce((a, b) => { return a + b })
        avg = sum / numbers.total.length 
        userStats.series[2].data.push(Math.round(avg))
    })
    var chart = new ApexCharts(
        document.querySelector("#userStats"),
        userStats
    );

    chart.render();
}

//updates dom with imdb img ----------------------------------------
statImg = (pos) => {
    $(".movieImg").attr("src", movieData[pos].img)
    $(".fa-user").attr("data-content", `${movieData[pos].top10} (${movieData[pos].topPerc}%)`).html(` ${movieData[pos].top10}`)
    $(".fa-check").attr("data-content", `${movieData[pos].perf} (${movieData[pos].perfPerc}%)`).html(` ${movieData[pos].perf}`)
    $(".fa-horse-head").attr("data-content", `${movieData[pos].dark} (${movieData[pos].darkPerc}%)`).html(` ${movieData[pos].dark}`)
    $(".fa-map-marker-alt").attr("data-content", `Position ${movieData[pos].pos.pos}: ${movieData[pos].pos.amt} (${movieData[pos].pos.perc}%)`).html(` ${movieData[pos].pos.pos}`)
}

//interval to change img -------------------------------------------
let spot = 1
setInterval(function(){ 
    statImg(spot)
    spot < 9
        ? spot++ 
        : spot = 0
}, 12000);

setTimeout(() =>{statData(1)}, 2000)