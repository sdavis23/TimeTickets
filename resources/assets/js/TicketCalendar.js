import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import  'react-widgets/dist/css/react-widgets.css';
import ReactWidgets from 'react-widgets';
import {createSimpleTextColumn, createLinkColumn, OnSiteLinkButton, OnSiteButton, ProjectPicker} from "./render_cell_utils.js";



var Calendar = ReactWidgets.Calendar;
var DateTimePicker = ReactWidgets.DateTimePicker;

var Moment = require('moment');
var momentLocalizer= require('react-widgets/lib/localizers/moment');
momentLocalizer(Moment);




export function ticketCalendar(DataView)
{

	return class extends Component
	{

		constructor(props)
		{
			super(props);

			this.dateChange = this.dateChange.bind(this);

			this.state = {

				modal_open: false,
				current_date: new Date()
			};	

			this.pdfPopup = this.pdfPopup.bind(this);
		}


		dateChange(newDate)
		{

			this.setState({current_date: newDate, modal_open: false});

		}

		pdfPopup()
		{
				this.setState({current_date: this.state.current_date, modal_open: true});
		}

		render()
		{
			console.log("Trying to Render: " + this.state.modal_open);

			var config_visibility = this.props.isAdmin ? "visible" : "hidden";

			return (<div >



						
						<div className="row">
							
							<div className="col-md-8 col-md-offset-2">
								<Calendar onCurrentDateChange = {this.dateChange} style = {{width:500}} defaultValue ={this.state.current_date} />
							</div>
							
						</div>
						
						<div className="row" style={{height: 10000}}>
							
							<div className="col-md-6 col-md-offset-3" >
								<span className="pull-right"><DataView rows = {this.props.initial_rows} date={this.state.current_date} final_view = {this.props.isAdmin}/></span>
							</div>
							
						</div>

						
					</div>);
		}


	};
	
}