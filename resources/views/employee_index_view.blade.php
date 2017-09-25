@extends('layouts.dashboard')

@section('page_heading','Employee Index')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadEmployeeIndexTable();
           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


