import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export  class Table extends Component
{

	constructor(props)
	{

		super(props);

		this.state = {rowCount: props.rowsCount};

		this.rowClick = this.rowClick.bind(this);

	}

	componentWillReceiveProps(newProps)
	{

		this.setState({rowCount: newProps.rowsCount})
	}

	rowClick(index)
	{

		if(this.props.onRowClick != 'undefined')
		{
			console.log("Calling Row Click!")
			this.props.onRowClick(index);
		}
		else
		{
			console.log("Row Click undefined");
		}
	}


	render()
	{
		const children = React.Children.toArray(this.props.children);

		const non_null_children = children.filter(
										(child, i) => {
											return child != null;
										});

		const headers = non_null_children.map((child, i) => {
          // Ignore the first child
          

          	return (<HeaderCell>{child.props.header}</HeaderCell>);
      });


		
		

		var row_index = 0;
		var rows = [];

		var child_index;
		var columns = [];

		console.log("Row Count: " + this.state.rowCount);

		console.log("Row Index: " + row_index);

		for(row_index = 0; row_index < this.state.rowCount; row_index++)
		{


			console.log("Going into Loop!");
			var columns = non_null_children.map( (child, i) => {
		
				var props = {

					rowIndex: row_index,
					colIndex: i,
					width: 50,
					height: 50

				};



				return child.props.cell(props);
				//columns.push((< children[i].cell rowIndex = {1} width={50} height={50} colIndex = {child_index} />));
			});

			let ri = row_index;


			rows.push(<tr onClick={() => this.rowClick(ri)} key ={ri} >{columns}</tr>);
		}

		console.log("Rows Size: " + rows.length);

		return(
		

			<table className="table table-bordered">
				<thead key = {0}>
					<tr>
						{headers}
					</tr>
				</thead>

				<tbody key = {1}>

					{rows}

				</tbody>

			</table>

		
		);

	}


}

export class HeaderCell extends Component
{


	constructor(props)
	{
		super(props);
	}

	render()
	{

		return (<th>{this.props.children}</th>);


	}

}

export class Cell extends Component
{


	constructor(props)
	{
		super(props);

		this.state = {style: this.props.style};
	}

	componentWillReceiveProps(nextProps)
	{
		this.setState({style: nextProps.style});
	}

	render()
	{

		console.log("Style: " + JSON.stringify(this.state.style));

		if(this.state.style == 'undefined')
		{
			return (<td key = {this.props.colIndex}>{this.props.children}</td>);
		}

		else
		{
			return (<td key={this.props.colIndex} style = {this.state.style} >{this.props.children}</td>);
		}
		


	}

}

export class Column extends Component
{


	constructor(props)
	{
		super(props);

		this.getHeader = this.getHeader.bind(this);
	}

	getHeader()
	{
		return this.props.header;
	}

	render()
	{

		return(
				<div>
					Hello
				</div>

			);


	}

}