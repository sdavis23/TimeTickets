<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\SuiteComponents\DailyWorkTicketSuite;

class DailyWorkTicketController extends Controller
{
    //
    
	public function show($workticket_id)
	{

		$suite = new DailyWorkTicketSuite();

		return array($suite->getModelByID($workticket_id));

	}

	public function index()
	{

		$suite = new DailyWorkTicketSuite();

		return $suite->get_list();
	}

}
