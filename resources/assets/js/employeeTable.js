
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {createDataTable} from "./dataTable.js"
import {DailyTicketLabourDisplayTable} from "./displayTables.js";
import update from 'react-addons-update';
import {listToSelectStruct, dailyTicketRowToDeletedItem} from './render_cell_utils.js';



export function dailyTicketDefaultRow(employees)
{



  return function()
  {
    //console.log("Employee 0: " + JSON.stringify(employees[0].occ_list[0]));
    return {
      id: "NEW",
      employee: employees[0].id,
      tt: 0,
      reg: 0,
      ot: 0,
      occ: employees[0].occ_list[0],
      description: ""
    };

  };

}


/*

    Given a row_index and a cell_index
    returns: the function that changes the state

      Return: null means there is not enough information for
        this function to change the state.
*/
export function dailyTicketStateChange(row_index, col_index, row, new_val)
{

    //console.log("New Val Is String: " + (typeof new_val === 'string'));
   
    switch(col_index)
    {

      case 0:
       if(typeof new_val === 'string')
       {
        row = null;
       }
       else
       {
        row.employee = new_val.id;
        row.occ = new_val.occ_list[0];
       }
        break;

      case 1:
        row.occ = new_val;
        break;

      case 2:
        row.tt = new_val; 
        break;

      case 3:
        row.reg = new_val; 
        break;

      case 4:
        row.ot = new_val; 
        break;

      case 5:
        row.description = new_val;
        break;


    }


  return row;
} 


export function dailyTicketDataRowToDisplayRow(occupation_lookup, employees)
{

  return function(row)
  {

    //console.log("Employees: " + JSON.stringify(employees));
    //console.log("Row: " + JSON.stringify(row));

    var emp = employees.filter(
        function(employee)
        {
          return employee.id == row.employee;


        })[0];


   // console.log("Display OCC: " + JSON.stringify(occupation_lookup[row.occ]));

    return {
              employee: emp,
              tt: row.tt,
              ot: row.ot, 
              reg: row.reg, 
              occ_list: listToSelectStruct(emp.occ_list, occupation_lookup, "No OCCS.", function(occ_item){ return occ_item.code; }),
              selected_occ: row.occ,
              desc: row.description };

  };

}


export function EmployeeTableView(employees)
{ 
  return function(props)
  {

    console.log("EMPLOYEE PROPS: " + JSON.stringify(props.rows.length));

     return <DailyTicketLabourDisplayTable
                    employees = {employees}
                    onRowClick = {props.onRowClick}
                    onCellChange = {props.onCellChange}
                    rows =  {props.rows}
                    top =   {props.top}
                    left =  {props.left}
                    highlightedRows={props.highlightedRows} />;
  }


}




/*export function renderEmployeeTable(employees, selections,  occupations, labour_lines, deletedRows, rowAdd, rowDelete, cellChange)
{
  //console.log("Save Clicked : " + JSON.stringify(saveClicked));

  //console.log("Render Selections: " + JSON.string)

 const DailyTicketTable  = createDataTable(       TableView(employees), 
                                                  dailyTicketDefaultRow(employees), 
                                                  dailyTicketStateChange,
                                                  dailyTicketDataRowToDisplayRow(occupations, employees), cellChange ); 

        return (<DailyTicketTable 
                            key = {1}
                            top={75}
                            left={75}
                            onRowAdd = {rowAdd}
                            onRowDelete = {rowDelete}
                            deletedRows = {deletedRows}
                            selected_rows = {selections}
                            rows={labour_lines}/>);

} */