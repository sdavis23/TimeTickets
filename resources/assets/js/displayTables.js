import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {default_cell_width, 
        number_cell_width, 
        renderCell, createNumberColumn, createTextColumn, renderSelectionCell, 
        createSelectionColumn, createComboBoxColumn, filterEmp, filterEquipment,
        createSimpleTextColumn, createLinkColumn, OnSiteLinkButton, OnSiteButton, TableComboBox, taskFilter,
        createCheckBoxColumn}  from './render_cell_utils.js';

import {projectInfoComplete} from "./validations.js"

import {Table, Column, Cell} from './Table.js';
import Select from "react-select";

var moment = require('moment');


const selected_color = "#1269bf";
const danger_color = "#d6490c";
const default_color = "#ffffff";
const headerHeight = 50;
const rowHeight = 50;

export class DisplayTable extends Component{

    constructor(props) 
    {
      super(props);
     

      this.state = {
        rows: this.props.rows
      };
    }

   
    componentWillReceiveProps(nextProps)
    {
      this.setState({rows: nextProps.rows, selected_rows: nextProps.selected_rows});
    }


    render() {

      console.log("DISPLAY TABLE HAS RENDERED");

      return (
        <Table
          key={12}
          rowsCount={this.state.rows.length}
          onRowClick = {(index) => this.props.onRowClick(index)}
           >

            {this.props.children}
        
        </Table> );
    }
}


export class DailyTicketLabourDisplayTable extends Component
{

  constructor(props)
  {
    super(props);
    this.rowColour = this.rowColour.bind(this);
    this.cellChange = this.cellChange.bind(this);


    //console.log("Display Props: " + JSON.stringify(props));
    this.state = {
        rows: this.props.rows
      };
  }

  
   componentWillReceiveProps(nextProps)
    {
      this.setState({rows: nextProps.rows, selected_rows: nextProps.selected_rows});
    }


  rowColour(rowIndex)
  {

      if(this.props.highlightedRows.indexOf(rowIndex) >= 0)
      {
        return selected_color;
      }
      else
      {
        return default_color;
      }

  }

    cellChange(row_index, col_index, new_val)
    {

      console.log("LABOUR CELL CHANGE FIRST: " + JSON.stringify(new_val));
      this.props.onCellChange(row_index, col_index, new_val);
    }

    



  render()
  {
    const rows = this.state.rows;
    const employee_list = this.props.employees;

    console.log("VIEW TABLE RENDERED: " + JSON.stringify(rows));

    return (

      <DisplayTable {...this.props} >
        
       {createComboBoxColumn(  0, 
                                (rowIndex) => rows[rowIndex].employee, "Employee", 
                                (item) => '(' + item.initials + ') ' + item.first_name + " " + item.last_name,
                                (rowIndex) =>  this.props.top + headerHeight + (rowIndex)*rowHeight + 12,
                                this.props.left + 12,
                                this.cellChange, 
                                (rowIndex) => employee_list,
                                this.rowColour,
                                filterEmp
                                )} 

        {createSelectionColumn(1, (rowIndex) => rows[rowIndex].selected_occ, "Occ.", this.rowColour, (rowIndex) => rows[rowIndex].occ_list, this.cellChange)}
        {createNumberColumn(2, (rowIndex) => rows[rowIndex].tt, "TT", this.cellChange, this.rowColour)}
        {createNumberColumn(3, (rowIndex) => rows[rowIndex].reg, "Reg", this.cellChange, this.rowColour)}
        {createNumberColumn(4, (rowIndex) => rows[rowIndex].ot, "OT", this.cellChange, this.rowColour)}
        {createTextColumn(5, (rowIndex) => rows[rowIndex].desc, "Description", this.cellChange, this.rowColour)}
      </DisplayTable>

      );

  }


}

export class DraftColourConfigTable extends Component
{

  constructor(props)
  {
    super(props);
    this.rowColour = this.rowColour.bind(this);
    this.cellChange = this.cellChange.bind(this);


    //console.log("Display Props: " + JSON.stringify(props));
    this.state = {
        rows: this.props.rows
      };
  }

  
   componentWillReceiveProps(nextProps)
    {
      this.setState({rows: nextProps.rows, selected_rows: nextProps.selected_rows});
    }


  rowColour(rowIndex)
  {

      if(this.props.highlightedRows.indexOf(rowIndex) >= 0)
      {
        return selected_color;
      }
      else
      {
        return default_color;
      }

  }

    cellChange(row_index, col_index, new_val)
    {

      //console.log("LABOUR CELL CHANGE FIRST: " + JSON.stringify(new_val));
      this.props.onCellChange(row_index, col_index, new_val);
    }

    



