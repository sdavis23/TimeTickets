@extends('layouts.dashboard')

@section('page_heading')
	Project Tasks - {{$project->name}}
@endsection

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadProjectTaskTable('{{$project->id}}');
           });
           

</script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


