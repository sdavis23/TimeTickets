@extends('layouts.plane')

@section('body')
 <div id="wrapper">

        <!-- Navigation -->
        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="http://www.onsite3d.ca"><img src ="/images/CompanyLogo.PNG" height=35 width=125></a>
            </div>
            <!-- /.navbar-header -->

            
                
              
                <!-- /.dropdown -->
            </ul>
            <!-- /.navbar-top-links -->

            <div class="navbar-default sidebar" role="navigation">
                <div class="sidebar-nav navbar-collapse">
                    <ul class="nav" id="side-menu">
                        <li class="sidebar-search">
                            
                            <!-- /input-group -->
                        </li>
                        <li {{ (Request::is('/home') ? 'class="active"' : '') }}>
                            <a href="{{ url ('home') }}"><i class="fa fa-dashboard fa-fw"></i> Dashboard</a>



                        </li>
                       
                       @if(!Auth::user()->is_draftsmen || Auth::user()->is_admin)
                            <li >
                                <a href="#"><i class="fa fa-table fa-fw"></i> Time Tickets<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
                                    <li {{ (Request::is('*panels') ? 'class="active"' : '') }}>
                                        <a href="{{ url ('timeticket_edit/NEW') }}">New Ticket </a>
                                    </li>
                                    <li {{ (Request::is('*panels') ? 'class="active"' : '') }}>
                                        <a href="{{ url ('calendar') }}">View Calendar</a>
                                    </li>
                                    <li {{ (Request::is('*buttons') ? 'class="active"' : '') }}>
                                        <a href="{{ url ('dailyworkticket_GeneratePDF' ) }}">Print PDF</a>
                                    </li>
                                    <li {{ (Request::is('*notifications') ? 'class="active"' : '') }}>
                                        <a href="{{ url('employee_edit/NEW') }}">Add Employee</a>
                                    </li>
                                    <li {{ (Request::is('*typography') ? 'class="active"' : '') }}>
                                        <a href="{{ url ('project_edit/NEW') }}">Add Project</a>
                                    </li>
                                
                                    </ul>
                            <!-- /.nav-second-level -->
                            </li>
                        @endif

                         <li >
                            <a href="#"><i class="fa fa-table fa-fw"></i> Config  Data<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level">
                                <li {{ (Request::is('*panels') ? 'class="active"' : '') }}>
                                    <a href="{{ url ('employee_index_view') }}">Employee List</a>
                                </li>

                                <li {{ (Request::is('*panels') ? 'class="active"' : '') }}>
                                    <a href="{{ url ('project_index_view') }}">Project List</a>
                                </li>

                                 <li {{ (Request::is('*panels') ? 'class="active"' : '') }}>
                                    <a href="{{ url ('customer_rep_index_view') }}">Customer Reps</a>
                                </li>

                                 

                                 <li {{ (Request::is('*panels') ? 'class="active"' : '') }}>
                                    <a href="{{ url ('client_index_view' ) }}">Clients</a>
                                </li>

                                 
                                 @if(Auth::user()->is_admin)
                                    <li {{ (Request::is('*panels') ? 'class="active"' : '') }}>
                                        <a href="{{ url ('draft_colour_edit' ) }}">Draft Tasks Colour</a>
                                    </li>
                                @endif
                               
                                </li>
                                
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>

                         <li >

                           @if(Auth::user()->is_draftsmen || Auth::user()->is_admin)
                                <a href="#"><i class="fa fa-table fa-fw"></i> Draftsmen and Scanning<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
                                    
                                  
                                        <li {{ (Request::is('*panels') ? 'class="active"' : '') }}>
                                            <a href="{{ url ('project_task_employee') }}">Review Tasks</a>
                                        </li>


                                        <li {{ (Request::is('*panels') ? 'class="active"' : '') }}>
                                            <a href="{{ url ('project_completion_view') }}">Project Completion</a>
                                        </li>
                                   



                                    @if(Auth::user()->is_admin)
                                        <li {{ (Request::is('*panels') ? 'class="active"' : '') }}>
                                             <a href="{{ url ('task_index_view') }}">Tasks</a>
                                        </li>
                                    @endif
                               
                                </li>
                                
                                </ul>

                            @endif
                            <!-- /.nav-second-level -->
                        </li>
                        
                    </ul>
                </div>
                <!-- /.sidebar-collapse -->
            </div>
            <!-- /.navbar-static-side -->
        </nav>

        <div id="page-wrapper">
			 <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">@yield('page_heading')</h1>
                </div>
                <!-- /.col-lg-12 -->
           </div>
			<div class="row">  
				@yield('section')

            </div>
            <!-- /#page-wrapper -->
        </div>
    </div>
@stop