  render()
  {
    const rows = this.state.rows;
   

    console.log("VIEW TABLE RENDERED: " + JSON.stringify(rows));

    return (

      <DisplayTable {...this.props} >
        
      
        {createTextColumn(0, (rowIndex) => rows[rowIndex].colour, "Colour", this.cellChange, this.rowColour, true)}
        {createTextColumn(1, (rowIndex) => rows[rowIndex].min, "Min Value", this.cellChange, this.rowColour)}
        {createTextColumn(2, (rowIndex) => rows[rowIndex].max, "Max Value", this.cellChange, this.rowColour)}
      </DisplayTable>

      );
  }

}

export class ProjectTaskTable extends Component
{

  constructor(props)
  {
    super(props);
    this.rowColour = this.rowColour.bind(this);
    this.cellChange = this.cellChange.bind(this);
    this.showAssignedTo = this.showAssignedTo.bind(this);


   
    this.state = { rows: props.rows };
  }

  
   componentWillReceiveProps(nextProps)
   {
      this.setState({rows: nextProps.rows, selected_rows: nextProps.selected_rows});
    }


  rowColour(rowIndex)
  {


    console.log("ROW COLOUR");

    if(this.props.highlightedRows.indexOf(rowIndex) >= 0)
    {
      return selected_color;
    }
    else
    {
      //console.log("COLOUR: " + JSON.stringify(this.state.rows[rowIndex].colour) );
      return this.state.rows[rowIndex].colour;
    }

  }

  cellChange(row_index, col_index, new_val)
  {


    this.props.onCellChange(row_index, col_index, new_val);
  }

  

  nameColumn(col_index, rows, cellChange, rowColour, is_employee)
  {

    var row_data = rows;
    var tasks = this.props.tasks;
    var colIndex = col_index;
    var cellValChange = cellChange;
    
    return  (<Column
               key = {colIndex+"Name"}
               header="Name"
                cell={props => (
                    renderCell(props.rowIndex, props.width, props.height, colIndex,
                       
                      function(rowIndex, width, height)
                      {

                        if(row_data[rowIndex].id == "NEW")
                        {


                         

                        return (<TableComboBox

                                    key = {rowIndex.toString()+colIndex.toString()}
                                    textField = {item => typeof item === 'string' ? item : item.name }
                                    onSelect = {(value) => cellValChange(rowIndex, colIndex, value)}
                                   
                                    colIndex = {colIndex}
                                    value = {rows[rowIndex].task}
                                    data =  {tasks}
                                    filter = {taskFilter}  /> );

                        }
                        else
                        {
                          return (<input type = "text" key = {rowIndex.toString() + colIndex.toString()} disabled={is_employee} onChange={(e) => cellChange(rowIndex, colIndex, e.target.value)} value = {rows[rowIndex].name} />);
                        }
                         


                      }, rowColour) ) }
         
            width={number_cell_width} />)


  }


  showAssignedTo(rows)
  {
    if(this.props.employees == undefined)
    {
      return (null);
    }

    else
    {

      return createComboBoxColumn(4, 
                                (rowIndex) => rows[rowIndex].assigned_to, "Assigned To", 
                                (item) => '(' + item.initials + ') ' + item.first_name + " " + item.last_name,
                                (rowIndex) =>  this.props.top + headerHeight + (rowIndex)*rowHeight + 12,
                                this.props.left + 12,
                                this.cellChange, 
                                (rowIndex) => this.props.employees,
                                this.rowColour,
                                filterEmp
                                );
    }
  }


  render()
  {
    console.log("State: " + JSON.stringify(this.state));
    const rows = this.state.rows;

   

    ///console.log("***EQUIPMENT RENDER LIST*****: *  " + JSON.stringify(this.props.equipment));

    return (
      
      <DisplayTable key = {12} {...this.props} >
        {this.nameColumn(0, rows, this.cellChange, this.rowColour, this.props.is_employee)}
        

        {createTextColumn(1, (rowIndex) => rows[rowIndex].description, "Description", this.cellChange, this.rowColour, this.props.is_employee)}

        {createNumberColumn(2, (rowIndex) => rows[rowIndex].estimated_time, "Estimated Time", this.cellChange, this.rowColour, this.props.is_employee)}
        {createNumberColumn(3, (rowIndex) => rows[rowIndex].actual_time, "Actual Time", this.cellChange, this.rowColour, !this.props.is_employee)}
        {this.showAssignedTo(rows)} 

      </DisplayTable>
      

      );

  }
}


export class DailyTicketEquipmentDisplayTable extends Component
{

  constructor(props)
  {
    super(props);
    this.rowColour = this.rowColour.bind(this);
    this.cellChange = this.cellChange.bind(this);


    //console.log("Equipment Display Props: " + JSON.stringify(props));
    this.state = {
        rows: this.props.rows
      };
  }

  
   componentWillReceiveProps(nextProps)
    {
      this.setState({rows: nextProps.rows, selected_rows: nextProps.selected_rows});
    }


