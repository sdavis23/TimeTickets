@extends('layouts.dashboard')

@section('page_heading','Project')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadProjectForm('{{$project_id}}');
           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection

