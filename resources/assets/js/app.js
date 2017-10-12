import {renderEmployeeTable} from "./employeeTable.js";
import {renderEquipmentTable} from "./equipmentTable.js";
import {loadEquipmentAndLabour, loadDailyTicketEditData, loadAllDailyTickets, 
        loadLabourLineItems, loadDailyTicketViewData, loadEmployeeTableData, 
        loadClientIndex, loadClient,
        loadEquipmentTableData, loadTask, loadTaskIndex, loadTaskLookup, loadEmployeeLookup, loadProjectTasks, loadEmployeeProjectData,
        loadProjectIndex, loadOccupations, loadCustomerReps, loadCustomerRep, loadEmployees, loadEmployee, loadProject, loadDraftColours, loadProjectCompletions} from "./loadLaravelData.js";

import CustomerRepForm from "./CustomerRepForm.js";

import PDFForm from './PDFForm.js';
import EmployeeProjectTask from "./EmployeeProjectTask.js";
import ProjectTaskEditor from './ProjectTaskEditor.js';
import TaskForm from "./TaskForm.js";
import ProjectForm from "./ProjectForm.js";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';
import 'react-widgets/lib/scss/react-widgets.scss';
import {ticketCalendar} from "./TicketCalendar.js";
import Center from 'react-center';
import {DailyTicketViewTable, EmployeeIndexTable, ProjectIndexTable, CustomerRepIndexTable, ClientIndexTable, ProjectTaskTable, TaskIndexTable} from "./displayTables.js";
import {DailyWorkTicketEditor} from './projectComponents.js';
import {TestTile} from "./tiles.js";
import {html2pdf} from "./html2pdf";
import EmployeeForm from "./EmployeeForm.js";
import ClientForm from "./ClientForm.js";
import DraftColourConfigEdit from "./DraftColourConfigEdit.js";
import {map_path, calendar_path} from "./config.js";
import ProjectGraph from "./ProjectGraph.js";


window.map_path = map_path;
window.calendar_path = calendar_path;
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

window.loadDraftColourTable =   
  function()
  {
    loadDraftColours().then(
      function(val)
      {

        ReactDOM.render(<DraftColourConfigEdit rows = {val} />, document.getElementById("example"));

      });
  }

window.loadCustomerRepForm = 
  function(id)
  {

    Promise.all([loadCustomerRep(id), loadClientIndex()]).then(
      function(vals)
      {


        var all_clients = vals[1].map(function(client){ return {value: client.id, label: client.name }});

        ReactDOM.render(<CustomerRepForm clients = {all_clients} rep = {vals[0][0]} />, document.getElementById("example"));

      });
  }

window.loadProjectForm = 
  function(id, is_admin)
  {
     console.log("Loading Project!");


     Promise.all([loadProject(id), loadCustomerReps()]).then(
      function(vals)
      {


        var contacts = vals[1];
        var project = vals[0][0];

        var display_contacts = contacts.map(function(contact){ return {value: contact.id, label: contact.first_name + " " + contact.last_name + " | " + contact.company_name}; });

         ReactDOM.render(<ProjectForm is_admin={is_admin} contacts = {display_contacts} project= {project} />, document.getElementById("example"));

      });
     

  }


window.loadTaskForm = 
  function(id)
  {


    loadTask(id).then(
        function(task)
        {

             ReactDOM.render(<TaskForm  task = {task[0]} />, document.getElementById("example"));
     
        } );
   
    
  }

window.loadClientForm = 
  function(id)
  {

    loadClient(id).then(
        function(client)
        {
          ReactDOM.render(<ClientForm client = {client[0]} />, document.getElementById("example"));

        });
    

  }



jQuery.fn.center = function () {
    this.css("position","absolute");
  
     this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}

jQuery.fn.centerLeft = function () {
    this.css("position","absolute");
  
    
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}




window.loadPDFForm = function()
{


  loadProjectIndex().then(
    function(val)
    {

       console.log("Projects: " + JSON.stringify(val));
       ReactDOM.render(<PDFForm key = {0} projects = {val} />, document.getElementById("example"));

    });


 

}

window.loadProjectCompletedGraph =  
function()
{

  loadProjectCompletions().then(
    function(val)
    {
       ReactDOM.render(<ProjectGraph key = {0} graph_data = {val} />, document.getElementById("example"));
    });

 
}

