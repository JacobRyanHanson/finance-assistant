var popup = new Foundation.Reveal($('#exampleModal1'));

var featuredArticles = [
    document.querySelector(".article-0"),
    document.querySelector(".article-1"),
    document.querySelector(".article-2"),
    document.querySelector(".article-3")
]

var priceForm = document.querySelector(".price-form");
var exchangeForm = document.querySelector(".exchange-rates-form")

document.addEventListener("click", inputFocusHandler);
priceForm.addEventListener("submit", priceFormSubmitHandler);
exchangeForm.addEventListener("submit", exchangeFormSubmitHandler);

var tickerHtml = $(`      <!--    TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com" rel="noopener" target="_blank"><span class="blue-text">Quotes</span></a> by TradingView</div>
</div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-tickers.js" async>
  {
  "symbols": [
    {
      "proName": "FOREXCOM:SPXUSD",
      "title": "S&P 500"
    },
    {
      "proName": "FOREXCOM:NSXUSD",
      "title": "Nasdaq 100"
    },
    {
      "proName": "FX_IDC:EURUSD",
      "title": "EUR/USD"
    },
    {
      "proName": "BITSTAMP:BTCUSD",
      "title": "BTC/USD"
    },
    {
      "proName": "BITSTAMP:ETHUSD",
      "title": "ETH/USD"
    }
  ],
  "colorTheme": "light",
  "isTransparent": false,
  "showSymbolLogo": true,
  "locale": "en"
};
</script>`)

// after window is ready adds the ticker and any historical search data to the page
$(window).ready(function () {
    $('#history-div').append(`${tickerHtml}<h1 class="search-history">SEARCH HISTORY</h1>`)
    addLocalStorageToScreen()
})
getFeaturedNews();
// Gets featured news.
function getFeaturedNews() {
    let apiUrl = "https://api.polygon.io/v2/reference/news?limit=10&order=descending&sort=published_utc&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
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
            displayModal('ALERT!:  Bad API Call')
        }
    });
}

function inputFocusHandler(event) {
    if (event.target.matches(".price-input") || event.target.matches(" .base-input") ||
        event.target.matches(".exchange-input") || event.target.matches(".volume-input")) {
        event.target.value = "";
    }
}

function priceFormSubmitHandler(event) {
    event.preventDefault();
    var priceInput = priceForm.querySelector(".price-input").value.toUpperCase().trim();
    if (priceInput) {
        stockApi(priceInput)
    } else {
        displayModal("ALERT!:  Please enter a stock or cryptocurrency.");
    }
}

function exchangeFormSubmitHandler(event) {
    event.preventDefault();
    var baseInput = exchangeForm.querySelector(".base-input").value.toUpperCase().trim();
    var exchangeInput = exchangeForm.querySelector(".exchange-input").value.toUpperCase().trim();
    var volumeInput = exchangeForm.querySelector(".volume-input").value.toUpperCase().trim();

    if (baseInput && exchangeInput && volumeInput) {
        if (parseFloat(volumeInput)) {
            getInfo(baseInput, exchangeInput, volumeInput);
        } else {
            displayModal("ALERT!:  Please enter a number for Conversion Amount")
        }
    } else {
        displayModal("ALERT!:  Please fill all inputs in the form")
    }
}

// Gets stock prices.
function stockApi(ticker) {
    let apiUrl = "https://api.polygon.io/v1/open-close/" + ticker + "/" + getPreviousDate() + "?adjusted=true&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                priceForm.querySelector(".open").textContent = "$" + data.open.toFixed(2);
                priceForm.querySelector(".close").textContent = "$" + data.close.toFixed(2);
                priceForm.querySelector(".high").textContent = "$" + data.high.toFixed(2);
                priceForm.querySelector(".low").textContent = "$" + data.low.toFixed(2);
                
                addToLocalStorage(data)
            });
        } else if (response.status === 404) {
            getCryptoPrice(ticker);
        } else {
            displayModal("ALERT!:  Unexpected Error")
        }
    }).catch(function () {
        displayModal("ALERT!:  Unable to connect to Polygon");
    });
}

