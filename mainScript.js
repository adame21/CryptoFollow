$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "Pages/Main.html",
        success: function (result) {
            $("#navcont").append(result);
            getCoins();
        },
        error: function (error) {
            $("#navcont").html("Failed to retrieve navbar, check for missing files, error code:" + error.status + error.statusText);
        }
    });
    function getCoins() {
        $.ajax({
            type: "GET",
            url: "https://api.coingecko.com/api/v3/coins/list",
            success: function (result) {
                console.log(result);
                homeStart(result);
            },
            error: function (error) {
                console.log(error.status);
            }
        });
        function homeStart(coins) {
            var divcreate = document.createElement("div");
            for (var i = 0; i < 100; i++) {
                console.log(coins[i]);
                divcreate.innerHTML += "\n            <div class=\"card text-dark bg-primary mb-3 makeinline\" style=\"max-width: 18rem;\">\n                <div class=\"card-header\">\n                    <div class=\"flexalign\">\n                        <span class=\"coinsymbol\">" + coins[i].symbol + "</span>\n                        <label class=\"switch\">\n                            <input type=\"checkbox\">\n                            <span class=\"slider round\"></span>\n                        </label>\n                    </div>\n                </div>\n                <div class=\"card-body\">\n                    <div class=\"flexalign\">\n                        <h5 class=\"card-title coinname\">" + coins[i].name + "</h5>\n                        <button type=\"button\" class=\"btn btn-secondary\">More info</button>\n                    </div>\n                </div>\n            </div>";
                $("#pagecont").append(divcreate);
            }
        }
    }
});
