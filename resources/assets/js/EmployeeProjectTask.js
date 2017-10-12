import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {ProjectTaskTable} from "./displayTables.js";
import {createDataTable} from "./dataTable.js";
import {OnSiteButton, sendToServer} from "./render_cell_utils.js";
import {displayMessage} from "./formUtils.js";
import update from 'react-addons-update';
import Select from "react-select";

function ProjectTaskView(tasks)
{

	return function(props)
	{

	
		return <ProjectTaskTable 
					key = {100}
				    onCellChange = {props.onCellChange}
				    onRowClick = {props.onRowClick}
                    top =   {0}
                    left =  {0}
                    is_employee={true}
                    highlightedRows={props.highlightedRows} 
                    rows = {props.rows}  />;

	};

}

function displayRow(row)
{
	return row;
}

function defaultRow()
{

	console.log("FIRST TASK: " + JSON.stringify(tasks[0]));
	

	return {
		id: "NEW",
		name:"",
		description:"",
		estimated_time: "",
		actual_time: "",
		assigned_to:"",
		task:""
	};
}

function projectStateChange(row_index,  col_index, row, new_val)
{

	switch(col_index)
	{
		case 0:
			row.name = new_val;
			break;

		case 1:
			row.description = new_val;
			break;

		case 2:
			row.estimated_time = new_val;
			break;

		case 3:
			row.actual_time = new_val;
			break;

		case 4:
			row.assigned_to = new_val;
			break;

	}

	return row;

}

export default class EmployeeProjectTask extends Component
{

	constructor(props)
	{
		super(props);
		
		this.handleSaveClick = this.handleSaveClick.bind(this);
		this.cellChange = this.cellChange.bind(this);
		this.get_current_rows = this.get_current_rows.bind(this);
		this.changeProjectID = this.changeProjectID.bind(this);
		

		this.tables = [];

		var i;

		for(i = 0; i < this.props.projects.length; i++)
		{
			let table_index = i;
			this.tables.push( createDataTable(	ProjectTaskView(),  
												() => defaultRow(),
												projectStateChange, displayRow, ( (rows, col_index, row_index) => this.cellChange(table_index, rows, col_index, row_index) ) ) );	
		}


		this.project_options = this.props.projects.map(
											function(project)
											{
												return {value: project.id, label: project.name};

											});

		console.log("Init Props: " + JSON.stringify(this.props) );

		this.state = {

			rows: this.props.project_tasks,
			current_project_index: 0,
			error_msg: "",
			success_msg: ""
		};
	}



	cellChange(table_index, table_rows, col_index, row_index)
	{
		console.log('Table : ' + table_index + ", Col: " + col_index + ", Row Index: " + row_index);

		var current_project_id = this.props.projects[table_index].id;

		// keeps track to see if the row index that we have found in the array is the same as the row_index that matches cell change
		var current_row_index = 0;

		const updatedRows = update(this.state.rows, 
												{$apply: 
														function(rows) {

															return rows.map(
																function(row, index)
																{

																	var rowName;
																	if(row.project == current_project_id )
																	{
																		if(current_row_index == row_index)
																		{	
																			current_row_index++;
																			return table_rows[row_index];

																		}
																		else
																		{
																			current_row_index++;
																			return row;
																		}
																		
																	}

																	else
																	{
																		return row;
																	}

																	

																});
															
														} });

		this.setState({	rows: updatedRows, 
						current_project_index: this.state.current_project_index,
						error_msg: "",
						success_msg: ""
					})
		
	}

	handleSaveClick()
	{
		var self = this;

		sendToServer(this.state.rows, "/save_project_tasks", 
			function(row)
			{

				

				console.log("SAVING ROW: " + JSON.stringify(row));

				return {
					id: row.id,
					name: row.name,
					estimated_time: row.estimated_time,
					actual_time: row.actual_time,
					assigned_to: row.assigned_to.id,
					description: row.description,
					project_id: row.project

				};			

			}).then(
				function(result)
				{



					if(result.status != "FAIL")
					{

						const newIDs = result.msg;

						
						self.setState({
							rows: self.state.rows,
							current_project_index: self.state.current_project_index,
							error_msg: self.state.error_msg,
							success_msg: "Tables successfully saved!"

						});
					}
					
					else
					{
						

					self.setState({
							rows: self.state.rows,
							current_project_index: self.state.current_project_index,
							error_msg: self.state.error_msg,
							success_msg: "Could not save tables!"

						});
					}

				});
	}

	changeProjectID(selected_val)
	{
		console.log("Project ID Changed!");
		var i;
		var found_project = false;
		var new_project_id = selected_val.value;
		var found_index;

		for(i = 0; i < this.props.projects.length && !found_project; i++)
		{
			found_project = (this.props.projects[i].id == new_project_id);

			if(found_project)
			{
				found_index = i;
			}

			console.log("Found: " + found_project + ", i: " + found_index);

		}

		this.setState({
			rows: this.state.rows,
			current_project_index: found_index,
			error_msg: this.state.error_msg,
			success_msg: this.state.success_msg
		});
	}

	get_current_rows()
	{

		var all_rows = this.state.rows;
		var current_project_id = this.props.projects[this.state.current_project_index].id;

		
		return all_rows.filter(
					function(row)
					{
						

						return row.project == current_project_id;

					});

	}

	render()
	{

		//console.log("State: " + JSON.stringify(this.state) );
		var ProjectTable = this.tables[this.state.current_project_index];

		var current_rows = this.get_current_rows();

		console.log("Current Rows: " + JSON.stringify(current_rows));

		return (


			<div key = {0}>	

				{displayMessage(this.state.success_msg, this.state.error_msg)}

				<div key = {0} className = "row">

					<div  key = {0} className = "col-sm-1">
						<OnSiteButton onClick=  {(e) => this.handleSaveClick()} text="Save Tables" />
					</div>

					<div  key = {1} className = "col-sm-2">
						<Select
  							name="current_project"
  							value={this.props.projects[this.state.current_project_index].id}
  							options={this.project_options}
  							onChange={this.changeProjectID} />
					</div>

				</div>
				<div key={1} className="row">
					<ProjectTable key={0}  rows = {current_rows} />
				</div>

			
			</div>


			);

	}

}