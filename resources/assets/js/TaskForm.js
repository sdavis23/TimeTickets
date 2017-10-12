import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {printError, printNeutral, printSuccess, submitJSON, displayMessage} from "./formUtils.js";
import {OnSiteButton} from "./render_cell_utils.js";

export default class TaskForm extends Component
{

	constructor(props)
	{
		super(props);

        this.nameChange = this.nameChange.bind(this);
        this.descriptionChange = this.descriptionChange.bind(this);
        this.estimatedTimeChange = this.estimatedTimeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    	this.state = 
    	{
    		id: this.props.task.id,
    		name: this.props.task.name,
    		description: this.props.task.description,
    		estimated_time: this.props.task.estimated_time,
    		
    		error_msg: "",
            succ_msg: ""

    	};

    }


    nameChange(newName)
    {


    	this.setState(
    	{
    		id: this.state.id,
    		name: newName,
    		description: this.state.description,
    		estimated_time: this.state.estimated_time,
    		
    		error_msg: "",
            succ_msg: ""

    	});
    }

    descriptionChange(newDescription)
    {


    	this.setState(
    	{
    		id: this.state.id,
    		name: this.state.name,
    		description: newDescription,
    		estimated_time: this.state.estimated_time,
    		
    		error_msg: "",
            succ_msg: ""

    	});
    }

    estimatedTimeChange(est_time)
    {


    	this.setState(
    	{
    		id: this.state.id,
    		name: this.state.name,
    		description: this.state.description,
    		estimated_time: est_time,
    		
    		error_msg: "",
            succ_msg: ""

    	});
    }

    handleSubmit()
    {

    	console.log("Saving!");

    	var self = this;

    	var save_json = 
    	{
    		id: this.state.id.trim(),
    		name: this.state.name.trim(),
    		description: this.state.description.trim(),
    		estimated_time: this.state.estimated_time.trim(),

    	};

    	submitJSON(save_json, "/save_task", 
        function(resp_data)
        {

          if(resp_data.status == "FAIL")
          {

                   console.log("Fail State");
                    self.setState(
    				{
    					id: self.state.id,
    					name: self.state.name,
    					description: self.state.description,
    					estimated_time: self.state.estimated_time,
    					error_msg: resp_data.msg,
                        succ_msg: ""

    				});
              }
              else
              {

                // console.log("Fail State");
                    self.setState({

                      	id: self.state.id,
    					name: self.state.name,
    					description: self.state.description,
    					estimated_time: self.state.estimated_time,
                        error_msg: "",
                        succ_msg: "Task Saved!"
                    });

              }
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
					 {printNeutral("Description: ", <input value={this.state.description} type="text" key ={0} onChange = {(e) => this.descriptionChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>	


				<div className = "form-group">
					 {printNeutral("Estimated Time: ", <input value = {this.state.estimated_time} type="number"  pattern="[0-9]*" key ={0} onChange = {(e) => this.estimatedTimeChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>	


				<OnSiteButton onClick = {this.handleSubmit} text = "Save Task" />

			</div>);

    }

}