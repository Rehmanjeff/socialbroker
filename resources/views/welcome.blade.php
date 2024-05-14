<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Social Broker</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        <script>

            let errorMessage = '';

            function validateValue(value) {
                if (value.length < 5) {
                errorMessage = 'The username should be at least 5 characters long';
                return false;
                } else if (value.length < 5 || value.length > 20) {
                errorMessage = 'The username cannot be more than 20 characters in length';
                return false;
                } else if (/\s/.test(value)) {
                errorMessage = 'The username can only contain alpha numeric characters and should not contain any special characters or blank spaces';
                return false;
                }

                return true;
            }

            function createHTML(data) {

                let html = '';

                data.forEach(function(item) {
                    html += '<div onclick="navigate(\'' + item.url + '\')" class="grid-container ' + (item.status == 200 ? "exist" : "not-exist") + '">';
                    html += '<div class="grid-item">' + item.name + '</div>';
                    html += '<div class="grid-item">' + (item.status == 200 ? "Exist" : "Does not exist") + '</div>';
                    html += '</div>';
                });

                return html;
            }

            $(document).ready(function(){

                $('#submit').click(function(){

                    $('#error').text('').addClass('hidden');
                    const loader = $('#loader');
                    const stepOne = $('#step-one');
                    const stepTwo = $('#step-two');
                    const username = $('#username').val();

                    if (validateValue(username)) {

                        loader.removeClass('hidden');
                        stepOne.addClass('hidden');
                        stepTwo.find('#content').html('');
                        stepTwo.find('#show-username').text(username);
                        stepTwo.removeClass('hidden');
                        let formData = new FormData();
                        formData.append("username", username);
                        formData.append('_token', $('meta[name="csrf-token"]').attr('content'));

                        $.ajax({
                            url: '/social-media-presence',
                            type: "POST",
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                                loader.addClass('hidden');
                                const html = createHTML(response.data);
                                stepTwo.find('#content').html(html);
                                stepTwo.find('#show-data').text('We have searched '+ response.total +' platforms and found your username in ' + response.matched);
                            },
                            error: function(xhr, status, error) {
                                errorMessage = error;
                                $('#error').text(errorMessage).removeClass('hidden');
                                loader.addClass('hidden');
                            }
                        });
                    } else {
                        $('#error').text(errorMessage).removeClass('hidden');
                    }
                });

                $('#arrow-back').click(function () {
                    location.reload();
                });
            });

            function navigate(url){
                window.open(url, '_blank');
            }
        </script>
        <style>
            .grid-container {
                display: flex;
                flex-direction: column;
                padding: 1rem;
                cursor: pointer;
                text-align: center;
                color: white;
            }

            .grid-container.not-exist {
                background-color: #dc3545;
            }

            .grid-container.exist {
                background-color: #4CAF50;
            }

        </style>
    </head>
    <body class="overflow-x-hidden">
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
                <input type="text" id="username" placeholder="Search your username" class="h-[40px] w-full bg-gray-100 rounded outline-none border-black pl-2 border" />
                <button type="button" id="submit" class="rounded bg-indigo-500 px-8 py-2 ml-auto mt-6 text-md font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Search</button>
                <div id="error" class="hidden ml-auto text-red-500 mt-2 font-bold text-sm"></div>
            </div>
            <div id="step-two" class="md:max-w-[50%] mx-auto hidden">
                <div class="flex items-center mb-10">
                    <div id="arrow-back" class="cursor-pointer">
                        <img class="w-[33px]" src="https://www.svgrepo.com/show/49353/backward-arrow.svg" alt="">
                    </div>
                    <div class="flex flex-col mx-auto w-fit bg-transparent text-center gap-2">
                        <h1 class="text-3xl">
                            Social media presence for: <span id="show-username"></span>
                        </h1>
                        <div id="show-data" class="text-lg text-gray-700">
                            We are searching social media platforms. Please be patient
                        </div>
                    </div>
                </div>
                <div id="content" class="grid grid-cols-4 gap-4"></div>
            </div>
            <div id="loader" class="hidden">
                <img class="max-w-[200px] mx-auto" src="/img/loading-3.svg" alt="">
            </div>
        </div>
    </body>
</html>
