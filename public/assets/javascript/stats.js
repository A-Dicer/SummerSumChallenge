let movieData = []; let userData = []; let movieInfo

$.ajax({url: `/movieData/`,method: "GET"}).done((res) => {movieInfo = res.results})

//object for movie Chart -------------------------------------------
let movieStats = {
    chart: {
        height: 200,
        type: 'bar',
        toolbar: {show: false}
    },
    plotOptions: { bar: { horizontal: true, }},
    dataLabels: {enabled: false},
    series: [
        {name: 'Top10', data: []},
        {name: 'Perfect', data: []}],
    xaxis: {
        categories: [],
        labels: {show: false} 
    },
   
    legend: {show: false},
   
}

//object for users Chart -------------------------------------------
let userStats = {
    chart: {
      height: 400,
      type: 'line',
      zoom: {enabled: false},
      toolbar: {show: false}
    },
    legend: { position: 'top', horizontalAlign: 'right'},
    dataLabels: {enabled: false},
    stroke: {curve: 'straight', lineCap: 'round',},
    series: [],
    colors: ['#33b2df', '#AB61FF', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e', '#f48024'],
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], 
        opacity: 0.5
      },
    },
    xaxis: {
        labels: {
            show: false,
            formatter: function (value) {
                return `Day ${value-1}`
            }
        },
        categories: [],
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                if(value === 0) return `$0`
                else if(value === 1000) return `$1 (B)`
                else if(value !== null) return `$${value} (M)`;

            }
        } 
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
                a < 10
                ?  
                    list === movie.title 
                    ? (
                        correct++, 
                        !movPos[a]
                            ? movPos[a] = {pos: a+1, val: 1 } 
                            : movPos[a].val++
                    )
                    : null 
                : 
                    list === movie.title
                    ? dark++ 
                    : null
            )
        )))

        let filtered = movPos.filter((el) => {return el != null});
        filtered.sort(function(a, b){return b.val - a.val});
        let perfect =  current.all.filter((player) => movie.title === player.picks[i])
        
        
        data = {
            title: movie.title,
            amount: movie.amount,
            top10: correct,
            perf: perfect.length,
            dark: dark,
            // img: getImdb(movie.title),
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
        
        group.movies.forEach((title, i)=>{
            
            correct = 0;
            current.all.forEach((player =>  
                player.picks.forEach(((list, i) => i<10 ? list === title.title ? correct++ : null : null)
            )))
            
            let perfect =  current.all.filter((player) => title.title === player.picks[i])
           
            info.top10.push(correct)
            info.perfect.push(perfect.length)
       })
       userData.push(info)
    })
}

//gets imdb img ----------------------------------------------------
getImdb = (title) => {
    
    movieData.forEach((movie) => 
        $.ajax({ 
            url: `https://www.omdbapi.com/?t=${movie.title.replace("(2019)", "")}&y=2019&apikey=c3f38593`,
             method: "GET"
        })
        .done((res) => { 
            movie.img =  res.Poster.replace("300", "800") 
        })
    )
}



//builds Charts ----------------------------------------------------
statData = (pos) => {
   
    movieData.forEach ((movie, i) => {
        movieStats.series[0].data.push(movie.top10)
        movieStats.series[1].data.push(movie.perf)
        movieStats.xaxis.categories.push(movie.title)
    })

    var chart = new ApexCharts(
        document.querySelector("#movieStats"),
        movieStats
    );

    chart.render();

// climb fall ------------------- needs to be finished. ----------------------------------------------
        let playerDupe = JSON.parse(JSON.stringify(current.all))
        let playerInfo = tally(playerDupe, [movies.length-1])

        let up = playerInfo.filter((player)=> player.direction === "up")
        let down = playerInfo.filter((player)=> player.direction === "down")
      
        up.sort(function compareNumbers(a, b){ return b.movement - a.movement })
        down.sort(function compareNumbers(a, b){ return b.movement - a.movement })
        
        
        let downResults = down.filter((player)=> player.movement === down[0].movement)
        let upResults = up.filter((player)=> player.movement === up[0].movement)
        // console.log(up.filter((player)=> player.movement === 11))
        // console.log(downResults)

// should be top10 ------------------------------------------------------------------------------------
        let top10movies =[]

        $.ajax({url: `/movieData/`,method: "GET"})
        .done((res) => { 
            
            top10movies = res.results 
            
            movieData.forEach((movie)=>{ top10movies = top10movies.filter((top10) => top10.title !== movie.title)})

           let comingSoon = top10movies.filter((top10) => new Date(top10.date).getTime() > Date.now())
            
           
            $("#weekData").append(`
                <h5>---- User Moves ----</h5>
                    ${upResults[0].username} - <i class='fas fa-arrow-up'></i> ${upResults[0].movement} to position ${upResults[0].pos}
                    <br>
                    ${downResults[0].username} - <i class='fas fa-arrow-down'></i> ${downResults[0].movement} to position ${downResults[0].pos}
                <h5>------ Coming Soon  ------</h5>
                1: ${comingSoon[0].title} - ${comingSoon[0].date}
                <br>
                2: ${comingSoon[1].title} - ${comingSoon[1].date}
                <br>
                3: ${comingSoon[2].title} - ${comingSoon[2].date}
            `)

        })
        

$.ajax({ url: `/api/movies/daily/`,method: "GET"})
    .done((res) => {  
        userStats.series = res.results
        userStats.series.forEach((series)=>{series.data.unshift(0)})

        var chart = new ApexCharts(
            document.querySelector("#userStats"),
            userStats
        );
    
        chart.render();
    })
   
}

//updates dom with imdb img ----------------------------------------
statImg = (pos) => {
    $(`.movBtn`).addClass("fa-circle").removeClass("fa-dot-circle")
    $(`#c${pos}`).addClass("fa-dot-circle").removeClass("fa-circle")
    $(".movieImg").attr("src", movieData[pos].img)
    $(".fa-user").attr("data-content", `${movieData[pos].top10} (${movieData[pos].topPerc}%)`).html(` ${movieData[pos].top10}`)
    $(".fa-check").attr("data-content", `${movieData[pos].perf} (${movieData[pos].perfPerc}%)`).html(` ${movieData[pos].perf}`)
    $(".fa-horse-head").attr("data-content", `${movieData[pos].dark} (${movieData[pos].darkPerc}%)`).html(` ${movieData[pos].dark}`)
    $(".fa-map-marker-alt").attr("data-content", `Position ${movieData[pos].pos.pos}: ${movieData[pos].pos.amt} (${movieData[pos].pos.perc}%)`).html(` ${movieData[pos].pos.pos}`)
}

//interval to change img -------------------------------------------
let spot = 1
const movieSwap = setInterval(function(){statImg(spot), spot < 9 ? spot++ : spot = 0}, 6000);

$(".movBtn").click((event)=>{
    clearInterval(movieSwap);
    statImg(event.target.value)
})

setTimeout(() =>{statData(1)}, 3000)