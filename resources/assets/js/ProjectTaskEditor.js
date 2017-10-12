import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {ProjectTaskTable} from "./displayTables.js";
import {createDataTable} from "./dataTable.js";
import {OnSiteButton, sendToServer} from "./render_cell_utils.js";
import {displayMessage} from "./formUtils.js";
import update from 'react-addons-update';

function ProjectTaskView(tasks, employees)
{

	return function(props)
	{

		console.log("*** TASK VIEW props: " + JSON.stringify(props.onRowClick));




		return <ProjectTaskTable 
					key = {100}
				    onCellChange = {props.onCellChange}
				    onRowClick = {props.onRowClick}
                    top =   {0}
                    left =  {0}
                    is_employee={false}
                    highlightedRows={props.highlightedRows} 
                    rows = {props.rows} 
                    employees = {employees} 
                    tasks={tasks} />;

	};

}

function displayRow(row)
{
	return row;
}

function defaultRow(tasks, employees)
{

	console.log("FIRST TASK: " + JSON.stringify(tasks[0]));
	var task = tasks[0];

	return {
		id: "NEW",
		name: task.name,
		description: task.description,
		estimated_time: task.estimated_time,
		actual_time: 0,
		assigned_to: employees[0],
		task: tasks[0]
	};
}

function projectStateChange(row_index,  col_index, row, new_val)
{
	console.log("**** CHANGING COL: ***" + col_index);


	switch(col_index)
	{
		case 0:


			console.log("CHANGING STATE 0");

			if(row.id == "NEW")
			{
				console.log("CHANGING TASK");
				row.task = new_val;

				row.description = new_val.description;
				row.estimated_time = new_val.estimated_time;
			}
			else
			{
				row.name = new_val;
			}
			
			break;
		case 1:

			row.description = new_val;
			break;

		case 2:
			console.log("Changing estimated_time");

			row.estimated_time = new_val;
			break;

		case 3:
			row.actual_time = new_val;
			break;

		case 4:
			row.assigned_to = new_val;
			break;

	}

	console.log("Row: " + JSON.stringify(row));

	return row;

}


export default class ProjectTaskEditor extends Component
{

	constructor(props)
	{
		super(props);

		this.cellChange = this.cellChange.bind(this);
		this.handleRowAdd = this.handleRowAdd.bind(this);
		this.handleRowDelete = this.handleRowDelete.bind(this);

		this.saveRows = this.saveRows.bind(this);
		this.deleteRows = this.deleteRows.bind(this);

		

		this.table =  createDataTable(		ProjectTaskView(this.props.tasks, this.props.employees),  
											() => defaultRow(this.props.tasks, this.props.employees),
											projectStateChange, displayRow, this.cellChange );

		this.state = {

			rows: this.props.rows,
			deleted_rows: [],
			error_msg: "",
			success_msg: ""
		};
	}

	cellChange(rows, col_index, row_index)
	{
		
		console.log("FINAL CELL CHANGE! " + JSON.stringify(rows));
		this.setState({	rows: rows, 
						deleted_rows: this.state.deleted_rows,
						error_msg: this.state.error_msg,
						success_msg: this.state.success_msg
					});
	}


	handleRowAdd(rows)
	{
		console.log("Labour Row Add: " + JSON.stringify(rows));

		this.setState({ rows: rows, 
						error_msg: this.state.error_msg,
						success_msg: this.state.success_msg,
						deleted_rows: this.state.deleted_rows});
	}

	handleRowDelete(rows, deleted_rows)
	{

		console.log("Row Delete! ");

		this.setState({	rows: rows, 
						deleted_rows: deleted_rows, 
						error_msg: this.state.error_msg,
						success_msg: this.state.success_msg,});

	}

	saveRows()
	{

		var projectID = this.props.project_id;
		var self = this;

		sendToServer(this.state.rows, "/save_project_tasks", 
			function(row)
			{

				var rowName;

				if(row.id == "NEW")
				{
					rowName = row.task.name;
				}
				else
				{
					rowName = row.name;
				}

				console.log("SAVING ROW: " + JSON.stringify(row));

				return {
					id: row.id,
					name: rowName,
					estimated_time: row.estimated_time,
					actual_time: row.actual_time,
					assigned_to: row.assigned_to.id,
					description: row.description,
					project_id: projectID,
					colour: row.colour

				};			

			}).then(
				function(result)
				{



					if(result.status != "FAIL")
					{

						const newIDs = result.msg;

						const updatedRows = update(self.state.rows, 
												{$apply: 
														function(rows) {

															return rows.map(
																function(row, index)
																{

																	var rowName;
																	if(row.id == "NEW")
																	{
																		rowName = row.task.name;
																	}
																	else
																	{
																		rowName = row.name
																	}

																	return {	id: newIDs[index],
																				name: rowName,
																				description: row.description,
																				estimated_time: row.estimated_time,
																				actual_time: row.actual_time,
																				assigned_to: row.assigned_to, 
																				colour: row.colour
																			};

																});
															
														} });

						self.setState({
							rows: updatedRows,
							deleted_rows: self.state.deleted_rows,
							error_msg: self.state.error_msg,
							success_msg: "Tables successfully saved!"

						});
					}
					
					else
					{
						



						self.setState({
							rows: self.state.rows,
							deleted_rows: self.state.deleted_rows,
							error_msg: self.state.error_msg,
							success_msg: "Could not save tables!"

						});
					}

				});

	}



	deleteRows()
	{

		var projectID = this.props.project_id;

		sendToServer(this.state.deleted_rows, "/delete_project_tasks", 
			function(row)
			{
				
				return { id: row.id };			

			});

	}


	handleSaveClick()
	{

		console.log("Save!");

		this.saveRows();
		this.deleteRows();
	}

	render()
	{

		console.log("State: " + JSON.stringify(this.state) );
		var ProjectTable = this.table;


		return (

			<div key = {0}>	

				{displayMessage(this.state.success_msg, this.state.error_msg)}

				<div key = {0} className = "row">

					<div  key = {0} className = "col-sm-1">
						<OnSiteButton onClick=  {(e) => this.handleSaveClick()} text="Save Table" />
					</div>

				</div>
				<div key={1} className="row">
					<ProjectTable key={0}  onRowAdd = {this.handleRowAdd} onRowDelete={this.handleRowDelete} rows = {this.state.rows} />
				</div>

			
			</div>


			);

	}

}