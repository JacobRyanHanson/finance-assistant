//TODO: Search History
//TODO: Make Forms Work
//TODO: Make Modals Work

var popup = new Foundation.Reveal($('#exampleModal1'))
var featuredArticles = [
    document.querySelector(".article-0"),
    document.querySelector(".article-1"),
    document.querySelector(".article-2"),
    document.querySelector(".article-3")
]

var priceForm = document.querySelector(".price-form");

var form = document.addEventListener("submit", formSubmitHandler);

var coinTypeInput = document.querySelector(".coin-type");
var convertTypeInput = document.querySelector(".convert-type")
var volumeInput = document.querySelector(".volume");
var aboutModal = document.querySelector(".list-item-2")
var modalbg = document.querySelector(".modal-bg")
var closeBtn = document.getElementById("close-button")

getFeaturedNews();
// Gets featured news.
function getFeaturedNews() {
    let apiUrl = "https://api.polygon.io/v2/reference/news?limit=10&order=descending&sort=published_utc&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);
                for (var i = 0; i < featuredArticles.length; i++) {
                    featuredArticles[i].setAttribute("href", data.results[i].article_url);
                    if (data.results[i].image_url) {
                        featuredArticles[i].querySelector(".featured-image").style.backgroundImage = "url('" + data.results[i].image_url + "')";
                    } else {
                        featuredArticles[i].querySelector(".featured-image").style.backgroundImage = "url('./assets/images/piggy-bank-icon.jpg')";
                    }
                    
                    featuredArticles[i].querySelector(".featured-article-title").textContent = data.results[i].title;
                    featuredArticles[i].querySelector(".featured-article-author").textContent = data.results[i].publisher.name;
                }
            });
        }
    });
}
// Gets stock prices.
function stockApi(ticker) {
    let apiUrl = "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/prev?adjusted=true&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);
                priceForm.querySelector(".open").textContent = data.results[0].o;
                priceForm.querySelector(".high").textContent = data.results[0].h;
                priceForm.querySelector(".low").textContent = data.results[0].l;
                priceForm.querySelector(".volume").textContent = data.results[0].v;
                
            });
        }
    });
}

getInfo("BTC", "ETH", 1);

function getInfo(coin, exchange, vol) {
    let apiUrl = `https://rest-sandbox.coinapi.io/v1/exchangerate/${coin}?apikey=09391D71-51BB-4594-A7C1-9AE2C45D8099`;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
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
            // window.alert((data.rates[i].rate) * volume)
        }
    }
}

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
                // alert("Please enter a valid amount!");
                displayModal("Please enter a valid amount!")                  
            }
        } else {
            //alert("Please enter a valid stock or cryptocurrecty converstion!")
            displayModal("Please enter a valid stock or cryptocurrecty converstion!")            
        }
    } else {
        //alert("Please enter a valid stock or cryptocurrency!");
        displayModal("Please enter a valid stock or cryptocurrency!")
    }
}

function displayModal (text){
    var new_rgba_str ="rgba(215, 54, 29, 1)";	
            
    $('#warningBox').hide()
    $('#successBox').hide()
    $('#alertBox').css("background-color",new_rgba_str);
    $('#alert').text(text)
    popup.open();
}


// Getting the Crypto Price
let getCryptoPrice = function (ticker) {
    let date = moment().format("YYYY-MM-DD");
    let apiUrl = `https://api.polygon.io/v1/open-close/crypto/${ticker}/USD/${date}?adjusted=true&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                })
            }
        })
}

// getTickerNews("RCAT")
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
//}
