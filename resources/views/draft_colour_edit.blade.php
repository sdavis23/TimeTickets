@extends('layouts.dashboard')

@section('page_heading','Draftsmen Tracker Highlighting')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadDraftColourTable();
           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


