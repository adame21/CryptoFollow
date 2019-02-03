$(document).ready(function () {


    $.ajax({
        type: "GET",
        url: "Pages/Main.html",
        success: (result) => {
            $("#navcont").append(result);
            getCoins();
        },
        error: (error) => {
            $("#navcont").html(`Failed to retrieve navbar, check for missing files, error code:${error.statusText}${error.status}`);
        }
    })


    function getCoins(): void {
        startLoader();
        $.ajax({
            type: "GET",
            url: `https://api.coingecko.com/api/v3/coins/list`,
            success: (result) => {
                stopLoader();
                console.log(result);
                homeStart(result);
            },
            error: (error) => {
                stopLoader();
                $("#pagecont").html(`Could not retrieve data from api error:${error.statusText}${error.status}`);
            }




        })
    }
    function homeStart(coins: any[]): void {
        var divcreate = document.createElement("div");

        for (var i = 0; i < 100; i++) {
            console.log(coins[i]);
            divcreate.innerHTML += `
            <div class="card text-dark bg-primary m-auto makeinline" id="${coins[i].id}${i}" style="max-width: 18rem;">
                <div class="card-header">
                    <div class="flexalign">
                        <span class="coinsymbol">${coins[i].symbol.toUpperCase()}</span>
                        <label class="switch">
                            <input type="checkbox" id="${coins[i].id}${coins[i].symbol}" onchange="selectedCoinUpdate(this,'${coins[i].symbol}')"> 
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
                <div class="card-body">
                    <div class="">
                        <h5 class="card-title coinname">${coins[i].name}</h5>
                        <button type="button" class="btn btn-secondary" data-toggle="collapse" href="#collapseExample${i}" role="button"
                        aria-expanded="false" aria-controls="collapseExample${i}" onclick="moreInfo('${coins[i].id}')">More info</button>
                    </div>
                </div>
                <div class="collapse" id="collapseExample${i}">
                    <div class=" card-body" id="${coins[i].id}">
                        
                    </div>
                </div>
            </div>`;
            $("#pagecont").append(divcreate);



        }


    }


    function startLoader() {
        $("#pagecont").append(`
        <div class="d-flex justify-content-center" id="loadingcircle">
        <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
        </div>
        </div>
        `);
    }
    function stopLoader() {
        $("#loadingcircle").remove();
    }

});

var selectedcoins: any[] = [];

function moreInfo(coinid: any): void {
    var coin = JSON.parse(localStorage.getItem(coinid));
    if (coin != null) {
        console.log("local storage is not null amigo");
        if (coin.time + 120000 < Date.now()) {
            console.log("shit man this data is too old now lemme get a fresh copy");
            startInfoLoader(coinid);
            $.ajax({
                type: "GET",
                url: `https://api.coingecko.com/api/v3/coins/${coinid}`,
                success: (result) => {
                    stopInfoLoader(coinid);

                    result.time = Date.now();
                    localStorage.setItem(coinid, JSON.stringify(result));

                    var usdprice = Math.floor(result.market_data.current_price.usd * 10000) / 10000;
                    var eurprice = Math.floor(result.market_data.current_price.eur * 10000) / 10000;
                    var ilsprice = Math.floor(result.market_data.current_price.ils * 10000) / 10000;
                    $("#" + coinid).html(`
                    <img src="${result.image.small}" />
                    <span class="displaycurrency">USD: ${usdprice.toFixed(4)}$</span>
                    <span class="displaycurrency">EUR: ${eurprice.toFixed(4)}€</span>
                    <span class="displaycurrency">ILS: ${ilsprice.toFixed(4)}₪</span>
                    `);
                },
                error: (error) => {
                    $("#" + coinid).html(`
                    Could not retrieve data from api error:${error.statusText}${error.status}
                    `)
                }
            })
        }
        //This else is in case the information existing in localstorage isnt too old (2 minutes is the cutoff)
        else {
            console.log("why go to the store when we have perfectly good data already here");
            var usdprice = Math.floor(coin.market_data.current_price.usd * 10000) / 10000;
            var eurprice = Math.floor(coin.market_data.current_price.eur * 10000) / 10000;
            var ilsprice = Math.floor(coin.market_data.current_price.ils * 10000) / 10000;
            $("#" + coinid).html(`
            <img src="${coin.image.small}" />
            <span class="displaycurrency">USD: ${usdprice.toFixed(4)}$</span>
            <span class="displaycurrency">EUR: ${eurprice.toFixed(4)}€</span>
            <span class="displaycurrency">ILS: ${ilsprice.toFixed(4)}₪</span>
            `);
        }
    }
    //This else is in case whats in localstorage is null(it is checked by ID)
    else {
        console.log("there is nothing with the correct id in the localstorage so ima get you a fresh copy of all those coins and shit");
        startInfoLoader(coinid);
        $.ajax({
            type: "GET",
            url: `https://api.coingecko.com/api/v3/coins/${coinid}`,
            success: (result) => {
                stopInfoLoader(coinid);

                result.time = Date.now();
                localStorage.setItem(coinid, JSON.stringify(result));

                var usdprice = Math.floor(result.market_data.current_price.usd * 10000) / 10000;
                var eurprice = Math.floor(result.market_data.current_price.eur * 10000) / 10000;
                var ilsprice = Math.floor(result.market_data.current_price.ils * 10000) / 10000;
                $("#" + coinid).html(`
                <img src="${result.image.small}" />
                <span class="displaycurrency">USD: ${usdprice.toFixed(4)}$</span>
                <span class="displaycurrency">EUR: ${eurprice.toFixed(4)}€</span>
                <span class="displaycurrency">ILS: ${ilsprice.toFixed(4)}₪</span>
                `);
            },
            error: (error) => {
                $("#" + coinid).html(`
                Could not retrieve data from api error:${error.statusText}${error.status}
                `)
            }
        })
    }
}

function startInfoLoader(coinid: any) {
    $("#" + coinid).append(`
    <div class="d-flex justify-content-center" id="loadingcircle${coinid}">
    <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
    </div>
    </div>
    `);
}
function stopInfoLoader(coinid: any) {
    $(`#loadingcircle${coinid}`).remove();
}








function selectedCoinUpdate(cointoggle: any, coinsymbol: any) {
    var uppercoinsymbol: any = coinsymbol.toUpperCase();
    var cointoggleid = cointoggle.getAttribute("id");
    

    if (selectedcoins.length >= 5 && cointoggle.checked) {
        console.log("too many coins");
        console.log(coinsymbol);
        cointoggle.checked = false;
        var modalbody: any = document.createElement("div");
        modalbody.innerHTML = "";
        for (var i = 0; i < selectedcoins.length; i++) {
            console.log(selectedcoins[i]);
            modalbody.innerHTML += `
                <div  class="modalbodycoin bg-primary text-light m-2" onclick="changeSelected(this.innerHTML,'${uppercoinsymbol}','${cointoggleid}','${selectedcoins[i].id}')">${selectedcoins[i].code}</div>
            `;


        }

        $("#modalbodymessage").append(modalbody);
        //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize modal method)
        $('#toomanycoinsmodal').modal({backdrop: 'static', keyboard: false})
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
            console.log(selectedcoins);
        }
        else {
            //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize jquery)
            let coinindex: number = selectedcoins.findIndex(function (coins) {
                return coins.id == cointoggleid;
            })
            console.log(coinindex);
            selectedcoins.splice(coinindex, 1);
            console.log(selectedcoins);

        }
    }

}

function changeSelected(cointoremove: string, cointoadd: string,cointoaddid:any,cointoremoveid:any) {
    console.log(cointoremoveid);
    console.log(cointoaddid);
    console.log(cointoremove);
    console.log(cointoadd);

    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize jquery)
    let coinindex: number = selectedcoins.findIndex(function (coins) {
        return coins.id == cointoremoveid;
    })
    
    console.log(coinindex);


    selectedcoins.splice(coinindex, 1, {
        "code": cointoadd,
        "id": cointoaddid
    });



    $("#modalbodymessage").html("Please select which coin to unselect in favor of the coin you just clicked");
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize modal method)
    $('#toomanycoinsmodal').modal('hide');
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize checked value)
    $(`#${cointoaddid}`)[0].checked = true;
    //@ts-ignore - This line exists to avoid showing an error thats not really an error here. (typescript doesent recognize checked value)
    $(`#${cointoremoveid}`)[0].checked = false;
    
}

function closedModal(){
    $("#modalbodymessage").html("Please select which coin to unselect in favor of the coin you just clicked");
}