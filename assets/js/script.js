var coinTypeInput = document.querySelector(".coin-type");
var volumeInput = document.querySelector(".volume");
var form = document.addEventListener("submit", formSubmitHandler);


function formSubmitHandler(event) {
    event.preventDefault();
    var coinType = coinTypeInput.value.toUpperCase().trim();
    var volume = parseFloat(volumeInput.value);
    
    if (coinType) {
        coinType = coinType.split(" ");
        if (typeof(volume) === "number" && volume !== 0) {
            getInfo(coinType[0], coinType[1], volume);
        } else {
            alert("Please enter a valid amount!");
        }
    } else {
        alert("Please enter a cryptocurrency!");
    }
}

let getInfo = function (coin, exchange, vol) {
    let apiUrl = `https://rest-sandbox.coinapi.io/v1/exchangerate/${coin}?apikey=09391D71-51BB-4594-A7C1-9AE2C45D8099`;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    display(data, exchange, vol);

                })
            }
        })
}
let display = function (data, coin, volume) {
    let exchange = coin;
    for (let i = 0; i < data.rates.length; i++) {
        if (exchange == data.rates[i].asset_id_quote) {
            // dynamicly put the result on the page instead of window alert
            window.alert((data.rates[i].rate) * volume)
        }
    }
}
<<<<<<< HEAD
let find = function() {
    // use text areas to get this data when they are created
    let coin = window.prompt("Letters for Coin all caps and that to exchange");
    coin = coin.split(" ");
    let vol = window.prompt("How many coins do you want to convert");
   getInfo(coin[0], coin[1], vol);
}
find();
let stockApi = function(){
    let apiUrl = "https://api.polygon.io/v3/reference/tickers?ticker=BTC&active=true&sort=ticker&order=asc&limit=10&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg";
    fetch(apiUrl)
        .then(function(response){
            if(response.ok){
                response.json().then(function(data){
                    console.log(data);
                })
            }
        })
}
let getFeaturedNews = function(){
    let apiUrl = "https://api.polygon.io/v3/reference/news?limit=10&order=descending&sort=published_utc&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg";
    fetch(apiUrl)
        .then(function(response){
            if(response.ok){
                response.json().then(function(data){
                    //here are featured articles using [i+1] and .title and .article_url
                })
            }
        })
}
//passes in ticker
let getTickerNews = function(ticker){
    let apiUrl = `https://api.polygon.io/v3/reference/news?limit=10&order=descending&sort=published_utc&ticker=${ticker}&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`;
    fetch(apiUrl)
        .then(function(response){
            if(response.ok){
                response.json().then(function(data){
                    // stock based articles;
                    console.log(data);
                })
            }
        })
        .catch(function(error){
            console.log("No news for this stock");
        })
}
getTickerNews("RCAT")
=======

let stockApi = function () {}
>>>>>>> 97ed08ad1e7f6e5275fcd16cb38b59b1f8ac5104
stockApi();