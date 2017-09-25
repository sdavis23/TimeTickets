@extends('layouts.dashboard')

@section('page_heading','Client')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadClientForm('{{$client_id}}');

           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


