<?php

namespace App\SuiteComponents;
use App\SuiteComponents\MainSuiteClient;
use DataConnection\SuiteCORE\SuiteModelController;

abstract class SuiteTimeTicketModelController extends SuiteModelController
{


	public function __construct()
	{
		$this->client = new MainSuiteClient();

	}


}
