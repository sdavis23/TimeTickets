@extends('layouts.dashboard')

@section('page_heading','Task')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadTaskForm('{{$task_id}}');

           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


