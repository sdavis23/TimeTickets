import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {DraftColourConfigTable} from "./displayTables.js";
import {createDataTable} from "./dataTable.js";
import {OnSiteButton, sendToServer} from "./render_cell_utils.js";
import {displayMessage} from "./formUtils.js";
import update from 'react-addons-update';
import Select from "react-select";

function ConfigView()
{

	return function(props)
	{

	
		return <DraftColourConfigTable 
					key = {100}
				    onCellChange = {props.onCellChange}
				    onRowClick = {props.onRowClick}
                    top =   {0}
                    left =  {0}
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
		colour:"",
		max:"",
		min: ""
	};
}

function StateChange(row_index, col_index, row, new_val)
{

	console.log("Row: " + JSON.stringify(row));

	switch(col_index)
	{
		case 0:
			row.colour = new_val;
			break;

		case 1:
			row.min = new_val;
			break;

		case 2:
			row.max = new_val;
			break;

		

	}

	return row;

}


export default class DraftColourEdit extends Component
{

	constructor(props)
	{
		super(props);
		
		this.handleSaveClick = this.handleSaveClick.bind(this);
		this.cellChange = this.cellChange.bind(this);
		
		

		
		console.log("Init Props: " + JSON.stringify(this.props) );

		this.state = {

			rows: this.props.rows,
			
			error_msg: "",
			success_msg: ""
		};



	}

	handleSaveClick()
	{
		var self = this;

		sendToServer(this.state.rows, "/save_draft_datahighlight", 
			function(row)
			{

				

				console.log("SAVING ROW: " + JSON.stringify(row));

				return {
					id: row.id,
					colour: row.colour,
					max: row.max,
					min: row.min
					
				};			

			}).then(
				function(result)
				{



					if(result.status != "FAIL")
					{

						const newIDs = result.msg;

						
						self.setState({
							rows: self.state.rows,
							
							error_msg: self.state.error_msg,
							success_msg: "Tables successfully saved!"

						});
					}
					
					else
					{
						



					self.setState({
							rows: self.state.rows,
							
							error_msg: self.state.error_msg,
							success_msg: "Could not save tables!"

						});
					}

				});
	}

	cellChange(rows, col_index, row_index)
	{


		this.setState({	rows: rows, 
						
						error_msg: "",
						success_msg: ""
					})
		
	}


	render()
	{


		//console.log("State: " + JSON.stringify(this.state) );
		var ConfigTable = ConfigView();
		var HighlightTable = createDataTable(ConfigTable, defaultRow, StateChange, displayRow, this.cellChange);

		
		console.log("Current Rows: " + JSON.stringify(this.state.rows));

		return (


			<div key = {0}>	

				{displayMessage(this.state.success_msg, this.state.error_msg)}

				<div key = {0} className = "row">

					<div  key = {0} className = "col-sm-1">
						<OnSiteButton onClick=  {(e) => this.handleSaveClick()} text="Save Tables" />
					</div>

				</div>

				<div key={1} className="row">
					<HighlightTable key={0}  rows = {this.state.rows} />
				</div>

			
			</div>


			);

	}

}