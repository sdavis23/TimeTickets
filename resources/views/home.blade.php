@extends('layouts.dashboard')
@section('page_heading','Dashboard')

@section('javascript')

<script type ="text/javascript">

    function goToMapViewer()
    {

        window.location = map_path;
    }


     function goToTicketCalendar()
    {

        window.location = calendar_path;
    }


</script>

@endsection

@section('section')
           


    

    <div className="row">
        <div className="col-lg-3 col-md-6">
            <div class = "panel ">

                <div class="panel-heading">
                            
                    <div>Pointcloud Map</div>
                          
                </div>
           
                <div>   
                    <img style = "cursor:pointer;" onClick=goToMapViewer() src= "/map_screenshot.png" alt="icon" height="250" width="250" /> 
                </div>
            </div>
        </div>

         <div className="col-lg-3 col-md-6">
            <div class = "panel ">

                <div class="panel-heading">
                            
                    <div>Time Tickets</div>
                          
                </div>
           
                <div>   
                    <img style = "cursor:pointer;" onClick=goToTicketCalendar()  src= "/ticket_screen.png" alt="icon" height="250" width="250" />
                </div>
            </div>
        </div>
    </div>


                <!-- /.col-lg-4 -->
            
@stop
