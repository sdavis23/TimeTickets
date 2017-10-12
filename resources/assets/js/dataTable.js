
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import {OnSiteButton} from './render_cell_utils.js';


export function createDataTable(TableToDisplay,  defaultRow, stateChangeFunction, dataRowToDisplayRow, onCellChange)
{


  return class extends Component
  {

    constructor(props)
    {

      super(props);

      console.log("createDataTable Props: " + JSON.stringify(props));


      this.cellChange = this.cellChange.bind(this);
      this.addRow = this.addRow.bind(this);
      this.rowClick = this.rowClick.bind(this);
      this.deleteRow = this.deleteRow.bind(this);
      this.displayButtons = this.displayButtons.bind(this);
    

      this.state = {selected_rows: [], rows: this.props.rows, deleted_rows: []};

      //this.setStateAfterSave = this.setStateAfterSave.bind(this);

     

    }

    componentWillReceiveProps(nextProps)
    {

      console.log("Next Deleted: " + JSON.stringify(nextProps));

      this.setState({
          selected_rows: this.state.selected_rows,
          rows: nextProps.rows,
          deleted_rows: this.state.deleted_rows

      });
    }



    rowClick(index)
    {

      var selected_index = this.state.selected_rows.indexOf(index);
      console.log("Index Selected: " + index);

      if(selected_index == -1)
      {


        //this.props.OnRowSelected(this.props.selected_rows.concat(index));
        this.setState({  selected_rows: this.state.selected_rows.concat(index), rows: this.state.rows, deleted_rows: this.state.deleted_rows } );

      }
      else
      {

        var new_rows = update(this.state.selected_rows, {$splice: [[selected_index, 1]]})

       

        //var reduced_selection = this.state.selected_rows.splice(selected_index, 1);
        
       //console.log("Reduced Selection: " + JSON.stringify(reduced_selection));
       //console.log("Splieced Selection: " + JSON.stringify(reduced_selection);

        this.setState({ selected_rows: new_rows, rows: this.state.rows, deleted_rows: this.state.deleted_rows });

      }

    }

     addRow()
     {

      var new_rows = this.props.rows.slice().concat(defaultRow());

      
       //this.setState({selected_rows: this.state.selected_rows, rows: new_rows, deleted_rows: this.state.deleted_rows});

        this.props.onRowAdd(new_rows);

      }

      


    deleteRow()
    {


      var i;
      var sorted_selections = 
        this.state.selected_rows.slice().sort(
          function(a, b) 
          {
            return a - b;
          });


      var new_rows = this.state.rows.slice();
      var removed_rows = [];

      for(i = 0; i < sorted_selections.length; i++)
      {

        var indexToRemove = sorted_selections[i] - i;

       

        removed_rows.push(new_rows[indexToRemove]);



        new_rows.splice(indexToRemove, 1);
       

      }

      var del  = this.state.deleted_rows.slice().concat(removed_rows);

      console.log("Deleted: " + JSON.stringify(del));


      this.setState({
          selected_rows: this.state.selected_rows,
          rows: this.state.rows,
          deleted_rows: del

      });

      //this.setState({selected_rows: this.state.selected_rows, rows: this.state.rows, deleted_rows: new_rows});
      this.props.onRowDelete(new_rows, del);

    }



    cellChange(row_index, col_index, new_val)
    {


      //console.log("CELL CHANGE!!!!!");

      var old_rows = this.props.rows.slice();
      var before_change = old_rows[row_index];
     
      old_rows[row_index] = stateChangeFunction(row_index, col_index, old_rows[row_index], new_val);
      


      if(old_rows[row_index] != null)
      {

        

        onCellChange(old_rows, col_index, row_index);

      }
      else
      {
        old_rows[row_index] = before_change;
      } 

      //this.setState({rows: old_rows, deletedRows: this.state.deletedRows, selected_rows: this.state.selected_rows, save_clicked: false });

    }

    displayButtons()
    {
      var button_array = []

      if(this.props.onRowAdd != undefined)
      {
        button_array.push( <OnSiteButton onClick=  {(e) => this.addRow()} text = "Add Row" />);
      }

      if(this.props.onRowDelete != undefined)
      {
        button_array.push(<OnSiteButton onClick = {(e) => this.deleteRow()} text = "Delete Row" />);
      }

      return button_array;

    }

    render()
    {

      console.log("DATA TABLE RENDER: " + JSON.stringify(this.cellChange));


        return (
                <div style = {{top: this.props.top, left: this.props.left, position: 'absolute' }}>
                  <TableToDisplay

                                rows = {this.state.rows.map(function(row){ return dataRowToDisplayRow(row); })} 
                                onRowClick = {this.rowClick}
                                onCellChange = {this.cellChange.bind(this)}
                                top = {this.props.top}
                                left = {this.props.left}

                                highlightedRows = {this.state.selected_rows} /> 

                  {this.displayButtons()}
                 
                  
                  
                </div>);

    }


  };


}




