import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'react-widgets/lib/scss/react-widgets.scss';
import ReactWidgets from 'react-widgets';
import Portal from 'react-portal';
import update from 'react-addons-update';
import Button from 'react-button';
import {Column, Cell} from "./Table.js";

var ComboBox = ReactWidgets.Combobox;

export const default_cell_width = 85;
export const number_cell_width = 120;



String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


      /*
        Applies rowItemToJSON to each item in rows,
          and send the stringified data in a POST request
          to the server specified with url

          Returns: a promise that resolves with the responseText parsed.

      */
export function sendToServer(rows, URL, rowItemToJSON)
{

  console.log("URL : " + URL + ", Rows: " + JSON.stringify(rows));

    var save_json = JSON.stringify(
     
         rows.map(
          function(rowitem)
          {

             console.log("Row Item ID: " + rowitem.id);

             return rowItemToJSON(rowitem);

         }));

        //console.log("Save JSON: " + save_json);


     return new Promise(function(resolve, reject)
      {
          $.ajax({
            type: "POST",
            url: URL,
        
            // The key needs to match your method's input parameter (case-sensitive).
            data: save_json,
            contentType: "application/json",
     
            success: function(data){ console.log("Success: " + data); },

            failure: function(errMsg) {
              console.log("Fail: " + errMsg);
            },

            complete: function(response)
            {
        
              console.log("Saved Response: " + JSON.stringify(response));
              // this is where we'll put the resolve code
              resolve(JSON.parse(response.responseText));

            }

        });

      });

 }

export function ProjectPicker(props)
{

   return (<ComboBox
              key = {2}
              textField = {(item) => typeof item === 'string' ? item : displayJobSelection(item)  }
              onSelect = {props.projectChange} 
              defaultValue = {props.project}
              data =  {props.projects}
              filter = {filterProjects}  />);
}

export function OnSiteButton(props)
{

  return <Button style = {{background: "#1269bf", color: "white"}} onClick = {props.onClick} >{props.text}</Button>;

}

export function OnSiteLinkButton(props)
{

  return <Button style = {{background: "#1269bf", color: "white"}} onClick = {(e) => window.location.href = props.link} >{props.text}</Button>;

}




export function dailyTicketRowToDeletedItem(deletedRow)
{

  return { id: deletedRow.id };

}

export function identity(struct)
{

  return struct;
}

/*

    Takes in a list of id's and returns a strcut for use
      in select option items

      null_message: is what we display with an id of 000
    
  
  */
 export function listToSelectStruct(list, lookup, null_message, lookup_map = function(lookup_item){return lookup_item; })
  {

    if(list.length == 0)
    {
        return [{ value: "000", display: null_message }];

    }
    else
    {

      return list.map(function(id){ return { value: id, display: lookup_map(lookup[id]) };  });
    }
    
  }


export function filterEmp(employee, search_value)
{

    if(search_value.length <= 2 && employee.initials.toLowerCase() == search_value.trim().toLowerCase())
    {
      return true;
    }
    else 
    {
      var search_names = search_value.split(" ");

      if(search_names.length == 1)
      {

        return employee.first_name.includes(search_names[0].trim());

      }
      else
      {

        return employee.first_name.includes(search_names[0].trim()) && employee.last_name.includes(search_names[1].trim());

      }

    }

  }

export function filterEquipment(equipment, search_value)
{


  return equipment.unit_number.includes(search_value) || equipment.name.includes(search_value);

}

export function taskFilter(task, search_value)
{


  return  task.name.includes(search_value);

}


/*

    Function that renders the cell.
    element_render - is the element displayed inside of the cell
      signature should be: (rowIndex, colIndex width, height) -> Component

      rowColour - function that takes in a rowIndex and returns a hexadecimal colour in a string format

  */
  export function renderCell(rowIndex,  width, height, colIndex, element_render, rowColour)
  {


    //console.log("CELL KEY : " + rowIndex.toString()+colIndex.toString());


    return <Cell 
             colIndex = {colIndex}
              key = {rowIndex.toString()+colIndex.toString()}
              width = {width}
              height = {height}
              style = {{backgroundColor: rowColour(rowIndex)}} >

                {element_render(rowIndex, width, height)}

              </ Cell>;

  }


