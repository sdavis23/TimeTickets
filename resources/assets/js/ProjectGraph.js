import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts"


export default class ProjectGraph extends Component
{

	constructor(props)
	{
		super(props);
	}

	render()
	{

		const graphs = this.props.graph_data.filter((data) => data.percentage_done != 1).map(

													function(data){  	var done_percent = data.percentage_done*(100.0);


																		 return {name: data.project_name, Complete: data.percentage_done*(100.0), Left: 100.0-done_percent};
															 });

		console.log("Graph Data: " + JSON.stringify(graphs));

		return ( <div className = "col-sm-5">
				
					<BarChart width={600} height={300} data={graphs}
            				margin={{top: 20, right: 30, left: 20, bottom: 5}}>
       				<XAxis dataKey="name"/>
      				 <YAxis/>
       				<CartesianGrid strokeDasharray="3 3"/>
       				<Tooltip/>
       					<Legend />
       					<Bar dataKey="Complete" stackId="a" fill="#5cce2f" />
       					<Bar dataKey="Left" stackId="a" fill="#e24e18" />
      				</BarChart>
    				
				 </div>);


	}

}