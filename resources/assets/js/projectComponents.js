import {EmployeeTableView, dailyTicketDefaultRow, dailyTicketStateChange, dailyTicketDataRowToDisplayRow} from "./employeeTable.js";
import {EquipmentTableView, defaultEquipmentRow, equipmentLineStateChange, equipmentLineItemToDisplayRow} from "./equipmentTable.js";
import {loadEquipmentAndLabour, loadAllDailyTickets, loadLabourLineItems, loadDailyTicketViewData, loadEmployeeTableData, loadEquipmentTableData} from "./loadLaravelData.js";
import {createDataTable} from "./dataTable.js"
import {OnSiteButton, OnSiteLinkButton, displayJobSelection, filterProjects, ProjectPicker} from "./render_cell_utils.js";

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactWidgets from 'react-widgets';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';
import 'react-widgets/lib/scss/react-widgets.scss';
import Center from 'react-center';
import {DailyTicketViewTable} from "./displayTables.js";
import Portal from 'react-portal';
import ReactSimpleAlert from 'react-simple-alert';
import Spinner from 'react-spinkit';

var ComboBox = ReactWidgets.Combobox;

function dailyTicketRowToDeletedItem(deletedRow)
{

  return { id: deletedRow.id };

}

function equipmentLineItemAfterSave(row, rowIndex, returnedIds)
{

  return {
    id: returnedIds[rowIndex],
    hours: row.hours,
    equip_id: row.equip_id,
    description: row.description

  };

}

function equipmentLineItemToSaveItem(equipment_lineItem, workticket_id)
{

  return {

    dailyworkticket_id: workticket_id,
    id: equipment_lineItem.id,
    equip_id: equipment_lineItem.equip_id,
    hours: equipment_lineItem.hours,
    description: equipment_lineItem.description

  };


}

function dailyTicketRowToSavedItem(rowitem, workticket_id)
{

  console.log("Saving Row Item: " + JSON.stringify(rowitem));
  console.log("Occ ID: " + rowitem.occ);

  return {  id: rowitem.id,
            dailyworkticket_id: workticket_id,
            emp_id: rowitem.employee,
            tt: rowitem.tt,
            reg: rowitem.reg,
            ot: rowitem.ot,
            occ_id: rowitem.occ,
            description: rowitem.description
          };
}


function dailyTicketRowAfterSave(row, rowIndex, returned_ids)
{

   return {
                    id: returned_ids[rowIndex],
                    employee: row.employee,
                    tt: row.tt,
                    reg: row.reg,
                    ot: row.ot,
                    description: row.description,
                    occ: row.occ

                  };
}

function saveTable(rows, deletedRows, saveURL, rowItemToSavedItem, deletedURL, rowItemToDeletedItem)
 {



    saveDeletedState(deletedRows, deletedURL, rowItemToDeletedItem).then(
        function(val)
        {

          console.log("Deleted! " + JSON.stringify(val));

        });



   return  saveRows(rows, saveURL, rowItemToSavedItem);

   
}


function saveDeletedState(deletedRows, deletedURL, rowItemToDeletedItem)
 {

    console.log("Deleted Rows: " + JSON.stringify(deletedRows));
    return sendToServer(deletedRows, deletedURL, rowItemToDeletedItem);
}

/*
	Takes in an array where each element corresponds to a row displayed on the grid and:
    returns a promise that resolves to an array of id's where each element is a new id for 
    the rows - in the order as presented on the grid.
*/

function saveRows(rows, savedURL, rowItemToSavedItem)
{

    return sendToServer(rows, savedURL, rowItemToSavedItem)
}

      /*
        Applies rowItemToJSON to each item in rows,
          and send the stringified data in a POST request
          to the server specified with url

          Returns: a promise that resolves with the responseText parsed.

      */
function sendToServer(rows, URL, rowItemToJSON)
{

	console.log("URL : " + URL + ", Rows: " + JSON.stringify(rows));

   	var save_json = JSON.stringify(
     
         rows.map(
          function(rowitem)
          {

             console.log("Row Item ID: " + rowitem.id);

             return rowItemToJSON(rowitem);

         }));

        //console.log("Save JSON: " + save_json);


     return new Promise(function(resolve, reject)
      {
          $.ajax({
            type: "POST",
            url: URL,
        
            // The key needs to match your method's input parameter (case-sensitive).
            data: save_json,
            contentType: "application/json",
     
            success: function(data){ console.log("Success: " + data); },

            failure: function(errMsg) {
              console.log("Fail: " + errMsg);
            },

            complete: function(response)
            {
        
              console.log("Saved Response: " + JSON.stringify(response));
              // this is where we'll put the resolve code
              resolve(JSON.parse(response.responseText));

            }

        });

      });

 }

 