/*
  colIndex - the index of the column we are readers
  val- a function that takes in the row index and returns the value
       to be displayed on that row.

  cellChanges - the callback that is called with arguments of: rowIndex, colIndex, and the current value of the component
    called when an onChange event is fired.

  rowColour - function that takes in a row Index and returns a colour

*/
export function createNumberColumn(colIndex, val, header, cellChange, rowColour, is_disabled = false)
{

  console.log("COLUMN KEY: " + (colIndex + header));

  return  (<Column
            key = {colIndex+header}
            header={header}
            cell={props => (
                    renderCell(props.rowIndex, props.width, props.height, colIndex,
                       
                      (rowIndex, width, height) =>  <input type = "number" min="0" max="1000"  disabled={is_disabled} key = {colIndex}  onChange={(e) => cellChange(rowIndex, colIndex, e.target.value)} value = {val(rowIndex)} />, rowColour) ) }
         
            width={number_cell_width} />);

}


/*

  Displays the output of val as a string.
*/
export function createSimpleTextColumn(colIndex, val, header, rowColour)
{


  return  (<Column
              key = {colIndex}
              header={header}
              cell={props => (
                renderCell(props.rowIndex, props.width, props.height,  colIndex,
                      (rowIndex, width, height) => val(rowIndex), rowColour) ) }
          
          width={500} />); 


}

/*
  Creates a column at colIndex that has the url of
  url(rowIndex) and a value that has val(rowIndex).

*/
export function createLinkColumn(colIndex, val, url, header, rowColour)
{

   return  (<Column

              header={header}
              cell={props => (
                renderCell(props.rowIndex, props.width, props.height,  colIndex,
                      (rowIndex, width, height) => <a key = {rowIndex.toString()+colIndex.toString()} href={url(rowIndex)} >{val(rowIndex)}</a>, rowColour) ) }
          
          width={500} />);   

}

export function createCheckBoxColumn(colIndex, val, header,  rowColour, is_disabled=false)
{


  return  (<Column
              key = {colIndex+header}
              header={header}
              cell={props => (
                renderCell(props.rowIndex, props.width, props.height,  colIndex,
                      (rowIndex, width, height) => <input type = "checkBox" disabled={is_disabled} key = {rowIndex.toString()+colIndex.toString()}  checked = {val(rowIndex)} />, rowColour) ) }
          
          width={500} />); 


}

export function createTextColumn(colIndex, val, header, cellChange, rowColour, is_disabled=false)
{


  return  (<Column
              key = {colIndex+header}
              header={header}
              cell={props => (
                renderCell(props.rowIndex, props.width, props.height,  colIndex,
                      (rowIndex, width, height) => <input type = "text" disabled={is_disabled} 
                                                                        key = {rowIndex.toString()+colIndex.toString()} 
                                                                        onChange={(e) => cellChange(props.rowIndex, colIndex, e.target.value)} 
                                                                        value = {val(rowIndex)} />, rowColour) ) }
          
          width={500} />); 


}



/*

    Returns the jsx element that represents a selection.
    rowIndex - is the 0-based index row that the item is on
    colIndex - is the 0-based column index that the item is on
    dropdown_items, is an array of structs of the form:
      {value: val, display: val}
      value - is the value of the selected item
      and display is the display text corresponding to the selected item

    sets onchange to be selectBoxChange(rowIndex, colIndex, e.target.value)


  */
  export function renderSelectionCell(rowIndex, colIndex, dropdown_items, selected_key, cellChange)
  {


    //console.log("****** SELECTION******** " + JSON.stringify(dropdown_items));
    

    var dropdown_array = dropdown_items.map(
          function(dropdown_item)
          {
             return <option key = {dropdown_item.display.hashCode()} value = {dropdown_item.value}>{dropdown_item.display}</option>;
          });

   
      return (<select key = {rowIndex.toString()+colIndex.toString()} value = {selected_key} onChange={(e) => cellChange(rowIndex, colIndex, e.target.value) } >
                 {dropdown_array}
                </select>);
   

  }

/*

  selectionList - is a function that takes in thw rowIndex and returns the list to display in the selection cell
    the list's items are of the form {value: val, display: val}

*/
export function createSelectionColumn(colIndex, val, header, rowColour, selectionList, cellChange)
{
  
console.log("Column Key: " + (colIndex + header));

  return (<Column
            key = {colIndex }
            header={header}
            cell={props => (
                    renderCell(props.rowIndex, props.width, props.height, colIndex,
                      (rowIndex, width, height) => renderSelectionCell(rowIndex, colIndex, selectionList(rowIndex), val(rowIndex), cellChange), rowColour)

            )}
            width={number_cell_width} />);

}


