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

// var form = document.addEventListener("submit", formSubmitHandler);

var coinTypeInput = document.querySelector(".input-group-field");
var convertTypeInput = document.querySelector(".convert-type")
var volumeInput = document.querySelector(".volume");
var aboutModal = document.querySelector(".list-item-2")
var modalbg = document.querySelector(".modal-bg")
var closeBtn = document.getElementById("close-button")
var pastSearches = []

// class customError {
//     constructor(type, message) {
//         this.type = type
//         this.message = message
//     }
// }

// $(function() {
//     var error = $('error')
//   });

$(window).ready(function() {
    console.log('ready')
    addLocalStorageToScreen()       
})

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
        } else {
            displayModal('Bad API Call')
        }
    });
}
// Gets stock prices.
function stockApi(ticker) {
    let apiUrl = "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/prev?adjusted=true&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                if (data.resultsCount != 0) {
                    priceForm.querySelector(".open").textContent = data.results[0].o;
                    priceForm.querySelector(".high").textContent = data.results[0].h;
                    priceForm.querySelector(".low").textContent = data.results[0].l;
                    priceForm.querySelector(".volume").textContent = data.results[0].v;
                    addToLocalStorage(data)
                } else {
                    displayModal('Bad API Call')
                }
            });
        } else {
            displayModal('Bad API Call')
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
            } else {
                displayModal('Bad API Call')
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


// // Makes About Modal Visible
// aboutModal.addEventListener('click',function(){
//     modalbg.classList.add("bg-active");
// });
// // Closes About modal
// closeBtn.addEventListener('click',function(){
//     modalbg.classList.remove("bg-active");
// });

//temporary to get history working
$("#previous-close-price-form").submit(function (event) {
    var inputTest = $(".input-group-field").val().toUpperCase().trim()
    console.log(inputTest)
    event.preventDefault()
    stockApi(inputTest) 
})

function addHistory(tickerObj, count) {
    var html = $(`<div id=${count} class="product-card">
    <div class="product-card-thumbnail">
    <h1>${tickerObj.ticker}</h1>
    </div>
    <ul class="card-list">
    <li>
        <h2 class="product-card-title">Date: ${tickerObj.date}</h2>
    </li>
    <li>
        <h2 class="product-card-title">Close: ${tickerObj.close}</h2>
    </li>
    <li>
        <h2 class="product-card-title">High: ${tickerObj.high}</h2>
    </li>
    <li>
        <h2 class="product-card-title">Low: ${tickerObj.low}</h2>
    </li>
    <li>
        <h2 class="product-card-title">Open: ${tickerObj.open}</h2>
    </li>
    </ul>
    `)

    $('#history-div').append(html)
}

function addToLocalStorage(data) {
    var today = new Date().toISOString().slice(0, 10)
    var dataObj = {}
    dataObj['date'] = today
    dataObj['ticker'] = data.results[0].T
    dataObj['close'] = data.results[0].c
    dataObj['high'] = data.results[0].h
    dataObj['low'] = data.results[0].l
    dataObj['open'] = data.results[0].o

    console.log('in addToLocalStorage function', dataObj.ticker)
    if (!pastSearches.includes(data.ticker) && pastSearches.length < 2) {
        pastSearches.push(dataObj)
        // $('#history-div').append(html)
        localStorage.setItem('searchHistroy', JSON.stringify(pastSearches))

        addLocalStorageToScreen()
    } else if (pastSearches.length >= 2) {
        console.log(pastSearches.shift())
        pastSearches.push(dataObj)
        console.log('in elseif', pastSearches)
        localStorage.setItem('searchHistroy', JSON.stringify(pastSearches))

        addLocalStorageToScreen()
    }
}

function addLocalStorageToScreen() {
    console.log('in addLocalStorageToScreen function')
    $('#history-div').empty()
    $('#history-div').append(`<h1 class="search-history">SEARCH HISTORY</h1>`)
    var searchedStock = {}
    var count = 0
    if (localStorage.getItem('searchHistroy')) {
        pastSearches = JSON.parse(localStorage.getItem('searchHistroy'))
        for (const element of pastSearches) {            
            $.each(pastSearches, function(i, val) {
                searchedStock[i] = val
            })
            console.log(element);
            addHistory(element, count)
            count++
        }
        console.log(searchedStock);
    }
}
// function formSubmitHandler(event) {
//     event.preventDefault();
//     var coinType = coinTypeInput.textContent().toUpperCase().trim();
//     var convertType = convertTypeInput.value.toUpperCase().trim();
//     var volume = parseFloat(volumeInput.value);

//     if (coinType) {
//         if (convertType) {
//             if (typeof (volume) === "number" && volume > 0) {
//                 getInfo(coinType, convertType, volume);
//             } else {
//                 // alert("Please enter a valid amount!");
//                 displayModal("Please enter a valid amount!")                  
//             }
//         } else {
//             //alert("Please enter a valid stock or cryptocurrecty converstion!")
//             displayModal("Please enter a valid stock or cryptocurrecty converstion!")            
//         }
//     } else {
//         //alert("Please enter a valid stock or cryptocurrency!");
//         displayModal("Please enter a valid stock or cryptocurrency!")
//     }
// }
//for error handling
function displayModal(text) {
    var alertColor = "rgba(215, 54, 29, 1)";

    $('#warningBox').hide()
    $('#successBox').hide()
    $('#alertBox').css("background-color", alertColor);
    $('#alert').text(`     ${text}`)
    popup.open();
}


// Getting the Crypto Price
let getCryptoPrice = function (ticker) {
    let apiUrl = `https://api.polygon.io/v2/aggs/ticker/X:${ticker}USD/prev?adjusted=true&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {

                })
            } else {
                displayModal('Bad API Call')
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


