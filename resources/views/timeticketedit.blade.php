@extends('layouts.dashboard')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
             displayWorkTicketTables("example", "{{$ticket_id}}");
           }

               
            );
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


