@extends('layouts.dashboard')

@section('page_heading','Print Invoice PDF')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
            	loadPDFForm();

           });
           

        </script>

@endsection

@section('section')

     <div id = "example" style="position: absolute; width: 100%;"></div>
           
    
@endsection