export class TableComboBox extends Component
{

  constructor(props)
  {

    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = {value: this.props.value}


  }

  componentWillReceiveProps(nextProps)
  {

    this.setState({

      value: nextProps.value
    });


  }

  handleChange(value)
  {

    this.setState({value: value});


  }

  render()
  {

    return   <ComboBox
                          key = {this.props.colIndex}
                          textField = {this.props.textField }
                          onSelect = {this.props.onSelect} 
                          onChange = {(value) => this.handleChange(value)}
                          value = {this.state.value}
                          style = {this.props.style}
                          data =  {this.props.data}
                          filter = {this.props.filter}  />;
  }

}


/*

  Determins if project_string, could be a summary 
  of the project given inside the first argument.


  project_string: should be a summary of project delimited by ';'.
*/
export function filterProjects(project, project_string)
{

  var project_string_parts = project_string.trim().split(";");

  var JOB_INDEX = 0;
  var NAME_INDEX = 1;
  var COMPANY_INDEX = 2;
  var LOCATION_INDEX = 3;
  var JOB_NUM_INDEX = 4;

  // boolean to track whether or not project_string might be project.
  // belongs: until proven it doesn't.
  var contains_old_job = false;
  var contains_name = false;
  var contains_company = false;
  var contains_location = false;
  var contains_job_num = false;



  if(project_string_parts.length == 1)
  {


    contains_old_job = project.old_job_num.includes(project_string_parts[0]);

    contains_name = project.name.includes(project_string_parts[0]);

    contains_company = project.customer_rep.company_name.includes(project_string_parts[0]);

    contains_location = project.location.includes(project_string_parts[0]);
 
    contains_job_num = project.job_num.includes(project_string_parts[0]);
 
  }

  if(project_string_parts.length >= 1)
  {
    contains_old_job = project.old_job_num.includes(project_string_parts[JOB_INDEX]);
  }

  if(project_string_parts.length >= 2)
  {
    contains_name = project.name.includes(project_string_parts[NAME_INDEX]);
  }

  if(project_string_parts.length >= 3 )
  {
    contains_company = project.customer_rep.company_name.includes(project_string_parts[COMPANY_INDEX]);
  }

  if(project_string_parts.length >= 3 )
  {
    contains_location = project.location.includes(project_string_parts[LOCATION_INDEX]);
  }

   if(project_string_parts.length >= 4)
  { 
    contains_job_num = project.job_num.includes(project_string_parts[JOB_NUM_INDEX]);
  }


    return contains_old_job || contains_name || contains_company || contains_location || contains_job_num;
  

}

/*
  Given a project:
    returns a one-line summary of information that is useful to
    the workers inside the shop.

  The object should be:
    The result of parsing the JSON that comes from ProjectSuite in SuiteComponents
*/
export function displayJobSelection(project)
{


  return project.old_job_num + "; " + project.name + "; " + project.customer_rep.company_name + "; " + project.location + "; " + project.job_num ;

}

/*
  colIndex - the index of the column from left to right - we're creating
    used in cellChange

  val - takes in a row index and returns the value to display in the cell
  header - the header title of this cell
  dataDisplay - takes in the type return in val and returns what to display upon a match
  top - takes in a row index and returns the top of this cell
  left - integer specifying the left property of the style
  cellChange - callback when an onChange event is fired
  selectionList - a list of selections.
  rowColour - function taking in the row index and determining the colur
  filter - the funciton for filtering the items in the combobox


*/
export function createComboBoxColumn(colIndex, val, header, dataDisplay, top, left, cellChange, selectionList, rowColour, filter)
{

  console.log("Key: " + (colIndex));

  return( <Column
            key = {colIndex}
            header = {header}
            cell={props => (
                renderCell(props.rowIndex, props.width, props.height,  colIndex,
                      (rowIndex, width, height) => 

                      
                      
                        <TableComboBox

                          key = {rowIndex.toString()+colIndex.toString()}
                          textField = {item => typeof item === 'string' ? item : dataDisplay(item) }
                          onSelect = {(value) => cellChange(rowIndex, colIndex, value)}
                          colIndex = {colIndex}
                          value = {val(rowIndex)}
                          data =  {selectionList(rowIndex)}
                          filter = {filter}  />

                        
                     ,

                     rowColour)
                )

          
          }
          width={250} />);


} 
