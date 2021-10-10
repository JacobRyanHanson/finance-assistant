var run = $(document).foundation();

var alertBox = $('#alert')
console.log(alertBox);
let apiUrl = "hps://api.polygon.io/v3/reference/tickers?ticker=BTC&active=true&sort=ticker&order=asc&limit=10&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg";
    fetch(apiUrl)


    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }).then(function(response) {
        console.log("ok");
    }).catch(function(error) {
       update(error);
        console.log(error);        
    });

    var update = function(error) {
			
			
			var new_rgba_str ="rgba(215, 54, 29, 1)";	
             

            alertBox.text(error)
            .css("background-color",new_rgba_str);
     
		}
var coinTypeInput = document.querySelector(".coin-type");
var convertTypeInput = document.querySelector(".convert-type")
var volumeInput = document.querySelector(".volume");
var aboutModal = document.querySelector(".list-item-2")
var modalbg = document.querySelector(".modal-bg")
var closeBtn = document.getElementById("close-button")


// Makes About Modal Visible
aboutModal.addEventListener('click',function(){
    modalbg.classList.add("bg-active");
});
// Closes About modal
closeBtn.addEventListener('click',function(){
    modalbg.classList.remove("bg-active");
});

function formSubmitHandler(event) {
    event.preventDefault();
    var coinType = coinTypeInput.value.toUpperCase().trim();
    var convertType = convertTypeInput.value.toUpperCase().trim();
    var volume = parseFloat(volumeInput.value);
    
    if (coinType) {
        if (convertType) {
            if (typeof (volume) === "number" && volume > 0) {
                getInfo(coinType, convertType, volume);
            } else {
                alert("Please enter a valid amount!");
            }    
        } else {
            alert("Please enter a valid stock or cryptocurrecty converstion!")
        }
    } else {
        alert("Please enter a valid stock or cryptocurrency!");
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
//Get stock prices
let stockApi = function(ticker){
    let apiUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`;
    fetch(apiUrl)
        .then(function(response){
            if(response.ok){
                response.json().then(function(data){
                    console.log(data);
                })
            }
        })
}
//top of page api for featued articles
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
//articles for specific tickers
let getTickerNews = function(ticker){
    let apiUrl = `https://api.polygon.io/v2/reference/news?limit=10&order=descending&sort=published_utc&ticker=${ticker}&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`;
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
// Getting the Crypto Price
let getCryptoPrice = function(ticker){
    let apiUrl = `https://api.polygon.io/v2/aggs/ticker/X:${ticker}USD/prev?adjusted=true&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`
    fetch(apiUrl)
        .then(function(response){
            if(response.ok){
                response.json().then(function(data){
                    console.log(data);
                })
            }
        })
}
getTickerNews("RCAT")
var form = document.addEventListener("submit", formSubmitHandler);
