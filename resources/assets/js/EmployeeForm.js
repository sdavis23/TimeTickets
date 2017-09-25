import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import {printError, printNeutral, printSuccess, submitJSON, displayMessage} from "./formUtils.js";
import {OnSiteButton, ProjectPicker} from "./render_cell_utils.js";

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default class EmployeeForm extends Component
{

	constructor(props)
	{

		super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.occupationChange = this.occupationChange.bind(this);
    this.firstNameChange = this.firstNameChange.bind(this);
    this.lastNameChange = this.lastNameChange.bind(this);
    this.generateInitials = this.generateInitials.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.initialsChange = this.initialsChange.bind(this);
    this.isAdminChange = this.isAdminChange.bind(this);
    this.displayEmail = this.displayEmail.bind(this);



   this.state = {     id: this.props.employee.id,
                      first_name: this.props.employee.first_name,
                      last_name: this.props.employee.last_name,
                      initials: this.props.employee.initials,
                      is_admin: false,
                      email: this.props.employee.email,
                      occ_ids: this.props.employee.occ_list,
                      error_msg: "",
                      succ_msg: "" 
                    }
	}

  

  handleSubmit()
  {

    console.log("Saving Employee!");

    var save_json = { id: this.state.id,
                      first_name: this.state.first_name.trim(),
                      last_name: this.state.last_name.trim(),
                      initials: this.state.initials.trim(),
                      is_admin: this.state.is_admin,
                      email: this.state.email.trim(),
                      occ_ids: this.state.occ_ids
                    };

    var self = this;

    submitJSON(save_json, "/save_employee", 
        function(resp_data)
        {

          if(resp_data.status == "FAIL")
          {

                   console.log("Fail State");
                    self.setState({

                        id: self.state.id,
                        first_name: self.state.first_name,
                        last_name: self.state.last_name,
                        initials: self.state.initials,
                        is_admin: self.state.is_admin,
                        email: self.state.email,
                        occ_ids: self.state.occ_ids,
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
                        initials: self.state.initials,
                        is_admin: self.state.is_admin,
                        email: self.state.email,
                        occ_ids: self.state.occ_ids,
                        error_msg: "",
                        succ_msg: "Employee: " + self.state.first_name + " " + self.state.last_name + " Saved!"
                    });

              }
            });

  }

  occupationChange(selected_occupations)
  {

    console.log("Changing Occupations: " + JSON.stringify(selected_occupations));

    this.setState({

      id: this.state.id,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      initials: this.state.initials,
      is_admin: this.state.is_admin,
      email: this.state.email,
      occ_ids: selected_occupations.map((element) => element.value) ,
      error_msg: this.state.error_msg,
      succ_msg: this.state.succ_msg
    });

  }

  firstNameChange(firstName)
  {

    this.setState({

      id: this.state.id,
      first_name: firstName,
      last_name: this.state.last_name,
      initials: this.generateInitials(firstName, this.state.last_name),
      is_admin: this.state.is_admin,
      email: this.state.email,
      occ_ids: this.state.occ_ids,
      error_msg: this.state.error_msg,
      succ_msg: this.state.succ_msg });

  }

  lastNameChange(lastName)
  {

    this.setState({

      id: this.state.id,
      first_name: this.state.first_name,
      last_name: lastName,
      initials: this.generateInitials(this.state.first_name, lastName),
      is_admin: this.state.is_admin,
      email: this.state.email,
      occ_ids: this.state.occ_ids,
      error_msg: this.state.error_msg,
      succ_msg: this.state.succ_msg });

  }

  isAdminChange(is_admin)
  {

    this.setState({

      id: this.state.id,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      initials: this.state.initials,
      is_admin: is_admin,
      email: this.state.email,
      occ_ids: this.state.occ_ids,
      error_msg: this.state.error_msg,
      succ_msg: this.state.succ_msg });

  }

  initialsChange(initials)
  {

    this.setState({

      id: this.state.id,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      initials: initials,
      is_admin: this.state.is_admin,
      email: this.state.email,
      occ_ids: this.state.occ_ids,
      error_msg: this.state.error_msg,
      succ_msg: this.state.succ_msg});

  }

  emailChange(email)
  {
    console.log("Valid Email? " + validateEmail(email));

    this.setState({

      id: this.state.id,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      initials: this.state.initials,
      is_admin: this.state.is_admin,
      email: email,
      occ_ids: this.state.occ_ids,
      error_msg: this.state.error_msg,
      succ_msg: this.state.succ_msg });
  }

  generateInitials(first_name, last_name)
  {



    if(first_name != null && last_name != null && first_name.length >= 1 && last_name.length >=1)
    {
      return this.state.first_name[0] + this.state.last_name[0];
    }

    else
    {
      return "";
    }
    
  }

  displayEmail(email)
  {



    if(email != null && (email.length == 0 || validateEmail(email) ))
    {
      return printNeutral("Email: (Optional)", <input value = {email} ype="text" onChange = {(e) => this.emailChange(e.target.value)} className="form-control" id="inputSuccess" />);
    }
    else if(email == null)
    {
      return printNeutral("Email: (Optional)", <input value={email} type="text" onChange = {(e) => this.emailChange(e.target.value)} className="form-control" id="inputSuccess" />);
    }
    else
    {
      return printError("Email: (Optional)", <input value = {email} type="text" onChange = {(e) => this.emailChange(e.target.value)} className="form-control" id="inputSuccess" />, "InValid Email");
    }


  }

  

	render()
	{

    console.log("State: " + JSON.stringify(this.state));
    

    
   
		return (
			
			<div className = "col-sm-5">
			
        
       
          {displayMessage(this.state.succ_msg, this.state.error_msg)}
        

				<div className = "form-group">
					 {printNeutral("First Name: ", <input type="text" key ={0} onChange = {(e) => this.firstNameChange(e.target.value)} value ={this.state.first_name} className="form-control" id="inputSuccess" />)}
				</div>		

						

  					     <div className = "form-group">
           			  {printNeutral("Last Name: ", <input type="text" onChange = {(e) => this.lastNameChange(e.target.value)} value = {this.state.last_name} className="form-control" id="inputSuccess" />)}
           			 </div>

           			 <div className = "form-group">
           			  {this.displayEmail(this.state.email)}
           			 </div>

                 <div className = "form-group">
                  {printNeutral("Occupations: ", <Select
                                                    key={7}
                                                    multi={true}
                                                    name="occupations"
                                                    value={this.state.occ_ids}
                                                    options={this.props.occupations}
                                                    onChange={this.occupationChange} /> )}
                 </div>

           			 <div className = "form-group">
           			  {printNeutral("Initials: ",  <input type="text" value = {this.state.initials} onChange = {(e) => this.initialsChange(e.target.value)} className="form-control" id="inputSuccess" value={this.state.initials} /> )}
           			 </div>

        

  					     <div style={{visibility: "hidden"}}>
                    <label>
                        Admin?
                    </label>
                    <input type="checkbox" value={this.state.is_admin} onChange = {(e) => this.isAdminChange(e.target.checked)}  />
                	</div>


  				
  		    		<OnSiteButton onClick = {this.handleSubmit} text = "Save Employee" />
  		    	
  		    </div>);
	}


}