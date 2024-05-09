<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Social Broker</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .grid-container {
                display: flex;
                flex-direction: column;
                background-color: #4CAF50; /* Green */
                padding: 1rem;
                cursor: pointer;
                text-align: center;
                color: white;
            }
        </style>
    </head>
    <body>
        <div class="bg-gray-100 w-screen min-h-screen h-full pt-20">
            <div id="step-one" class="md:max-w-[50%] mx-auto">
                <div class="flex flex-col mx-auto w-fit bg-transparent text-center gap-2 mb-10">
                    <h1 class="text-3xl">
                        Check social media presence of a username
                    </h1>
                    <div class="text-lg text-gray-700">
                        We will browse all popular social media platforms for your username
                    </div>
                </div>
                <form class="flex flex-col" action="" method="POST">
                    <input type="text" id="username" placeholder="Search your username" class="h-[40px] w-full bg-gray-100 rounded outline-none border-black pl-2 border" />
                    <button type="button" class="rounded bg-indigo-500 px-8 py-2 ml-auto mt-6 text-md font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Search</button>
                </form>
            </div>
            <div id="step-two" class="md:max-w-[50%] mx-auto">
                <div class="flex flex-col mx-auto w-fit bg-transparent text-center gap-2 mb-10">
                    <h1 class="text-3xl">
                        Social media presence for: Socialbroker
                    </h1>
                    <div class="text-lg text-gray-700">
                        We have searched 51 platforms and found your username in 10
                    </div>
                </div>
                <div class="grid grid-cols-4 gap-4">
                    <div class="grid-container">
                        <div class="grid-item">Facebook</div>
                        <div class="grid-item">Exist</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
