var featuredArticles = [
    document.querySelector(".article-0"),
    document.querySelector(".article-1"),
    document.querySelector(".article-2"),
    document.querySelector(".article-3")
]

var coinTypeInput = document.querySelector(".coin-type");
var convertTypeInput = document.querySelector(".convert-type")
var volumeInput = document.querySelector(".volume");
var aboutModal = document.querySelector(".list-item-2")
var modalbg = document.querySelector(".modal-bg")
var closeBtn = document.getElementById("close-button")

// Gets featured news and displays it to the page.
getFeaturedNews();

function getFeaturedNews() {
    let apiUrl = "https://api.polygon.io/v2/reference/news?limit=10&order=descending&sort=published_utc&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                for (var i = 0; i < featuredArticles.length; i++) {
                    featuredArticles[i].setAttribute("href", data.results[i].article_url);
                    featuredArticles[i].setAttribute("target", "_blank");
                    featuredArticles[i].querySelector(".featured-image").style.backgroundImage = "url('" + data.results[i].image_url + "')";
                    featuredArticles[i].querySelector(".featured-article-title").textContent = data.results[i].title;
                    featuredArticles[i].querySelector(".featured-article-author").textContent = data.results[i].publisher.name;
                }
            });
        }
    });
}
stockApi("GOOGL");
// Gets stock prices.
function stockApi(ticker) {
    let apiUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                
            });
        }
    });
}

// // Makes About Modal Visible
// aboutModal.addEventListener('click',function(){
//     modalbg.classList.add("bg-active");
// });
// // Closes About modal
// closeBtn.addEventListener('click',function(){
//     modalbg.classList.remove("bg-active");
// });

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



// Getting the Crypto Price
let getCryptoPrice = function (ticker) {
    let apiUrl = `https://api.polygon.io/v2/aggs/ticker/X:${ticker}USD/prev?adjusted=true&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                })
            }
        })
}
// getTickerNews("RCAT")
var form = document.addEventListener("submit", formSubmitHandler);

//passes in ticker
//articles for specific tickers
// let getTickerNews = function (ticker) {
//     let apiUrl = `https://api.polygon.io/v2/reference/news?limit=10&order=descending&sort=published_utc&ticker=${ticker}&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`;
//     fetch(apiUrl)
//         .then(function (response) {
//             if (response.ok) {
//                 response.json().then(function (data) {
//                     // stock based articles;

//                 })
//             }
//         })
//         .catch(function (error) {

//         })
// }