
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import  'react-widgets/dist/css/react-widgets.css';
import ReactWidgets from 'react-widgets';
import {printError, printNeutral, printSuccess, displayErrorMessage} from "./formUtils.js";
import {projectInfoComplete} from "./validations.js";

import {OnSiteButton, ProjectPicker} from "./render_cell_utils.js";
var dateFormat = require('dateformat');

var DateTimePicker = ReactWidgets.DateTimePicker;

var Moment = require('moment');
var momentLocalizer= require('react-widgets/lib/localizers/moment');
momentLocalizer(Moment);





export default class PDFForm extends Component
{

	constructor(props)
	{
		super(props);

		console.log("Constructing!");

		var today = new Date();
		today.setDate(today.getDate() - 1)

		var current_project = this.props.projects[0];
		var error_msg = this.projectErrorMsg(current_project)


		this.state = 
		{
			  start_date: today,
			  end_date: new Date(),
			  job_number: this.props.projects[0],
			  canSubmit: error_msg.length == 0,
			  errorMsg: error_msg
		};

	  this.handleProjectChange = this.handleProjectChange.bind(this);
	
	  this.startDateChange = this.startDateChange.bind(this);
	  this.endDateChange = this.endDateChange.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);

	  this.endDateRule = this.endDateRule.bind(this);
	  this.startDateRule = this.startDateRule.bind(this);

	  this.startDateInputDisplay = this.startDateInputDisplay.bind(this);
	  this.endDateInputDisplay = this.endDateInputDisplay.bind(this);

	}

	

	startDateChange(date, date_str)
	{

		
		console.log("Rule Eval: " + this.startDateRule(date, this.state.end_date)());

		this.setState(
			{ 
			  	start_date: date,
				end_date: this.state.end_date,
				job_number: this.state.job_number,
				canSubmit: this.startDateRule(date, this.state.end_date)(),
				errorMsg: ""
			});
	}

	endDateChange(date, date_str)
	{

		console.log("End Date: " + JSON.stringify(date));


		this.setState(
			{ 
			  
			  start_date: this.state.start_date,
				end_date: date,
				job_number: this.state.job_number,
				canSubmit: this.endDateRule(date, this.state.start_date)(),
				errorMsg: this.state.errorMsg
			});
	}

	projectErrorMsg(proj)
	{
		if(!projectInfoComplete(proj))
		{
			return "Data is missing from this project! You must correct before submitting";
		}
		else
		{
			return "";
		}
	}

	handleProjectChange(proj)
	{
		console.log("Project: " + JSON.stringify(proj));

		var error_msg = this.projectErrorMsg(proj);

		


		this.setState(
			{ 
			  
			  	start_date: this.state.start_date,
				end_date: this.state.end_date,
				job_number: proj,
				canSubmit: error_msg.length == 0,
				errorMsg: error_msg
			});
	}

	

	handleSubmit()
	{

		var invoiceURL = "/invoicePDF/" + this.state.job_number.job_num + "/" + dateFormat(this.state.start_date, "yyyy-mm-dd") + "/" + dateFormat(this.state.end_date, "yyyy-mm-dd");
		console.log("Invoice URL: " + invoiceURL);


		if(this.state.canSubmit)
		{
			
			window.location = invoiceURL;

		}
		

		

	}

	/*
		Validates the value of inputElement using 
		the function validState - 
			checks the state of the component and returns true if 
			the form should be allowed to continue.

		errorMsg - the msg to be displayed on an error.
	*/
	formValidation(validState, labelText, inputElement, errorMsg)
	{

		if(!validState())
		{
			
			return printError(labelText, inputElement, errorMsg);
			
		}

		else 
		{
			
			return printNeutral(labelText, inputElement);	
			
		}



	}

	startDateRule(start_date, end_date)
	{
		
		return (() => start_date < end_date);
	}

	endDateRule(end_date, start_date)
	{

		return (() => start_date < end_date);
	}

	startDateInputDisplay()
	{

		return this.formValidation(this.startDateRule(this.state.start_date, this.state.end_date), "Start Date: ", <DateTimePicker 	onChange = {this.startDateChange} 
																		format={"MM/DD/YYYY"} 
																		style = {{width: 200}} 
																		value = {this.state.start_date}/>, "Start Date must be less than end Date");



		

		

	}

	endDateInputDisplay()
	{

		return this.formValidation(this.endDateRule(this.state.end_date, this.state.start_date), "End Date: ",
									<DateTimePicker 
											onChange = {this.endDateChange} 
											format={"MM/DD/YYYY"} 
											style = {{width: 200}} 
											value = {this.state.end_date}/>, "End Date must be greater than Start Date");
	}


	render()
	{

		console.log("Rendering! " + JSON.stringify(this.state));

		

	

		return (
			
			<div className = "col-sm-5">
			
				{displayErrorMessage(this.state.errorMsg)}

				<div className = "form-group">
						

						{this.startDateInputDisplay()}
  					
  						{this.endDateInputDisplay()}
  						


  						<label>Project:</label>
  						<ProjectPicker 	projectChange = {this.handleProjectChange}
  						   				project = {this.props.projects[0]}
  						   				projects = {this.props.projects} />
  					
  				

  		    		<OnSiteButton onClick = {this.handleSubmit} text = "Get PDFs" />
  		    	</div>
  		    </div>
		);
	}

}