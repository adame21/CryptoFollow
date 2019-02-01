$(document).ready(function () {


    $.ajax({
        type: "GET",
        url: "Pages/Main.html",
        success: (result) => {
            $("#navcont").append(result);
            getCoins();
        },
        error: (error) => {
            $("#navcont").html(`Failed to retrieve navbar, check for missing files, error code:${error.status}${error.statusText}`);
        }
    })


    function getCoins(): void {
        $.ajax({
            type: "GET",
            url: `https://api.coingecko.com/api/v3/coins/list`,
            success: (result) => {
                console.log(result);
                homeStart(result);
            },
            error: (error) => {
                console.log(error.status);
            }




        })

        function homeStart(coins: any[]): void {
            var divcreate = document.createElement("div");

            for (var i = 0; i < 100; i++) {
                console.log(coins[i]);
                divcreate.innerHTML += `<p style="color:red;">${coins[i].name}</p>`;
                $("#pagecont").append(divcreate);



            }
        }

    }















})