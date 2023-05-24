import './bootstrap';

async function logJSONData() {
    // set the apikey and limit
    const apiKey = 'AIzaSyBBWKWlLXhTl7r3nInPnAwbwuFRgDql4qo';
    const clientKey = "my_test_app";
    const lmt = 10;

    const search_term = 'excited';
    console.log(search_term);

    // using default locale of en_US
    const search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
        apiKey + "&client_key=" + clientKey + "&limit=" + lmt;

    const response = await fetch(search_url)
    const jsonData = await response.json();

    const top_8_gifs = jsonData["results"];

    for (let i = 0; i < top_8_gifs.length; i++) {

        const gifLoader = document.getElementById("gifLoader");
        const gifContainer = document.createElement("div");

        gifContainer.id = "gifContainer";
        gifContainer.className = "flex justify-center items-center";

        const gifImage = document.createElement("img");
        gifImage.id = "preview_gif_" + i;
        gifImage.src = top_8_gifs[i]["media_formats"]["nanogif"]["url"];
        gifImage.alt = search_term + " gif"
        gifImage.width = 220;
        gifImage.height = 164;
        gifImage.className = "border-2";

        gifLoader.appendChild(gifContainer);
        gifContainer.appendChild(gifImage);

    }

    console.log(jsonData);
}

logJSONData();