window.loadEmployeeIndexTable = 
  function()
  {
    loadEmployees().then(
        function(employee_list)
        {

          console.log("Loading Employees");


          ReactDOM.render(<EmployeeIndexTable employees = {employee_list} />, document.getElementById("example"));
        });
  };


window.loadTaskIndexTable = 
  function()
  {
    loadTaskIndex().then(
        function(task_list)
        {

          console.log("Loading Tasks");


          ReactDOM.render(<TaskIndexTable tasks = {task_list} />, document.getElementById("example"));
        });
  };

  window.loadCustomerRepIndexTable = 
  function()
  {
    loadCustomerReps().then(
        function(rep_list)
        {

          console.log("Loading Customer Reps");


          ReactDOM.render(<CustomerRepIndexTable reps = {rep_list} />, document.getElementById("example"));
        });
  };

window.loadProjectIndexTable = 
  function(is_admin)
  {
    loadProjectIndex().then(
        function(project_list)
        {

          console.log("Loading Employees");


          ReactDOM.render(<ProjectIndexTable is_admin ={is_admin} projects = {project_list} />, document.getElementById("example"));
        });
  };

window.loadClientIndexTable = 
  function()
  {
    loadClientIndex().then(
        function(client_list)
        {

          console.log("Loading Employees");


          ReactDOM.render(<ClientIndexTable clients = {client_list} />, document.getElementById("example"));
        });
  };


window.displayWorkTicketTables= function (root_dom_id, workticket_id)
{

   $.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});

 
  loadDailyTicketEditData(workticket_id).then(
      function(value)
      {

        console.log("Value: " + JSON.stringify(value));

       var labour_items = value.labour_tableData;
       var equipment_items = value.equipment_tableData;
       var projects = value.projects;
       var dailyticket = value.dailyticket_summary;
       


        ReactDOM.render(<DailyWorkTicketEditor  workticket_id = {workticket_id} 
                                                labour_items = {labour_items} 
                                                equipment_items={equipment_items} 
                                                projects = {projects}

                                                dailyticket_summary = {dailyticket[0]} / > ,

                                                document.getElementById(root_dom_id)); 

        //renderEmployeeTable(value.employees, value.occupations, value.labour_lines, document.getElementById("example"));

      });  



};

window.errorMessage = 
function()
{

  ReactDOM.render(<div> Could not log in! </div>, document.getElementById("example"));
}


window.loadProjectTaskEmployeeTable = 
  function(emp_id)
  {

    Promise.all([loadEmployeeProjectData(emp_id)]).then(
      function(val)
      {

        ReactDOM.render(<EmployeeProjectTask projects = {val[0][0].projects} project_tasks={val[0][0].project_tasks} />, document.getElementById("example"));

      });

  }

window.loadEmployeeForm = 
  function(id)
  {




      Promise.all([loadEmployee(id), loadOccupations()]).then(
      function(val)
      {
        var occupations = val[1].map(function(occupation){ return {value: occupation.id, label: occupation.code} })
        console.log("Employee: " + JSON.stringify(val[0]));


        ReactDOM.render(<EmployeeForm occupations = {occupations} employee = {val[0][0]} />, document.getElementById("example"));
      });

    };



window.loadProjectTaskTable = 
function(project_id)
{

    Promise.all([
        loadProjectTasks(project_id),
        loadEmployees(),
        loadTaskIndex()
      ]).then(
        function(vals)
        {

          ReactDOM.render(<ProjectTaskEditor project_id = {project_id} rows = {vals[0]} employees = {vals[1]} tasks={vals[2]} />, document.getElementById("example"));

        });

}


window.fetchHTML = 
  function(workticket_id)
  {
    
    $.get("/dailyworkticket_toPDF/" + workticket_id, 
        function( data ) 
        {
          
         console.log(JSON.stringify(data));
        });
    
  }
       




window.loadCalendar = 
  function(root_id, isAdmin)
  {


    Promise.all(
      [ loadAllDailyTickets(),
        loadProjectIndex()
      ]).then(
        function(val)
        {

          console.log("Calendar JSON: " + JSON.stringify(val[0]));

          const Calendar = ticketCalendar(DailyTicketViewTable);

          ReactDOM.render(<Center><Calendar initial_rows = {val[0]} projects = {val[1]} isAdmin = {isAdmin}  /></Center>, document.getElementById(root_id));

      });

  };




