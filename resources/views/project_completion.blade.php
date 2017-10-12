@extends('layouts.dashboard')

@section('page_heading','Project Completion')

@section('javascript')

<script type="text/javascript">

           $(document).ready(function()
           {
            
                loadProjectCompletedGraph();

           });
           

        </script>

@endsection


@section('section')
           


    
     <div id = "example" style="position: absolute; width: 100%;"></div>


                <!-- /.col-lg-4 -->
            
@stop