var App = React.createClass({
    getInitialState: function() {
        return {
            alert: false 
        };
    },
    render: function() {
        
        return (
            <div>
                <button onClick={this._alert}>alert</button>
                <ReactSimpleAlert options={rsaOptions} />
            </div>
        );
    },
 
    _alert: function(){
        this.setState({alert: true});
    }
});

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};



var DateTimePicker = ReactWidgets.DateTimePicker;

var Moment = require('moment');
var momentLocalizer= require('react-widgets/lib/localizers/moment');
momentLocalizer(Moment);

function renderSelection(dropdown_items, selected_key, selectChange)
{

	//console.log("Selection DropDown: " + JSON.stringify(dropdown_items));

	var dropdown_array = dropdown_items.map(
          function(dropdown_item)
          {
             return <option value = {dropdown_item.value} key = {dropdown_item.display.hashCode()} >{dropdown_item.display}</option>;
          });

   
      return (<select defaultValue = {selected_key} key = {selected_key.hashCode()} onChange={(e) => selectChange(e.target.value) } >
                 {dropdown_array}
                </select>);
  
}


function TabbedComponent(props)
{

  var headerList = props.tabs.map(
      function(tab_item)
      {

        return (<Tab key={tab_item.header}>{tab_item.header}</Tab>);

      });

  var bodyList = props.tabs.map(
      function(tab_item)
      {
       return (<TabPanel key = {tab_item.header}>
          {tab_item.body}
        </TabPanel>);
      }

    )

  return (
    <div>
    
      <Tabs>
        <TabList>
         {headerList}
        </TabList>

        {bodyList}
      </Tabs>

    </div>

  );
}

export class DailyWorkTicketEditor extends Component
{

	

	

	constructor(props)
	{

		super(props);

		
	

		this.EmployeeTicketTable  = createDataTable(       EmployeeTableView(this.props.labour_items.employees), 
                                                  			dailyTicketDefaultRow(this.props.labour_items.employees), 
                                                  			dailyTicketStateChange,
                                                  			dailyTicketDataRowToDisplayRow(this.props.labour_items.occupations, this.props.labour_items.employees), 
                                                  			this.labourCellChange.bind(this)); 

		this.EquipmentTicketTable  = createDataTable(       EquipmentTableView(this.props.equipment_items.equipment), 
                                                  			defaultEquipmentRow(this.props.equipment_items.equipment), 
                                                  			equipmentLineStateChange,
                                                  			equipmentLineItemToDisplayRow(this.props.equipment_items.equipment),
        													this.equipmentCellChange.bind(this) );

		this.state = {
			dailyworkticket_id: this.props.dailyticket_summary.id,
			current_date: this.props.dailyticket_summary.date,
			job_number: this.props.dailyticket_summary.project.job_num,
			labour_rows: this.props.labour_items.labour_lines,
			labour_delete: [],
			equipment_rows: this.props.equipment_items.equipment_lineitems,
			equipment_delete: [],
			save_clicked: false,
			
		};


		this.handleLabourRowAdd = this.handleLabourRowAdd.bind(this);
		this.handleLabourRowDelete = this.handleLabourRowDelete.bind(this);
		this.handleEquipRowAdd = this.handleEquipRowAdd.bind(this);
		this.handleEquipRowDelete = this.handleEquipRowDelete.bind(this);
		this.handleProjectChange = this.handleProjectChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleSaveClick = this.handleSaveClick.bind(this);
		this.setStateAfterSave = this.setStateAfterSave.bind(this);
		this.saveTables = this.saveTables.bind(this);
		this.labourCellChange = this.labourCellChange.bind(this);
		this.equipmentCellChange = this.equipmentCellChange.bind(this);
		
		

	}

