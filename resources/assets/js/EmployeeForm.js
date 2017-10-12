import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import {printError, printNeutral, printSuccess, submitJSON, displayMessage} from "./formUtils.js";
import {OnSiteButton, OnSiteLinkButton, ProjectPicker} from "./render_cell_utils.js";

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
    this.draftsmenChange = this.draftsmenChange.bind(this);
    this.trelloUserNameChange = this.trelloUserNameChange.bind(this);
    this.trelloTokenChange = this.trelloTokenChange.bind(this);


   this.state = {     id: this.props.employee.id,
                      first_name: this.props.employee.first_name,
                      last_name: this.props.employee.last_name,
                      initials: this.props.employee.initials,
                      is_admin: (this.props.employee.is_admin == "1"),
                      email: this.props.employee.email,
                      occ_ids: this.props.employee.occ_list,
                      trello_token: this.props.employee.trello_token,
                      trello_username: this.props.employee.trello_username,
                      trello_token: this.props.employee.trello_token,
                      is_draftsmen: (this.props.employee.is_draftsmen == "1"),
                      error_msg: "",
                      succ_msg: "" 
                    }
	}

  

  handleSubmit()
  {

    console.log("Saving Employee! " + JSON.stringify(this.state));

    var save_json = { id: this.state.id,
                      first_name: this.state.first_name.trim(),
                      last_name: this.state.last_name.trim(),
                      initials: this.state.initials.trim(),
                      is_admin: this.state.is_admin,
                      email: this.state.email.trim(),
                      trello_username: this.state.trello_username.trim(),
                      trello_token: this.state.trello_token.trim(),
                      occ_ids: this.state.occ_ids,
                      is_draftsmen: this.state.is_draftsmen
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
                        is_draftsmen: self.state.is_draftsmen,
                        trello_username: self.state.trello_username,
                        trello_token: self.state.trello_token,
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
                        is_draftsmen: self.state.is_draftsmen,
                        trello_username: self.state.trello_username,
                        trello_token: self.state.trello_token,
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
      is_draftsmen: this.state.is_draftsmen,
      trello_username: this.state.trello_username,
      trello_token: this.state.trello_token,
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
      is_draftsmen: this.state.is_draftsmen,
      trello_username: this.state.trello_username,
      trello_token: this.state.trello_token,
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
      is_draftsmen: this.state.is_draftsmen,
       trello_username: this.state.trello_username,
      trello_token: this.state.trello_token,
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
      is_draftsmen: this.state.is_draftsmen,
      trello_username: this.state.trello_username,
      trello_token: this.state.trello_token,
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
      is_draftsmen: this.state.is_draftsmen,
      trello_username: this.state.trello_username,
      trello_token: this.state.trello_token,
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
      is_draftsmen: this.state.is_draftsmen,
      trello_username: this.state.trello_username,
      trello_token: this.state.trello_token,
      error_msg: this.state.error_msg,
      succ_msg: this.state.succ_msg });
  }

  draftsmenChange(is_draftsmen)
  {
    console.log("Is Draftsmen? " + is_draftsmen);

    this.setState({

      id: this.state.id,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      initials: this.state.initials,
      is_admin: this.state.is_admin,
      email: this.state.email,
      occ_ids: this.state.occ_ids,
      is_draftsmen: is_draftsmen,
      trello_username: this.state.trello_username,
      trello_token: this.state.trello_token,
      error_msg: this.state.error_msg,
      succ_msg: this.state.succ_msg });
  }

  trelloUserNameChange(new_trello_username)
  {
    

    this.setState({

      id: this.state.id,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      initials: this.state.initials,
      is_admin: this.state.is_admin,
      email: this.state.email,
      occ_ids: this.state.occ_ids,
      is_draftsmen: this.state.is_draftsmen,
      trello_username: new_trello_username,
      trello_token: this.state.trello_token,
      error_msg: this.state.error_msg,
      succ_msg: this.state.succ_msg });
  }

  trelloTokenChange(new_trello_token)
  {
    

    this.setState({

      id: this.state.id,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      initials: this.state.initials,
      is_admin: this.state.is_admin,
      email: this.state.email,
      occ_ids: this.state.occ_ids,
      is_draftsmen: this.state.is_draftsmen,
      trello_username: this.state.trello_username,
      trello_token: new_trello_token,
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

                   <div className = "form-group" >
                    <label>
                       Draftsmen?
                    </label>
                    <input type="checkbox" value={this.state.is_draftsmen} checked = {this.state.is_draftsmen} onChange = {(e) => this.draftsmenChange(e.target.checked)}  />
                  </div>
        
                   <div className = "form-group" >
                    {printNeutral("Trello Username",
                                  <input  type="text" 
                                          value={this.state.trello_username} 
                                          className="form-control"
                                          onChange = {(e) => this.trelloUserNameChange(e.target.value)} />)}
                  </div>


                   <div className = "form-group" >
                    {printNeutral("Trello Token",
                                  <input  type="text" 
                                          value={this.state.trello_token} 
                                          className="form-control"
                                          onChange = {(e) => this.trelloTokenChange(e.target.value)} />)}
                  </div>

  					     <div style={{visibility: "hidden"}}>
                    <label>
                        Admin?
                    </label>
                    <input type="checkbox" value={this.state.is_admin} checked = {this.state.is_admin} onChange = {(e) => this.isAdminChange(e.target.checked)}  />
                	</div>

 
              <OnSiteLinkButton link="https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=e1dbefc801c245737f11408ff28187fb" text="Get Trello Token" />
  				
  		    		<OnSiteButton onClick = {this.handleSubmit} text = "Save Employee" />
  		    	
  		    </div>);
	}


}