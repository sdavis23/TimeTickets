import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {printError, printNeutral, printSuccess, submitJSON, displayMessage} from "./formUtils.js";
import {OnSiteButton} from "./render_cell_utils.js";

export default class ProjectForm extends Component
{

	constructor(props)
	{
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
    	
   		this.longNameChange = this.longNameChange.bind(this);
    	this.shortNameChange = this.shortNameChange.bind(this);
    	this.websiteChange = this.websiteChange.bind(this);
    
        console.log("Client: " + JSON.stringify(this.props.client));

    	this.state = 
    	{
    		id: this.props.client.id,
    		long_name: this.props.client.name,
    		short_name: this.props.client.short_name,
    		website: this.props.client.website,
    		
    		error_msg: "",
            succ_msg: ""

    	};

    }


    longNameChange(new_long_name)
    {
    	this.setState({

    		id: this.state.id,
    		long_name: new_long_name,
    		short_name: this.state.short_name,
    		website: this.state.website,
    		
    		error_msg: "",
            succ_msg: ""

    	});
    }

    shortNameChange(new_short_name)
    {
    	this.setState({

    		id: this.state.id,
    		long_name: this.state.long_name,
    		short_name: new_short_name,
    		website: this.state.website,
    		
    		error_msg: "",
            succ_msg: ""

    	});
    }

   	websiteChange(new_website)
    {
    	this.setState({

    		id: this.state.id,
    		long_name: this.state.long_name,
    		short_name: this.state.short_name,
    		website: new_website,
    		
    		error_msg: "",
            succ_msg: ""

    	});
    }

    handleSubmit()
    {

    	var self = this;

    	var save_json = 
    	{
    		id: this.state.id,
    		long_name: this.state.long_name.trim(),
    		short_name: this.state.short_name.trim(),
    		website: this.state.website.trim()

    	};

    	submitJSON(save_json, "/save_client", 
        function(resp_data)
        {

          if(resp_data.status == "FAIL")
          {

                   console.log("Fail State");
                    self.setState(
    				{
    					id: self.state.id,
    					long_name: self.state.long_name,
    					short_name: self.state.short_name,
    					website: self.state.website,
    					error_msg: resp_data.msg,
                        succ_msg: ""

    				});
              }
              else
              {

                // console.log("Fail State");
                    self.setState({

                      	id: self.state.id,
    					long_name: self.state.long_name,
    					short_name: self.state.short_name,
    					website: self.state.website,
                        error_msg: "",
                        succ_msg: "Client Saved!"
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
					 {printNeutral("Long Name: ", <input value={this.state.long_name} type="text" key ={0} onChange = {(e) => this.longNameChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>		

				<div className = "form-group">
					 {printNeutral("Short Name: ", <input value={this.state.short_name} type="text" key ={0} onChange = {(e) => this.shortNameChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>	


				<div className = "form-group">
					 {printNeutral("website: ", <input value = {this.state.website} type="text" key ={0} onChange = {(e) => this.websiteChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>	


				

				

				<OnSiteButton onClick = {this.handleSubmit} text = "Save Client" />

			</div>);

    }

}