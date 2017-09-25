@extends('layouts.dashboard')

@section('javascript')

  <script type="text/javascript">

          
           $(document).ready(
            function()
            {
                console.log("Javascript loaded");
                loadCalendar("example", {{Auth::user()->is_admin}});

            });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
    
@endsection

