import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {createDataTable} from "./dataTable.js"
import {DailyTicketEquipmentDisplayTable} from "./displayTables.js";
import update from 'react-addons-update';
import {listToSelectStruct, dailyTicketRowToDeletedItem, identity} from './render_cell_utils.js';

export function defaultEquipmentRow(equipment)
{


  return function()
  {
    return {
        id: "NEW",
        hours: 0,
        equip_id: equipment[0].id,
        description: ""

     };
  }

}



export function equipmentLineStateChange(row_index, col_index, row, new_val)
{

  switch(col_index)
  {

    case 0:
      (typeof new_val === 'string') ? row = null : row.equip_id = new_val.id;
      break;

    case 1:
      row.hours = new_val;
      break;

    case 2:
      row.description = new_val;
      break;


  }

  console.log("Row: " + JSON.stringify(row));

  return row;
}


export function equipmentLineItemToDisplayRow(equipment_list)
{

  return function(row)
  {


    console.log("Equipment LIST: " + JSON.stringify(equipment_list));


   var equip = equipment_list.filter(
        function(equipment)
        {
          return equipment.id == row.equip_id;
        })[0];

    console.log("Equipment: " + JSON.stringify(equip));

   return {

      id: row.id,
      equipment: equip,
      hours: row.hours,
      description: row.description

   };


 };

}




export function EquipmentTableView(equipment)
{
     return function(props)  {
          
         // console.log("*******RECOMPUTING THE TABLE VIEW****  " + JSON.stringify(equipment));  



          return <DailyTicketEquipmentDisplayTable
                    equipment = {equipment} 
                    onRowClick = {props.onRowClick}
                    onCellChange = {props.onCellChange}
                    rows =  {props.rows}
                    top =   {props.top}
                    left =  {props.left}
                    highlightedRows={props.highlightedRows} />;
       
      };
}


/*export function renderEquipmentTable(equipment, selections, rowSelected, equipment_lines, deleted_rows, rowAddEventHandle, rowDeleteEventHandle, cellChange)
{

  // console.log("Equipment: " + JSON.stringify(equipment_lines));
  // console.log("Selections: " + JSON.stringify(selections))
  // console.log("Equipment Save: " + saveClicked);


 const DailyTicketTable  = createDataTable(       TableView(equipment), 
                                                  defaultEquipmentRow(equipment), 
                                                  
                                                  equipmentLineStateChange,
                                                  equipmentLineItemToDisplayRow(equipment)); 

        return (<DailyTicketTable
                             key = {0}
                             top={75 }
                             left={75}
                             onRowAdd = {rowAddEventHandle}
                             onRowDelete = {rowDeleteEventHandle}
                             onCellChange = {cellChange}
                             deletedRows = {deleted_rows}
                             OnRowSelected = {rowSelected}
                             selected_rows = {selections}
                             rows={equipment_lines}/>);

} */