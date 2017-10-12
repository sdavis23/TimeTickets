@extends('layouts.dashboard')

@section('page_heading')
	Review Project Tasks
@endsection

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadProjectTaskEmployeeTable('{{Auth::user()->id}}');
           });
           

</script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