	saveTables(workticket_id)
	{

		var afterSave = this.setStateAfterSave;
		var labour_rows = this.state.labour_rows;
		var labour_delete = this.state.labour_delete;

		
		var equipment_rows = this.state.equipment_rows;
		var equipment_delete = this.state.equipment_delete;

		console.log("SAVING ON WORK TICKET: " + workticket_id);


		return Promise.all([


				saveTable(	labour_rows, 
							
							labour_delete, 
							"/save_ticket", 
							function(row) { return dailyTicketRowToSavedItem(row, workticket_id); }, 
							"/delete_labouritems", 
							dailyTicketRowToDeletedItem ),

				saveTable(	equipment_rows, 
							
							equipment_delete, 
							"/save_ticketEquipment", 
							function(row){ return equipmentLineItemToSaveItem(row, workticket_id); }, 
							"/delete_equipmentitems", 
							dailyTicketRowToDeletedItem)

			]).then(

				function(value)
				{

					console.log("Passing Value: " + JSON.stringify(value));

					return new Promise(
						function(resolve, reject)
						{
							resolve(afterSave(workticket_id, value[0], value[1]));
						});


				}

			);


	}


	handleSaveClick()
	{

		

		var occupations = this.props.labour_items.occupations;
		var employees = this.props.labour_items.employees;

		var job_number = this.state.job_number;
		var current_date = this.state.current_date;
		var id = this.state.dailyworkticket_id;

		var emp_hash = {};
		var error_message_list = [];
		// keeps track of whether or not the  employee validations failed
		var checks_failed = false;

		console.log("SAVING ROWS LENGTH: " + JSON.stringify(this.state.labour_rows.length));

		var super_id;
		var super_line_id;

		var selected_project = this.props.projects.filter(
				function(project)
				{

					return project.job_num == parseInt(job_number);

				})[0];


		if(this.state.labour_rows.length > 0)
		{


			var supervisor_lines = [];

		
			supervisor_lines = this.state.labour_rows.filter(
				function(row)
				{
					//console.log("OCCUPATION CHECK: " + JSON.stringify(new Boolean(parseInt(occupations[row.occ].is_supervisor))));
					return parseInt(occupations[row.occ].is_supervisor);
				});


			this.state.labour_rows.forEach(
				function(element)
				{

					if( typeof emp_hash[element.employee] != 'undefined')
					{
						emp_hash[element.employee] += 1;
					}
					else
					{
						emp_hash[element.employee] = 1;

					}

				});



			if(supervisor_lines.length > 1)
			{
				checks_failed = true;
				error_message_list = [ "You can only have one Supervisor! "];
			}

			else if(supervisor_lines.length == 0)
			{
				checks_failed = true;
				error_message_list = ["You must have at least one supervisor"];
			}
			else
			{
				super_id = supervisor_lines[0].employee
				super_line_id = supervisor_lines[0].id
			}

			console.log("Supervisor Length: " + supervisor_lines.length);

			


			for (var key in emp_hash) 
			{
   				 
				if(emp_hash[key] > 1)
				{
					error_message_list.push(["There can only be one of each employee"]);
					checks_failed = true;
					break;
				}

			}


			console.log("Error Messages: " + JSON.stringify(error_message_list));
		}
		else
		{
			super_id = "NONE";
		}

	

		if(checks_failed)
		{

			this.setState({
				dailyworkticket_id: this.state.dailyworkticket_id,
				current_date: this.state.current_date,
				job_number: this.state.job_number,
				labour_rows: this.state.labour_rows,
				labour_delete: this.state.labour_delete,
				equipment_rows: this.state.equipment_rows,
				equipment_delete: this.state.equipment_delete,
				save_clicked: true,
				modal_open: true,
				error_messages: error_message_list });

		}

		else
		{


			this.setState({
				dailyworkticket_id: this.state.dailyworkticket_id,
				current_date: this.state.current_date,
				job_number: this.state.job_number,
				labour_rows: this.state.labour_rows,
				labour_delete: this.state.labour_delete,
				equipment_rows: this.state.equipment_rows,
				equipment_delete: this.state.equipment_delete,
				save_clicked: true,
				modal_open: false,
				save_data: {dailyticket_id: id, supervisor_id: super_id, supervisor_line_item_id: super_line_id, date: this.state.current_date, project_id: selected_project.id} });
		}
		//console.log("Supervisor Count: " + JSON.stringify(supervisor_lines));
	}

	labourCellChange(rows, col_index, row_index)
	{

		console.log("Labour Cell Change: " + JSON.stringify(rows));

		this.setState({
				dailyworkticket_id: this.state.dailyworkticket_id,
				current_date: this.state.current_date,
				job_number: this.state.job_number,
				labour_rows: rows,
				labour_delete: this.state.labour_delete,
				equipment_rows: this.state.equipment_rows,
				equipment_delete: this.state.equipment_delete,
				save_clicked: false,
				modal_open: false,
				
				
				
			});


	}