  rowColour(rowIndex)
  {


    console.log("HIGHLIGHTED: " + this.props.highlightedRows.indexOf(rowIndex) );

      if(this.props.highlightedRows.indexOf(rowIndex) >= 0)
      {
        return selected_color;
      }
      else
      {
        return default_color;
      }

  }

    cellChange(row_index, col_index, new_val)
    {

      this.props.onCellChange(row_index, col_index, new_val);
    }



  render()
  {
    const rows = this.state.rows;

    ///console.log("***EQUIPMENT RENDER LIST*****: *  " + JSON.stringify(this.props.equipment));

    return (

      <DisplayTable {...this.props} >
        {createComboBoxColumn(  0, 
                                (rowIndex) => rows[rowIndex].equipment, "Equipment", 
                                (item) => '(' + item.unit_number + ') ' + item.name,
                                (rowIndex) =>  this.props.top + headerHeight + (rowIndex)*rowHeight + 12,
                                this.props.left + 12,
                                this.cellChange, 
                                (rowIndex) => this.props.equipment,
                                this.rowColour,
                                filterEquipment
                                )} 

        {createNumberColumn(1, (rowIndex) => rows[rowIndex].hours, "Hours.", this.cellChange, this.rowColour)}
        {createTextColumn(2, (rowIndex) => rows[rowIndex].description, "Description", this.cellChange, this.rowColour)}
      </DisplayTable>

      );

  }


}


export class EmployeeIndexTable extends Component
{

  constructor(props)
  {
    super(props);
    
  }


  render()
  {
    

    const rows = this.props.employees;

   

    return (

      <div className = "col-sm-10">
        <DisplayTable rows = {rows}  >
          {createSimpleTextColumn(0, (rowIndex) => rows[rowIndex].first_name, "First Name", (rowIndex) => default_color)}
          {createSimpleTextColumn(1, (rowIndex) => rows[rowIndex].last_name, "Last Name", (rowIndex) => default_color)}
          {createSimpleTextColumn(2, (rowIndex) => rows[rowIndex].email, "E-mail", (rowIndex) => default_color)}
          {createSimpleTextColumn(3, (rowIndex) => rows[rowIndex].initials, "Initials", (rowIndex) => default_color)}
       
          {createLinkColumn(4, (rowIndex) => "View", (rowIndex) => "/employee_edit/" + rows[rowIndex].id, " ", (rowIndex) => default_color)}
        </DisplayTable>
      </div>

      );

  }


}

export class CustomerRepIndexTable extends Component
{

  constructor(props)
  {
    super(props);
    
  }
  
  rowColour(data)
  {
    
    
      return default_color;
    
  }


  render()
  {
    

    const rows = this.props.reps;

   

    return (


      <div>

      <div className="row">

      <div className = "col-sm-10">
        <DisplayTable rows = {rows}  >
          {createSimpleTextColumn(0, (rowIndex) => rows[rowIndex].first_name, "First Name", (rowIndex) => this.rowColour(rows[rowIndex]))}
          {createSimpleTextColumn(1, (rowIndex) => rows[rowIndex].last_name, "Last Name", (rowIndex) => this.rowColour(rows[rowIndex]))}
          
          {createSimpleTextColumn(2, (rowIndex) => rows[rowIndex].company_name, "Company: ", (rowIndex) => this.rowColour(rows[rowIndex]))}
       
          {createLinkColumn(3, (rowIndex) => "View", (rowIndex) => "/customer_rep_edit/" + rows[rowIndex].id, " ", (rowIndex) => this.rowColour(rows[rowIndex]))}
        </DisplayTable>
      </div>


      </div>

      <div className = "row">
 
        <OnSiteLinkButton link = "customer_rep_edit/NEW" text="New Customer Rep" />
      </div>

      </div>

      );

  }


}


export class ProjectIndexTable extends Component
{

  constructor(props)
  {
    super(props);
    
  }


  rowColour(data)
  {
    
  
      return default_color;

  }


