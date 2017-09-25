<!doctype html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>ONSITE 3D TIME TICKETS</title>

        <!-- Fonts -->
         
        <link href = "/css/fixed-data-table.css"  rel="stylesheet" type="text/css">
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">

        <script src="/js/app.js"></script> 
        <script src="https://apis.google.com/js/platform.js" async defer></script>
        <meta name="google-signin-client_id" content="433437658657-n1ejhd4mjd14agi06j57vbj3fl0nrbnk.apps.googleusercontent.com">

         @yield('javascript')


    <style>

        #short_text{

            width: 85px;
        }

        input[type=number]{
            width: 85px;
        } 
    </style>

   
    </head>
    <body>
       
         
        @yield('content')
           
    </body>
</html>
