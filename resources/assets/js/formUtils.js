import React, { Component } from 'react';


function successMessage(msg)
{
    return (<div className="form-group has-success">
              <label className="control-label" htmlFor="inputSuccess"> {msg}</label>
            </div>);
}

function errorMessage(msg)
{
    return (<div className="form-group has-error">
              <label className="control-label" htmlFor="inputError"> {msg}</label>
            </div>);
}


function noMessage()
{
    return (<div >
             
            </div>);
}

export function displayErrorMessage(error_msg)
{

  if(error_msg.length > 0)
  {
    return errorMessage(error_msg);
  }
  else
  {
    return noMessage();
  }

}

/*

  If error_msg is not blank, returns the div containing an error message:
    otherwise checks to see if succ_msg is not blank,
  otherwise: returns a blank div.



*/
export function displayMessage(succ_msg, error_msg) 
{
    
    if(error_msg.length > 0)
    {
      return errorMessage(error_msg);
    }

    else if(succ_msg.length > 0)
    {
      return successMessage(succ_msg);

    }

    else
    {
      return noMessage();
    }
}

export function submitJSON(save_json, url, completeF)
 {

   
    $.ajax({
            type: "POST",
            url: url,
        
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(save_json),
            contentType: "application/json",
     
            
            complete: function(response)
            {
        

              console.log("Saved Response: " + JSON.stringify(response));
              
              // this is where we'll put the resolve code
              completeF(JSON.parse(response.responseText));

            }

        }); 
  }

/*
	Takes in a react input element, and wraps it 
	in the css Success tags of bootstrap.

*/
export function printSuccess(labelText, inputElement, msg = "")
{
	return( <div className="form-group has-success">	
  			<label className="control-label" htmlFor="inputSuccess">{labelText + " " + msg}</label>
  			{inputElement}
  	 </div>);

}

/*
	Takes in a react input element, and wraps it 
	in the css Success tags of bootstrap.

*/
export function printError(labelText, inputElement, msg = "")
{
	return( <div className="form-group has-error">	
  			<label className="control-label" htmlFor="inputError">{labelText + " " + msg}</label>
  			{inputElement}
  	 </div>);

}

/*
	Takes in a react input element, and wraps it 
	in a div with a label

*/
export function printNeutral(labelText, inputElement)
{
	return( <div >	
  			<label>{labelText}</label>
  			{inputElement}
  		 </div>);

}