  render()
  {
  

    const rows = this.props.projects;

   
    var columns  = 
          [ createSimpleTextColumn(0, (rowIndex) => rows[rowIndex].old_job_num, "Job Number", (rowIndex) => this.rowColour(rows[rowIndex])),
            createSimpleTextColumn(1, (rowIndex) => rows[rowIndex].name, "Name", (rowIndex) => this.rowColour(rows[rowIndex])),
            createSimpleTextColumn(2, (rowIndex) => rows[rowIndex].customer_rep.first_name + " " + rows[rowIndex].customer_rep.last_name, "Customer Rep", (rowIndex) => this.rowColour(rows[rowIndex])),
            createSimpleTextColumn(3, (rowIndex) => rows[rowIndex].date, "Date", (rowIndex) => this.rowColour(rows[rowIndex])), 
            createCheckBoxColumn(4,   (rowIndex) => projectInfoComplete(rows[rowIndex]), "Missing data?", (rowIndex) => this.rowColour(rows[rowIndex]), true),
            
            createLinkColumn(5, (rowIndex) => "View", (rowIndex) => "/project_edit/" + rows[rowIndex].id, " ", (rowIndex) => this.rowColour(rows[rowIndex])) ];

    if(this.props.is_admin)
    {

      columns.push( createLinkColumn(6, (rowIndex) => "Draftsmen Tasks", (rowIndex) => "/project_task_edit/" + rows[rowIndex].id, " ", (rowIndex) => this.rowColour(rows[rowIndex])));
    }

    return (

      <div>

      <div className = "row">
      <div className = "col-sm-10">
        <DisplayTable rows = {rows}  >
          
       
          {columns}
          
        </DisplayTable>
      </div>

      </div>

      <div className="row">

        <OnSiteLinkButton link="project_edit/NEW" text="New Project" />

      </div>

      </div>

      );

  }


}

export class ClientIndexTable extends Component
{

  constructor(props)
  {
    super(props);
    
  }




  render()
  {
  

    const rows = this.props.clients;

   

    return (

      <div>

      <div className="row">
      <div className = "col-sm-10">
        <DisplayTable rows = {rows}  >
          {createSimpleTextColumn(0, (rowIndex) => rows[rowIndex].name, "Long Name", (rowIndex) => default_color)}
          {createSimpleTextColumn(1, (rowIndex) => rows[rowIndex].short_name, "Name", (rowIndex) => default_color)}
          
          {createSimpleTextColumn(2, (rowIndex) => rows[rowIndex].website, "Website", (rowIndex) => default_color)}
       
          {createLinkColumn(3, (rowIndex) => "View", (rowIndex) => "/client_edit/" + rows[rowIndex].id, " ", (rowIndex) => default_color)}
        </DisplayTable>
      </div>
      </div>

        <div className = "row">
          <OnSiteLinkButton link = "client_edit/NEW" text="New Client" />
        </div>

      </div>

      );

  }


}

export class TaskIndexTable extends Component
{

  constructor(props)
  {
    super(props);
    
  }




  render()
  {
  

    const rows = this.props.tasks;

    console.log("Tasks: " + JSON.stringify(rows));

    return (

    <div>

      <div className = "row">
        <div className = "col-sm-10">
          <DisplayTable rows = {rows}  >
            {createSimpleTextColumn(0, (rowIndex) => rows[rowIndex].name, "Name", (rowIndex) => default_color)}
            {createSimpleTextColumn(1, (rowIndex) => rows[rowIndex].description, "Description", (rowIndex) => default_color)}
          
            {createSimpleTextColumn(2, (rowIndex) => rows[rowIndex].estimated_time, "Estimated Time", (rowIndex) => default_color)}
       
            {createLinkColumn(3, (rowIndex) => "View", (rowIndex) => "/task_edit/" + rows[rowIndex].id, " ", (rowIndex) => default_color)}
          </DisplayTable>
         </div>

        </div>

      <div className = "row">
 
        <OnSiteLinkButton link = "task_edit/NEW" text="New Task" />
      </div>

      </div>

      );

  }


}



export class DailyTicketViewTable extends Component
{

  constructor(props)
  {
    super(props);
    
    this.state = {
        rows: this.props.rows,
        selected_date: this.props.date
      };
  }

  
   componentWillReceiveProps(nextProps)
   {
      this.setState({rows: this.state.rows, selected_date: nextProps.date });
   }



  render()
  {
    const current_date = this.state.selected_date;



    const rows = this.state.rows.filter(
        function(row)
        {
          var row_date = moment(row.date);

         
          return (row_date.get('year') == current_date.getFullYear()) && (row_date.get('month') == current_date.getMonth())
            && (row_date.get('date') == current_date.getDate());

        });

    console.log("Outer Rows: " + JSON.stringify(rows));


    var link;

    if(this.props.final_view)
    {

      link = "/dailyworkticket_view/";

    }
    else
    {
      link = "/timeticket_edit/"
    }

    return (

      <DisplayTable rows = {rows}  >
        {createSimpleTextColumn(0, (rowIndex) => rows[rowIndex].project.job_num, "Job Number", (rowIndex) => default_color)}
       
        {createLinkColumn(1, (rowIndex) => rows[rowIndex].name, (rowIndex) => link + rows[rowIndex].id, "Ticket Number", (rowIndex) => default_color)}
      </DisplayTable>

      );

  }


}
