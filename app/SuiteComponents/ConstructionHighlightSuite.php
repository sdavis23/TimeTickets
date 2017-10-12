<?php 

namespace App\SuiteComponents;
use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\DataHighlight;
use App\SuiteComponents\DataHighlightSuite;
use App\SuiteComponents\SuiteTimeTicketModelController;
use App\SuiteComponents\ProjectSuite;

class ConstructionHighlight extends DataHighlight
{

	public function getValue($data_object)
	{

		$project_suite = new ProjectSuite();

		return $data_object->budget - $project_suite->totalCost($data_object->id);
	}	

}

class ConstructionHighlightSuite extends DataHighlightSuite
{

	protected function tableName()
	{

		return "rprt_ConstructionHighlight";

	}

	protected function dataHighlightConstructor($id, $colour, $max, $min)
	{
		return new ConstructionHighlight($id, $colour, $max, $min);
	}
}