	equipmentCellChange(rows, col_index, row_index)
	{

		this.setState({
				dailyworkticket_id: this.state.dailyworkticket_id,
				current_date: this.state.current_date,
				job_number: this.state.job_number,
				labour_rows: this.state.labour_rows,
				labour_delete: this.state.labour_delete,
				equipment_rows: rows,
				equipment_delete: this.state.equipment_delete,
				save_clicked: false,
				modal_open: false,
				
				
			});


	}

	save(save_data)
	{

		console.log("!! SAVING DAILY SUMMARY : " + JSON.stringify(save_data));



		return new Promise(function(resolve, reject)
        {
          $.ajax({
            type: "POST",
            url: "/dailyticket_savesummary",
        
            
            data: JSON.stringify(save_data),
            contentType: "application/json",
     
            success: function(data){ },

            failure: function(errMsg) {
              console.log("Fail: " + errMsg);
            },

            complete: function(response)
            {
        
              console.log("**** SAVED DAILY SUMMARY: " + response.responseText);
              // this is where we'll put the resolve code
              resolve(response.responseText);

            }

          });

        }); 


	}


	handleLabourRowAdd(rows)
	{
		console.log("Labour Row Add: " + JSON.stringify(rows));


		this.setState({
			dailyworkticket_id: this.state.dailyworkticket_id,
			current_date: this.state.current_date,
			job_number: this.state.job_number,
			labour_rows: rows,
			labour_delete: this.state.labour_delete,
			equipment_rows: this.state.equipment_rows,
			equipment_delete: this.state.equipment_delete,
			save_clicked: false,
			modal_open: false,
			
		});

	}

	handleLabourRowDelete(rows, deleted_rows)
	{

		this.setState({
			dailyworkticket_id: this.state.dailyworkticket_id,
			current_date: this.state.current_date,
			job_number: this.state.job_number,
			labour_rows: rows,
			labour_delete: deleted_rows,
			equipment_rows: this.state.equipment_rows,
			equipment_delete: this.state.equipment_delete,
			save_clicked: false,
			modal_open: false,
			

		});

	}
	

	handleEquipRowAdd(rows)
	{
		this.setState({
			dailyworkticket_id: this.state.dailyworkticket_id,
			current_date: this.state.current_date,
			job_number: this.state.job_number,
			labour_rows: this.state.labour_rows,
			labour_delete: this.state.labour_delete,
			equipment_rows: rows,
			equipment_delete: this.state.equipment_delete,
			save_clicked: false,
			modal_open: false,
			

		});
	}

	handleEquipRowDelete(rows, deleted_rows)
	{
		this.setState({
			dailyworkticket_id: this.state.dailyworkticket_id,
			current_date: this.state.current_date,
			job_number: this.state.job_number,
			labour_rows: this.state.labour_rows,
			labour_delete: this.state.labour_delete,
			equipment_rows: rows,
			equipment_delete: deleted_rows,
			save_clicked: false,
			modal_open: false,
			

		});
	}

	handleProjectChange(val)
	{

		//console.log("Val: " + JSON.stringify(val));
		/*var selected_project = this.props.projects.filter(
			function(project)
			{

				return project.job_num == parseInt(val);

			})[0]; */

		//console.log("S")

		if(!(typeof val == 'string'))
		{

			this.setState({
				dailyworkticket_id: this.state.dailyworkticket_id,
				current_date: this.state.current_date,
				job_number: val.job_num,
				labour_rows: this.state.labour_rows,
				labour_delete: this.state.labour_delete,
				equipment_rows: this.state.equipment_rows,
				equipment_delete: this.state.equipment_delete,
				save_clicked: false,
				modal_open: false,
			

		});
		}


	}

