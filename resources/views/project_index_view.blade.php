@extends('layouts.dashboard')

@section('page_heading','Project Index')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadProjectIndexTable();
           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


