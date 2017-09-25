import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import  'react-widgets/dist/css/react-widgets.css';
import ReactWidgets from 'react-widgets';
import {printError, printNeutral, printSuccess, submitJSON, displayMessage} from "./formUtils.js";
import {OnSiteButton} from "./render_cell_utils.js";

var dateFormat = require('dateformat');

var DateTimePicker = ReactWidgets.DateTimePicker;

var Moment = require('moment');
var momentLocalizer= require('react-widgets/lib/localizers/moment');
momentLocalizer(Moment);


export default class ProjectForm extends Component
{

	constructor(props)
	{
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
    	
   		this.nameChange = this.nameChange.bind(this);
    	this.oldJobNumChange = this.oldJobNumChange.bind(this);
    	
    	this.locationChange = this.locationChange.bind(this);
    	this.dateChange = this.dateChange.bind(this);
    	this.customerRepChange = this.customerRepChange.bind(this);


    	var date_init;

    	console.log("Props project: " + JSON.stringify(this.props.project));

    	if(!this.props.project.date)
    	{
    		date_init = new Date();
    	}
    	else
    	{
    		var date_parts = this.props.project.date.split("-");

    		date_init = new Date( date_parts[0], date_parts[1] - 1, date_parts[2] );
    	}

    	this.state = 
    	{
    		id: this.props.project.id,
    		name: this.props.project.name,
    		old_job_num: this.props.project.old_job_num,
    		date: date_init,
    		location: this.props.project.location,
    		system_num: this.props.project.job_num,
    		contact_id: this.props.project.customer_rep.id,
    		error_msg: "",
            succ_msg: ""

    	};

	}

	handleSubmit()
	{
		
		var rep_id = "";

		if(this.state.contact_id != null)
		{
			rep_id = this.state.contact_id;
		}

		var save_json = 
		{	id: this.state.id,
			job_num: 0,
			rep_id: this.state.contact_id.trim(),
			location: this.state.location,
			name: this.state.name.trim(),
			old_job_num: this.state.old_job_num.trim(),
			date: dateFormat(this.state.date, "yyyy-mm-dd")

		};

		console.log("Submit! " + JSON.stringify(save_json));

		var self = this;

		submitJSON(save_json, "/save_project", 
        function(resp_data)
        {

          if(resp_data.status == "FAIL")
          {

                   console.log("Fail State");
                    self.setState(
    				{
    					id: self.state.id,
    					name: self.state.name,
    					old_job_num: self.state.old_job_num,
    					date: self.state.date,
    					location: self.state.location,
    					system_num: self.state.system_num,
    					contact_id: self.state.contact_id,
    					error_msg: resp_data.msg,
                        succ_msg: ""

    				});
              }
              else
              {

                // console.log("Fail State");
                    self.setState({

                      	id: resp_data.msg,
    					name: self.state.name,
    					old_job_num: self.state.old_job_num,
    					date: self.state.date,
    					location: self.state.location,
    					system_num: self.state.system_num,
    					contact_id: self.state.contact_id,
                        error_msg: "",
                        succ_msg: "Project Saved!"
                    });

              }
            });

	}

	nameChange(newName)
	{
		this.setState({
			id: this.state.id,
			name: newName,
			old_job_num: this.state.old_job_num,
			location: this.state.location,
			date: this.state.date,
			system_num: this.state.system_num,
			contact_id: this.state.contact_id,
			error_msg: this.state.error_msg,
            succ_msg: this.state.succ_msg
		});
	}


	oldJobNumChange(new_oldJobNum)
	{
		this.setState({
			
			id: this.state.id,
			name: this.state.name,
			old_job_num: new_oldJobNum,
			location: this.state.location,
			date: this.state.date,
			system_num: this.state.system_num,
			contact_id: this.state.contact_id,
			error_msg: this.state.error_msg,
            succ_msg: this.state.succ_msg
		});
	}

	locationChange(newLocation)
	{
		this.setState({
			
			id: this.state.id,
			name: this.state.name,
			old_job_num: this.state.old_job_num,
			location: newLocation,
			date: this.state.date,
			system_num: this.state.system_num,
			contact_id: this.state.contact_id,
			error_msg: this.state.error_msg,
            succ_msg: this.state.succ_msg
		});
	}

	dateChange(date, date_str)
	{

		this.setState({
			
			id: this.state.id,
			name: this.state.name,
			old_job_num: this.state.old_job_num,
			location: this.state.location,
			date: date,
			system_num: this.state.system_num,
			contact_id: this.state.contact_id,
			error_msg: this.state.error_msg,
            succ_msg: this.state.succ_msg
		});
		
	}

	systemNumChange(new_SystemNum)
	{

		this.setState({
			
			id: this.state.id,
			name: this.state.name,
			old_job_num: this.state.old_job_num,
			location: this.state.location,
			date: this.state.date,
			system_num: new_SystemNum,
			contact_id: this.state.contact_id,
			error_msg: this.state.error_msg,
            succ_msg: this.state.succ_msg
		});
		
	}

	customerRepChange(selected_rep)
	{

		var rep_id;

		if(selected_rep == null)
		{
			rep_id = "";
		}
		else
		{	
			//console.log("Here we are");
			rep_id = selected_rep.value;
		}

		this.setState({
			
			id: this.state.id,
			name: this.state.name,
			old_job_num: this.state.old_job_num,
			location: this.state.location,
			date: this.state.date,
			system_num: this.state.system_num,
			contact_id: rep_id,
			error_msg: this.state.error_msg,
            succ_msg: this.state.succ_msg
		});

	}

	render()
	{


		console.log("State: " + JSON.stringify(this.state));

		return (
			
			<div className = "col-sm-5">

				{displayMessage(this.state.succ_msg, this.state.error_msg)}
	
				<div className = "form-group">
					 {printNeutral("Name: ", <input value={this.state.name} type="text" key ={0} onChange = {(e) => this.nameChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>		

				<div className = "form-group">
					 {printNeutral("Location: ", <input value={this.state.location} type="text" key ={0} onChange = {(e) => this.locationChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>	



				<div className = "form-group">
					 {printNeutral("Job Number: ", <input value = {this.state.old_job_num} type="text" key ={0} onChange = {(e) => this.oldJobNumChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>	


				<div className = "form-group">
					 {printNeutral("Customer Rep: ", <Select
                                                    	key={7}
                                                    	multi={false}
                                                    	name="customer_rep"
                                                    	value={this.state.contact_id}
                                                    	options={this.props.contacts}
                                                    	onChange={this.customerRepChange} />)}
				</div>	



				<div className = "form-group">
					 {printNeutral("Date Start: ",<DateTimePicker 
														onChange = {this.dateChange} 
														format={"MM/DD/YYYY"} 
														style = {{width: 200}} 
														value = {this.state.date}/>)}
				</div>	

				

				<OnSiteButton onClick = {this.handleSubmit} text = "Save Project" />

			</div>);
	}



}