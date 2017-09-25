import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Tile} from 'react-tile';

export function TestTile(props)
{

	return (

		 <div style = {{width: 250, height: 250, backgroundRepeat: "no-repeat"}} >
            <Tile backgroundImage="url(/images/CompanyLogo.PNG)" backgroundSize = "175px 175px"  color = "black" bar="subtext"  >Main content</Tile>
          </div>

		);


}