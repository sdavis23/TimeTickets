@extends('layouts.dashboard')

@section('page_heading','Client Index')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadClientIndexTable();
           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


