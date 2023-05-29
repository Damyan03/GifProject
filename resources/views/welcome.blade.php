<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="h-full">
    <div id="world-map" data-maps='{{ json_encode(env('TENOR_KEY')) }}'></div>
{{--Header--}}
    <div id="enlargeContainer" class="w-full h-full fixed flex justify-center items-center invisible"></div>
    <div class="w-full bg-gray-600 h-20">
        <div class="w-1/2 m-auto flex flex-shrink h-full">
            <a class="m-auto font-bold text-white text-2xl hover:text-gray-300" href="/">FEATURED</a>
        </div>
    </div>
{{--Content--}}
    <div class="bg-gray-800 w-full h-full">
        <div class="bg-gray-700 m-auto w-5/6 h-full">
            <div class="flex-row">
{{--Search bar--}}
                <div class="h-40 flex justify-center items-center">
                    <form class="w-3/4" id="searchForm" onsubmit="return false">
                        <input id="searchBar" name="search_term" class="w-full h-10 rounded-lg p-2" type="text" placeholder="Search Tenor">
                    </form>
                </div>
                <div id="searchContainer" class="flex flex-row justify-center items-center gap-5 pl-5 pr-5" style="height: 40px">

                </div>
{{--Loaded Gifs--}}
                <div id="gifLoader" class="flex flex-row flex-wrap flex-grow gap-4 items-start justify-center w-full p-5 ms-auto">
{{--Gifs--}}
                </div>
            </div>
        </div>
    </div>
{{--<div id="enlargeContainer" class="z-20 w-full h-full fixed flex justify-center items-center">--}}
{{--    <div id="backgroundDim" class="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 invisible"></div>--}}
{{--</div>--}}
</body>
</html>
