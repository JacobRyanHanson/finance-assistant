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

$(window).ready(function () {
    $('#history-div').append(`<h1 class="search-history">SEARCH HISTORY</h1>`)
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
                console.log(data)
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
                    console.log(data)
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
                console.log(data)
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

$(".card-list").click(function (event) {
    console.log("clicked: " + event.target);
});


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

function checkForDuplicates(ticker) {
    var tempSearch = []
    pastSearches = JSON.parse(localStorage.getItem('searchHistroy'))
    if (!jQuery.isEmptyObject(pastSearches)) {
        console.log('in if statement')
        for (const element of pastSearches) {
            console.log('in for statement element.ticker= ', element.ticker, 'ticker= ', ticker)
            if (element.ticker != ticker) {
                console.log('false')
                tempSearch.push(element)
            }
        }
        console.log(tempSearch);
        return tempSearch
    }
}

function addToLocalStorage(data) {
    console.log(data)
    var today = new Date().toISOString().slice(0, 10)
    var pastSearches = []
    var dataObj = {}
    dataObj['date'] = today
    dataObj['ticker'] = data.symbol
    dataObj['close'] = data.close
    dataObj['high'] = data.high
    dataObj['low'] = data.low
    dataObj['open'] = data.open

    pastSearches = checkForDuplicates(dataObj.ticker)

    console.log(pastSearches)
    console.log('in addToLocalStorage function', dataObj.ticker)
    console.log(pastSearches.length)
    if (!pastSearches.length) {
        pastSearches.length = 0
    }
    if (pastSearches.length < 7) {
        console.log(pastSearches, dataObj.ticker)
        pastSearches.push(dataObj)
        localStorage.setItem('searchHistroy', JSON.stringify(pastSearches))

        addLocalStorageToScreen()
    } else if (pastSearches.length >= 7) {
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
            $.each(pastSearches, function (i, val) {
                searchedStock[i] = val
            })
            console.log(element);
            addHistory(element, count)
            count++
        }
        console.log(searchedStock);
    }
}

function displayModal(text) {
    var alertColor = "rgba(215, 54, 29, 1)";

    $('#alertBox').css("background-color", alertColor);
    $('#alert').text(` ${text}`)
    popup.open();
}