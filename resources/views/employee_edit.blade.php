@extends('layouts.dashboard')

@section('page_heading','Employee')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadEmployeeForm('{{$employee_id}}');

           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