// Gets the Crypto Price.
function getCryptoPrice(ticker) {
    let apiUrl = "https://api.polygon.io/v1/open-close/crypto/" + ticker + "/USD/" + getPreviousDate() + "?adjusted=true&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p"

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (data.close > 0) {
                    priceForm.querySelector(".open").textContent = "$" + data.open.toFixed(2);
                    priceForm.querySelector(".close").textContent = "$" + data.close.toFixed(2);
                    priceForm.querySelector(".high").textContent = "--";
                    priceForm.querySelector(".low").textContent = "--";
                    addToLocalStorage(data)
                    
                } else {
                    displayModal("ALERT!:  Not found");
                }
            });
        } else {
            displayModal("ALERT!:  Unexpected Error");
        }
    }).catch(function () {
        displayModal("ALERT!:  Unable to connect to Polygon");
    });
}

function getInfo(coin, exchange, vol) {
    let apiUrl = "https://rest-sandbox.coinapi.io/v1/exchangerate/" + coin + "?apikey=09391D71-51BB-4594-A7C1-9AE2C45D8099";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                
                if (data.rates.length === 0) {
                    displayModal("ALERT!:  Did not regonise Cryptocurrency (Base)");
                } else {
                    var updated = false;
                    for (let i = 0; i < data.rates.length; i++) {
                        if (exchange === data.rates[i].asset_id_quote) {
                            document.querySelector(".exchange-rates-flex-container p").className = "border-visable";
                            document.querySelector(".base-amount").textContent = vol + " ";
                            document.querySelector(".base").textContent = coin + " = ";
                            document.querySelector(".exchange-amount").textContent = (data.rates[i].rate * vol).toFixed(2) + " ";
                            document.querySelector(".exchange").textContent = exchange;
                            updated = true;
                        }
                    }
                    if (!updated) {
                        displayModal("ALERT!:  Did not regonise Cryptocurrency (Exchange)")
                    }
                }
            });
        } else {
            displayModal("ALERT!:  Unexpected error")
        }
    }).catch(function () {
        displayModal("ALERT!:  Unable to connect to Sandbox");
    });
}

function getPreviousDate() {
    var d = new Date();
    var date = d.getFullYear() + "-";
    date += (d.getMonth() + 1) + "-";
    date += (d.getDate() - 1);
    return date;
}

//Adds HTML and data to search history section
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
// after user searches for ticker, check localStorage to see if that item already exists. If so it is removed and the newer entry is 
// added to search history section
function checkForDuplicates(ticker) {
    var tempSearch = []
    pastSearches = JSON.parse(localStorage.getItem('searchHistroy'))
    if (!jQuery.isEmptyObject(pastSearches)) {
        
        for (const element of pastSearches) {
            
            if (element.ticker !== ticker) {
               
                tempSearch.push(element)
            }
        }
    }
    return tempSearch
}

// adds new ticker object to localStorage array
function addToLocalStorage(data) {
    
    var today = new Date().toISOString().slice(0, 10)
    var pastSearches = []
    var dataObj = {}
    dataObj['date'] = today
    dataObj['ticker'] = data.symbol
    dataObj['close'] = data.close
    if (data.high && data.low) {
        dataObj['high'] = data.high
        dataObj['low'] = data.low
    } else {
        dataObj['high'] = "--"
        dataObj['low'] = "--"
    }
    
    dataObj['open'] = data.open
    pastSearches = checkForDuplicates(dataObj.ticker)
    console.log(pastSearches.length)
    if (!pastSearches.length) {
        pastSearches.length = 0
    }
    if (pastSearches.length < 6) {        
        pastSearches.push(dataObj)
        localStorage.setItem('searchHistroy', JSON.stringify(pastSearches))
        addLocalStorageToScreen()
    } else if (pastSearches.length >= 6) {
        pastSearches.shift()
        pastSearches.push(dataObj)
        localStorage.setItem('searchHistroy', JSON.stringify(pastSearches))
        addLocalStorageToScreen()
    }
}

// pulls array from localStorage and writes HTML and ticker data to page
function addLocalStorageToScreen() {
    $('#history-div').empty()
    $('#history-div').append(`<h1 class="search-history">SEARCH HISTORY</h1>`)
    var searchedStock = {}
    var count = 0
    if (localStorage.getItem('searchHistroy')) {
        pastSearches = JSON.parse(localStorage.getItem('searchHistroy'))
        for (const element of pastSearches) {
            $.each(pastSearches, function (i, val) {
                searchedStock[i] = val
            })
            addHistory(element, count)
            count++
        } 
    }
}

function displayModal(text) {
    var alertColor = "rgba(215, 54, 29, 1)";

    $('#alertBox').css("background-color", alertColor);
    $('#alert').text(` ${text}`)
    popup.open();
}