	handleDateChange(date, date_str)
	{

		var split_array = date_str.split("/");

		this.setState({
			dailyworkticket_id: this.state.dailyworkticket_id,
			current_date: split_array[2] + "-" + split_array[0] + "-" + split_array[1],
			job_number: this.state.job_number,
			labour_rows: this.state.labour_rows,
			labour_delete: this.state.labour_delete,
			equipment_rows: this.state.equipment_rows,
			equipment_delete: this.state.equipment_delete,
			save_clicked: false,
			modal_open: false,
			

		});

	}

	
	/**
  * @param returned_ids - the ids in the same order as displayed
  *   on the grid of each of the line items
  ***/
 setStateAfterSave(returnedWorkTicketID, returned_labourIds, returned_equipmentIds)
 {

 		//var new_rows = this.state.labour_rows.splice().map(function())


     
		this.setState({
			dailyworkticket_id: returnedWorkTicketID,
			current_date: this.state.current_date,
			job_number: this.state.job_number,
			labour_rows: this.state.labour_rows.map(
				function(labour_row, index)
				{

					return dailyTicketRowAfterSave(labour_row, index, returned_labourIds);

				}),


			labour_delete: [],

			equipment_rows: this.state.equipment_rows.map(
				function(equipment_row, index)
				{

					return equipmentLineItemAfterSave(equipment_row, index, returned_equipmentIds);

				}),

			equipment_delete: [],
			save_clicked: false,
			modal_open: false,

		});


 }

	render()
	{

		console.log("Render Called: " + JSON.stringify(this.state.labour_rows));

		const EquipTable = this.EquipmentTicketTable;
		const EmployeeTable = this.EmployeeTicketTable;


		var is_saving = this.state.save_clicked && !this.state.modal_open;

		
		
		var messages =[];

		if(is_saving)
		{

			var table_save = this.saveTables;

			this.save(this.state.save_data).then(
				function(value)
				{
					//console.log("RET VAL: " + JSON.stringify(value));

					table_save(value);

				});

		}

		if(this.state.modal_open)
		{

			messages = this.state.error_messages.map(
				function(msg)
				{

					return <p key ={msg}>{msg}</p>;

				});

		}

		const equipment_table = <EquipTable
                             		key = {0}
                             		left={75}
                             		top = {75}
                             		onRowAdd = {this.handleEquipRowAdd}
                             		onRowDelete = {this.handleEquipRowDelete}
                             		deletedRows = {this.state.delete_equipmentitems}
                             		rows={this.state.equipment_rows} />;


        const employee_table = <EmployeeTable
        							key = {1}
        							left = {75}
        							top = {75}
        							onRowAdd = {this.handleLabourRowAdd}
        							onRowDelete = {this.handleLabourRowDelete}
        							deleted_rows = {this.state.delete_labouritems}
        							rows = {this.state.labour_rows} />;

		

		

       	 	var tab_items = [ 	{header: "Labour",    body: employee_table}, 
                          		{header: "Equipment", body: equipment_table} ];


         	//var job_numdropdown = this.props.projects.map(function(project){return {value: project.job_num, display: "Job Number: " + project.job_num}; });


         	var date_split = this.props.dailyticket_summary.date.split("-");

         	console.log("Date Split: " + JSON.stringify(date_split));

         	var spinner_visibility = is_saving ? "visible" : "hidden";
         	

         	var rsaOptions = {
            	title: "Could not Save the Work Ticket!" ,
            	message: <div key = {12}>{messages}</div> ,
            	alert: this.state.modal_open,
            

       		 };

         	return(  	



         				
         				<div>
         				
         					<div key = {6} style = {{position: "absolute", visibility: spinner_visibility, top: 100, left: 500, zIndex: 100000}}>
         							<Spinner name='ball-spin-fade-loader' />
								</div>

								<div key = {0}>
         							<ReactSimpleAlert options={rsaOptions} />
								</div>

         					<div className="row">
							
								

								<div className="col-sm-2">
									Date:
									<DateTimePicker onChange = {this.handleDateChange} 
													defaultValue={new Date(date_split[0], date_split[1] - 1, date_split[2])} 
													format={"MM/DD/YYYY"}  />
								</div>

								<div key = {1} className="col-sm-2">
									Project:
									 <ComboBox
                          				key = {2}
                          				textField = {(item) => typeof item === 'string' ? item : displayJobSelection(item)  }
                          				onSelect = {this.handleProjectChange} 
                          				defaultValue = {this.props.dailyticket_summary.project}
                          				data =  {this.props.projects}
                         				filter = {filterProjects}  />
								</div>
							
								<div className = "col-sm-1">
									<OnSiteButton   onClick=  {(e) => this.handleSaveClick()} text="Save Tables" />
								</div>
							</div>

         					
         					<div className="row">
							
								<div className="col-sm-12">
									<TabbedComponent key = {3} tabs={tab_items} />
         		 					
								</div>

								
							
							</div>

							

							
         					
         				 </div>
         		 		
         		 		
          	);

	}


}

