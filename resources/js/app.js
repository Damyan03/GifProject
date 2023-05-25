import './bootstrap';

const form = document.getElementById('searchForm');
form.addEventListener('submit', logJSONData);



async function logJSONData() {

    const gifLoader = document.getElementById("gifLoader");

    while (gifLoader.firstChild) {
        gifLoader.removeChild(gifLoader.firstChild);
    }

    // set the apikey and limit
    const apiKey = "AIzaSyBBWKWlLXhTl7r3nInPnAwbwuFRgDql4qo";
    const clientKey = "my_test_app";
    const lmt = 10;

    const search_term = document.getElementById('searchBar').value;

    // using default locale of en_US
    const search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
        apiKey + "&client_key=" + clientKey + "&limit=" + lmt;

    const response = await fetch(search_url)
    const jsonData = await response.json();

    const top_8_gifs = jsonData["results"];

    for (let i = 0; i < top_8_gifs.length; i++) {
        const gifContainer = document.createElement("div");
        gifContainer.id = "gifContainer";
        gifContainer.className = "flex justify-center items-center";

        const gifImage = document.createElement("img");
        gifImage.id =  i;
        gifImage.src = top_8_gifs[i]["media_formats"]["nanogif"]["url"];
        gifImage.alt = search_term + " gif"
        gifImage.width = 220;
        gifImage.height = 164;
        gifImage.className = "border-2";

        gifLoader.appendChild(gifContainer);
        gifContainer.appendChild(gifImage);

    }
    document.querySelectorAll("#gifContainer").forEach(element => element.addEventListener('click', function () {
        const body = document.getElementsByTagName("body")[0];
        const backgroundDim = document.createElement("div")
        backgroundDim.id = "backgroundDim";
        backgroundDim.className = "fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10";
        console.log(top_8_gifs[element.firstChild.id]["media_formats"]["gif"]["url"]);

        const gifLarge = document.createElement("img");
        gifLarge.id = "gif";
        gifLarge.src = top_8_gifs[element.firstChild.id]["media_formats"]["gif"]["url"];
        gifLarge.alt = search_term + " gif"
        gifLarge.width = 440;
        gifLarge.height = 328;
        gifLarge.className = "border-2 z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed";
        body.appendChild(backgroundDim);
        body.appendChild(gifLarge);

        backgroundDim.addEventListener('click', function () {
            body.removeChild(backgroundDim);
            body.removeChild(gifLarge);
        });
    }));
    console.log(jsonData);
}





