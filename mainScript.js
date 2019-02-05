$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "Pages/Main.html",
        success: function (result) {
            $("#navcont").append(result);
            getCoins();
        },
        error: function (error) {
            $("#navcont").html("Failed to retrieve navbar, check for missing files, error code:" + error.statusText + error.status);
        }
    });
    $.ajax({
        type: "GET",
        url: "Pages/TooManyCoinsModal.html",
        success: function (result) {
            $("#modalcont").append(result);
        },
        error: function (error) {
            console.log("Failed to retrieve Modal file");
        }
    });
});
function getCoins() {
    startLoader();
    $.ajax({
        type: "GET",
        url: "https://api.coingecko.com/api/v3/coins/list",
        success: function (result) {
            stopLoader();
            primeButtons();
            setupSearch();
            console.log(result);
            homeStart(result);
        },
        error: function (error) {
            stopLoader();
            $("#pagecont").html("Could not retrieve data from api error:" + error.statusText + error.status);
        }
    });
}
function homeStart(coins) {
    //comment about the comment below me - its a damn liar and dont listen to it, its VERY needed for the search, and you just fucked it up so go fix it
    //important note! this line: 'id="${coins[i].symbol.toUpperCase()+"a1"}"' isn't necessary, but is kept inside for further development options, also the a1 part is to avoid a bug with 1337 that i still dont 100% understand but its fixed
    var divcreate = document.createElement("div");
    for (var i = 0; i < 100; i++) {
        // console.log(coins[i]);
        divcreate.innerHTML += "\n        <div class=\"card text-dark bg-dark m-auto makeinline\" id=\"" + coins[i].id + i + "\" style=\"max-width: 18rem;\">\n            <div class=\"card-header\">\n                <div class=\"flexalign\">\n                    <span class=\"coinsymbol\" id=\"" + (coins[i].symbol.toUpperCase() + "a1") + "\">" + coins[i].symbol.toUpperCase() + "</span>\n                    <label class=\"switch\">\n                        <input type=\"checkbox\" id=\"" + coins[i].id + coins[i].symbol + "\" onchange=\"selectedCoinUpdate(this,'" + coins[i].symbol + "')\"> \n                        <span class=\"slider round\"></span>\n                    </label>\n                </div>\n            </div>\n            <div class=\"card-body\">\n                <div class=\"\">\n                    <h5 class=\"card-title coinname\">" + coins[i].name + "</h5>\n                    <button type=\"button\" class=\"btn btn-secondary\" data-toggle=\"collapse\" href=\"#collapseIdentity" + i + "\" role=\"button\"\n                    aria-expanded=\"false\" aria-controls=\"collapseIdentity" + i + "\" onclick=\"moreInfo('" + coins[i].id + "')\">More info</button>\n                </div>\n                <div class=\"collapse\" id=\"collapseIdentity" + i + "\">\n                    <div class=\"card-body\" id=\"" + coins[i].id + "\">\n                    \n                    </div>\n                </div>\n            </div>\n        </div>";
    }
    $("#pagecont").append(divcreate);
}
function startLoader() {
    $("#pagecont").append("\n    <div class=\"d-flex justify-content-center\" id=\"loadingcircle\">\n    <div class=\"spinner-border text-primary\" role=\"status\">\n    <span class=\"sr-only\">Loading...</span>\n    </div>\n    </div>\n    ");
}
function stopLoader() {
    $("#loadingcircle").remove();
}
var selectedcoins = [];
var graphdata = [];
var updater;
function moreInfo(coinid) {
    console.log(coinid);
    var coin = JSON.parse(localStorage.getItem(coinid));
    if (coin != null) {
        console.log("local storage is not null amigo");
        if (coin.time + 120000 < Date.now()) {
            console.log("shit man this data is too old now lemme get a fresh copy");
            startInfoLoader(coinid);
            $.ajax({
                type: "GET",
                url: "https://api.coingecko.com/api/v3/coins/" + coinid,
                success: function (result) {
                    stopInfoLoader(coinid);
                    result.time = Date.now();
                    localStorage.setItem(coinid, JSON.stringify(result));
                    var usdprice = Math.floor(result.market_data.current_price.usd * 10000) / 10000;
                    var eurprice = Math.floor(result.market_data.current_price.eur * 10000) / 10000;
                    var ilsprice = Math.floor(result.market_data.current_price.ils * 10000) / 10000;
                    $("#" + coinid).html("\n                    <div class=\"moreinfocont\">\n                    <img class=\"coinimg\" src=\"" + result.image.small + "\" />\n                    <span class=\"displaycurrency\">USD: " + usdprice.toFixed(4) + "$</span>\n                    <span class=\"displaycurrency\">EUR: " + eurprice.toFixed(4) + "\u20AC</span>\n                    <span class=\"displaycurrency\">ILS: " + ilsprice.toFixed(4) + "\u20AA</span>\n                    </div>\n                    ");
                },
                error: function (error) {
                    $("#" + coinid).html("\n                    Could not retrieve data from api error:" + error.statusText + error.status + "\n                    ");
                }
            });
        }
        //This else is in case the information existing in localstorage isnt too old (2 minutes is the cutoff)
        else {
            console.log("why go to the store when we have perfectly good data already here");
            var usdprice = Math.floor(coin.market_data.current_price.usd * 10000) / 10000;
            var eurprice = Math.floor(coin.market_data.current_price.eur * 10000) / 10000;
            var ilsprice = Math.floor(coin.market_data.current_price.ils * 10000) / 10000;
            $("#" + coinid).html("\n            <div class=\"moreinfocont\">\n            <img class=\"coinimg\" src=\"" + coin.image.small + "\" />\n            <span class=\"displaycurrency\">USD: " + usdprice.toFixed(4) + "$</span>\n            <span class=\"displaycurrency\">EUR: " + eurprice.toFixed(4) + "\u20AC</span>\n            <span class=\"displaycurrency\">ILS: " + ilsprice.toFixed(4) + "\u20AA</span>\n            </div>\n            ");
        }
    }
    //This else is in case whats in localstorage is null(it is checked by ID)
    else {
        console.log("there is nothing with the correct id in the localstorage so ima get you a fresh copy of all those coins and shit");
        startInfoLoader(coinid);
        $.ajax({
            type: "GET",
            url: "https://api.coingecko.com/api/v3/coins/" + coinid,
            success: function (result) {
                stopInfoLoader(coinid);
                result.time = Date.now();
                localStorage.setItem(coinid, JSON.stringify(result));
                var usdprice = Math.floor(result.market_data.current_price.usd * 10000) / 10000;
                var eurprice = Math.floor(result.market_data.current_price.eur * 10000) / 10000;
                var ilsprice = Math.floor(result.market_data.current_price.ils * 10000) / 10000;
                $("#" + coinid).html("\n                <div class=\"moreinfocont\">\n                <img class=\"coinimg\" src=\"" + result.image.small + "\" />\n                <span class=\"displaycurrency\">USD: " + usdprice.toFixed(4) + "$</span>\n                <span class=\"displaycurrency\">EUR: " + eurprice.toFixed(4) + "\u20AC</span>\n                <span class=\"displaycurrency\">ILS: " + ilsprice.toFixed(4) + "\u20AA</span>\n                </div>\n                ");
            },
            error: function (error) {
                $("#" + coinid).html("\n                Could not retrieve data from api error:" + error.statusText + error.status + "\n                ");
            }
        });
    }
}
function startInfoLoader(coinid) {
    $("#" + coinid).append("\n    <div class=\"d-flex justify-content-center\" id=\"loadingcircle" + coinid + "\">\n    <div class=\"spinner-border text-light\" role=\"status\">\n    <span class=\"sr-only\">Loading...</span>\n    </div>\n    </div>\n    ");
}
function stopInfoLoader(coinid) {
    $("#loadingcircle" + coinid).remove();
}
function selectedCoinUpdate(cointoggle, coinsymbol) {
    var uppercoinsymbol = coinsymbol.toUpperCase();
    var cointoggleid = cointoggle.getAttribute("id");
    if (selectedcoins.length >= 5 && cointoggle.checked) {
        console.log("too many coins");
        console.log(coinsymbol);
        cointoggle.checked = false;
        var modalbody = document.createElement("div");
        modalbody.innerHTML = "";
        for (var i = 0; i < selectedcoins.length; i++) {
            console.log(selectedcoins[i]);
            modalbody.innerHTML += "\n                <div  class=\"modalbodycoin bg-primary text-light m-2\" onclick=\"changeSelected(this.innerHTML,'" + uppercoinsymbol + "','" + cointoggleid + "','" + selectedcoins[i].id + "')\">" + selectedcoins[i].code + "</div>\n            ";
        }
        $("#modalbodymessage").append(modalbody);
        //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize modal method)
        $('#toomanycoinsmodal').modal({ backdrop: 'static', keyboard: false });
        //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize modal method)
        $('#toomanycoinsmodal').modal('show');
    }
    else {
        console.log(cointoggle);
        if (cointoggle.checked) {
            selectedcoins.push({
                "code": uppercoinsymbol,
                "id": cointoggleid
            });
            updateCoinSpan();
            console.log(selectedcoins);
        }
        else {
            //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize jquery)
            var coinindex = selectedcoins.findIndex(function (coins) {
                return coins.id == cointoggleid;
            });
            console.log(coinindex);
            selectedcoins.splice(coinindex, 1);
            updateCoinSpan();
            console.log(selectedcoins);
        }
    }
}
function changeSelected(cointoremove, cointoadd, cointoaddid, cointoremoveid) {
    console.log(cointoremoveid);
    console.log(cointoaddid);
    console.log(cointoremove);
    console.log(cointoadd);
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize jquery)
    var coinindex = selectedcoins.findIndex(function (coins) {
        return coins.id == cointoremoveid;
    });
    console.log(coinindex);
    selectedcoins.splice(coinindex, 1, {
        "code": cointoadd,
        "id": cointoaddid
    });
    updateCoinSpan();
    $("#modalbodymessage").html("Please select which coin to unselect in favor of the coin you just clicked");
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize modal method)
    $('#toomanycoinsmodal').modal('hide');
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize checked value)
    $("#" + cointoaddid)[0].checked = true;
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize checked value)
    $("#" + cointoremoveid)[0].checked = false;
}
function closedModal() {
    $("#modalbodymessage").html("Please select which coin to unselect in favor of the coin you just clicked");
}
function primeButtons() {
    console.log("primebuttons works");
    $("#homepage").on('click', function () {
        $("#livereport").removeClass("linkdisable");
        $("#about").removeClass("linkdisable");
        $("#aboutcont").html("");
        clearInterval(updater);
        graphdata.splice(0, graphdata.length);
        $("#graphcont").addClass("disappear");
        $("#graphcont").html("");
        $("#pagecont").removeClass("disappear");
        $("#livereport").removeClass("active");
        $("#about").removeClass("active");
        $("#homepage").addClass("active");
        $("#searchform").removeClass("disappear");
    });
    $("#livereport").on('click', function () {
        $("#livereport").addClass("linkdisable");
        $("#about").removeClass("linkdisable");
        $("#aboutcont").html("");
        startLoader();
        $.ajax({
            type: "GET",
            url: "Pages/Coingraph.html",
            success: function (result) {
                stopLoader();
                $("#pagecont").addClass("disappear");
                $("#graphcont").html("");
                $("#graphcont").append(result);
                $("#graphcont").removeClass("disappear");
                $("#searchform").addClass("disappear");
                $("#homepage").removeClass("active");
                $("#about").removeClass("active");
                $("#livereport").addClass("active");
                getPrices();
                // paintGraph();
            },
            error: function (error) {
                stopLoader();
                console.log("error getting graph page");
            }
        });
    });
    $("#about").on('click', function () {
        $("#about").addClass("linkdisable");
        $("#livereport").removeClass("linkdisable");
        $("#pagecont").addClass("disappear");
        $("#graphcont").html("");
        $("#graphcont").addClass("disappear");
        $("#searchform").addClass("disappear");
        clearInterval(updater);
        graphdata.splice(0, graphdata.length);
        $("#homepage").removeClass("active");
        $("#livereport").removeClass("active");
        $("#about").addClass("active");
        getAbout();
    });
}
function paintGraph(apiinfo, sendurl) {
    console.log(apiinfo);
    console.log(apiinfo.time);
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript definitions issue)
    var infoarr = Object.entries(apiinfo);
    for (var i = 0; i < (infoarr.length - 1); i++) {
        var randomcolor = getRandomColor();
        graphdata[i] =
            {
                type: "line",
                showInLegend: true,
                name: infoarr[i][0],
                markerType: "circle",
                lineDashType: "solid",
                xValueFormatString: "DD MMM, YYYY",
                color: randomcolor,
                dataPoints: [
                    { x: apiinfo.time, y: infoarr[i][1].USD },
                ]
            };
    }
    console.log(graphdata);
    console.log(infoarr);
    // graphdata.length = selectedcoins.length;
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript definitions issue)
    window.chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Selected CryptoCurrencies price in USD"
        },
        axisX: {
            valueFormatString: "hh:mm:ss",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title: "Price in USD",
            crosshair: {
                enabled: true
            }
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "left",
            dockInsidePlotArea: false,
            itemclick: toogleDataSeries
        },
        data: graphdata
    });
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript definitions issue)
    window.chart.render();
    function toogleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript definitions issue)
        window.chart.render();
    }
    updater = setInterval(function () {
        updateGraph(sendurl);
    }, 2000);
}
function getPrices() {
    var urlarr = [];
    var sendurl = "";
    console.log(selectedcoins);
    for (var i = 0; i < selectedcoins.length; i++) {
        if (i == (selectedcoins.length - 1)) {
            urlarr[i] = selectedcoins[i].code;
            sendurl += urlarr[i];
            console.log(sendurl);
        }
        else {
            urlarr[i] = selectedcoins[i].code;
            sendurl += urlarr[i] + ",";
            console.log(sendurl);
        }
    }
    $.ajax({
        type: "GET",
        url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + sendurl + "&tsyms=USD",
        success: function (result) {
            if (result.Response == "Error") {
                alert("Selected coins have no value to show in the API, going back home");
                $("#livereport").removeClass("linkdisable");
                $("#about").removeClass("linkdisable");
                $("#searchform").removeClass("disappear");
                $("#graphcont").addClass("disappear");
                $("#graphcont").html("");
                $("#pagecont").removeClass("disappear");
                $("#livereport").removeClass("active");
                $("#about").removeClass("active");
                $("#homepage").addClass("active");
            }
            else {
                console.log("it didnt fail what now");
                result.time = new Date();
                paintGraph(result, sendurl);
            }
        },
        error: function (error) {
            console.log("got into error");
            console.log(error);
        }
    });
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function updateGraph(sendurl) {
    console.log("updated graph");
    $.ajax({
        type: "GET",
        url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + sendurl + "&tsyms=USD",
        success: function (result) {
            result.time = new Date();
            updateGraphSuccess(result);
        },
        error: function (error) {
            console.log("failed retrieving new information for graph");
        }
    });
}
function updateGraphSuccess(newInfo) {
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript definitions issue)
    var updategraphinfo = Object.entries(newInfo);
    // console.log(updategraphinfo);
    // console.log(graphdata);
    for (var i = 0; i < (updategraphinfo.length - 1); i++) {
        graphdata[i].dataPoints.push({
            x: newInfo.time,
            y: updategraphinfo[i][1].USD
        });
    }
    console.log(graphdata);
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript definitions issue)
    window.chart.render();
}
function getAbout() {
    $.ajax({
        type: "GET",
        url: "Pages/About.html",
        success: function (result) {
            console.log(result);
            console.log((document.getElementById("aboutcont")));
            $("#aboutcont").append(result);
        },
        error: function (error) {
            console.log("failed to retrieve about page");
        }
    });
}
function setupSearch() {
    $("#searchbtn").on('click', function () {
        console.log("search happened");
        //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript definitions issue)
        var searchvalue = $("#searchinput").val().toUpperCase();
        console.log(searchvalue);
        console.log($("#" + searchvalue));
        if ($("#" + searchvalue + "a1").offset() !== undefined) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#" + searchvalue + "a1").offset().top - 100
            }, 2000);
            $("#" + searchvalue + "a1").addClass("searchhighlight");
            setTimeout(function () {
                $("#" + searchvalue + "a1").removeClass("searchhighlight");
            }, 6000);
        }
        else {
            jQuery('html,body').animate({ scrollTop: 0 }, 2000);
            $("#searchmsg").html("Could not find a matching coin");
            setTimeout(function () {
                $("#searchmsg").html("");
            }, 5000);
        }
    });
}
function updateCoinSpan() {
    var coinspandata = "";
    for (var i = 0; i < selectedcoins.length; i++) {
        if (i == (selectedcoins.length - 1)) {
            coinspandata += selectedcoins[i].code;
        }
        else {
            coinspandata += selectedcoins[i].code + ", ";
        }
    }
    $("#selectedcoins").html(coinspandata);
}
window.onscroll = function () { scrollFunction(); };
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrolltopbuttonx").style.display = "block";
    }
    else {
        document.getElementById("scrolltopbuttonx").style.display = "none";
    }
}
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
