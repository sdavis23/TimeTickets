import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import {printError, printNeutral, printSuccess, submitJSON, displayMessage} from "./formUtils.js";
import {OnSiteButton} from "./render_cell_utils.js";


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default class CustomerRepForm extends Component
{

	constructor(props)
	{
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
    	
   		this.firstNameChange = this.firstNameChange.bind(this);
    	this.lastNameChange = this.lastNameChange.bind(this);
    	
    	this.phoneChange = this.phoneChange.bind(this);
    	this.emailChange = this.emailChange.bind(this);

    	this.displayEmail = this.displayEmail.bind(this);

    	this.clientChange = this.clientChange.bind(this);

    	this.addressChange = this.addressChange.bind(this);
    	

    	var date_init;


    	this.state = 
    	{
    		id: this.props.rep.id,
    		first_name: this.props.rep.first_name,
    		last_name: this.props.rep.last_name,
    		phone: this.props.rep.phone,
    		email: this.props.rep.email,
    		client_id: this.props.rep.company_id,
    		address: this.props.rep.address,
    		error_msg: "",
            succ_msg: ""

    	};

	}

	displayEmail(email)
  	{



    	if(email != null && (email.length == 0 || validateEmail(email) ))
    	{
      		return printNeutral("Email: ", <input value = {email} type="text" onChange = {(e) => this.emailChange(e.target.value)} className="form-control" id="inputSuccess" />);
   		}
    	else if(email == null)
    	{
      		return printNeutral("Email: ", <input value={email} type="text" onChange = {(e) => this.emailChange(e.target.value)} className="form-control" id="inputSuccess" />);
    	}
    	else
    	{
      		return printError("Email: ", <input value = {email} type="text" onChange = {(e) => this.emailChange(e.target.value)} className="form-control" id="inputSuccess" />, "InValid Email");
    	}


 	 }

	handleSubmit()
	{
		

		var save_json = 

		{	id: this.state.id,
			first_name: this.state.first_name.trim(),
			last_name: this.state.last_name.trim(),
			phone: this.state.phone.trim(),
			email: this.state.email.trim(),
			client_id: this.state.client_id,
			address: this.state.address.trim()
			
		};

		console.log("Submit! " + JSON.stringify(save_json));

		var self = this;

		submitJSON(save_json, "/save_customer_rep", 
        function(resp_data)
        {

          if(resp_data.status == "FAIL")
          {

                   console.log("Fail State");
                    self.setState(
    				{
    					id: self.state.id,
						first_name: self.state.first_name,
						last_name: self.state.last_name,
						phone: self.state.phone,
						email: self.state.email,
						client_id: self.state.client_id,
						address: self.state.address,
    					error_msg: resp_data.msg,
                        succ_msg: ""

    				});
              }
              else
              {

                // console.log("Fail State");
                    self.setState({

                      	id: resp_data.msg,
    					
						first_name: self.state.first_name,
						last_name: self.state.last_name,
						phone: self.state.phone,
						email: self.state.email,
						client_id: self.state.client_id,
						address: self.state.address,
                        error_msg: "",
                        succ_msg: "Customer Rep Saved!"
                    });

              }
            });

	}

	firstNameChange(firstName)
	{
		 this.setState({

                      	id: this.state.id,
    					
						first_name: firstName,
						last_name: this.state.last_name,
						phone: this.state.phone,
						email: this.state.email,
						client_id: this.state.client_id,
						address: this.state.address,
                        error_msg: "",
                        succ_msg: ""
                    });

	}

	lastNameChange(lastName)
	{
		 this.setState({

                      	id: this.state.id,
    					
						first_name: this.state.first_name,
						last_name: lastName,
						phone: this.state.phone,
						email: this.state.email,
						client_id: this.state.client_id,
						address: this.state.address,
                        error_msg: "",
                        succ_msg: ""
                    });

	}

	phoneChange(phone)
	{
		 this.setState({

                      	id: this.state.id,
    					
						first_name: this.state.first_name,
						last_name: this.state.last_name,
						phone: phone,
						email: this.state.email,
						client_id: this.state.client_id,
						address: this.state.address,
                        error_msg: "",
                        succ_msg: ""
                    });

	}

	emailChange(email)
	{
		 this.setState({

                      	id: this.state.id,
    					
						first_name: this.state.first_name,
						last_name: this.state.last_name,
						phone: this.state.phone,
						email: email,
						client_id: this.state.client_id,
						address: this.state.address,
                        error_msg: "",
                        succ_msg: ""
                    });

	}


	clientChange(clientSelect)
	{
		 this.setState({

                      	id: this.state.id,
    					
						first_name: this.state.first_name,
						last_name: this.state.last_name,
						phone: this.state.phone,
						email: this.state.email,
						client_id: clientSelect.value,
						address: this.state.address,
                        error_msg: "",
                        succ_msg: ""
                    });

	}

	addressChange(new_address)
	{

		this.setState({
			id: this.state.id,
    					
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			phone: this.state.phone,
			email: this.state.email,
			client_id: this.state.client_id,
			address: new_address,
            error_msg: "",
            succ_msg: ""
		});

	}

	render()
	{

		console.log("State: " + JSON.stringify(this.state));

		return (
			
			<div className = "col-sm-5">

				{displayMessage(this.state.succ_msg, this.state.error_msg)}
	
				<div className = "form-group">
					 {printNeutral("First Name: ", <input value={this.state.first_name} type="text" key ={0} onChange = {(e) => this.firstNameChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>		

				<div className = "form-group">
					 {printNeutral("Last Name: ", <input value={this.state.last_name} type="text" key ={0} onChange = {(e) => this.lastNameChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>	



				<div className = "form-group">
					 {printNeutral("Phone: ", <input value = {this.state.phone} type="text" key ={0} onChange = {(e) => this.phoneChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>	

				<div className = "form-group">
					 {printNeutral("Mailing Address: ", <input value = {this.state.address} type="text" key ={0} onChange = {(e) => this.addressChange(e.target.value)} className="form-control" id="inputSuccess" />)}
				</div>	

				<div className = "form-group">
                  {printNeutral("Client: ", <Select
                                                    key={7}
                                                    multi={false}
                                                    name="client"
                                                    value={this.state.client_id}
                                                    options={this.props.clients}
                                                    onChange={this.clientChange} /> )}
                 </div>


				

				<div className = "form-group">
					{this.displayEmail(this.state.email)}
				</div>	

				<OnSiteButton onClick = {this.handleSubmit} text = "Save Customer Rep" />

			</div>);
	}


}