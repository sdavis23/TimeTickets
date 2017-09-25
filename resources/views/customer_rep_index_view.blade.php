@extends('layouts.dashboard')

@section('page_heading','Customer Rep Index')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadCustomerRepIndexTable();
           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


