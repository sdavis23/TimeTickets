@extends('layouts.dashboard')

@section('page_heading','Customer Rep')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadCustomerRepForm('{{$rep_id}}');

           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


