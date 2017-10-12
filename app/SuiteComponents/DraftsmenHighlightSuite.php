<?php 

namespace App\SuiteComponents;
use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\DataHighlight;
use App\SuiteComponents\DataHighlightSuite;
use App\SuiteComponents\SuiteTimeTicketModelController;

class DraftDataHighlight extends DataHighlight
{

	public function getValue($data_object)
	{
		return $data_object->actual_time - $data_object->estimated_time;
	}	

}

class DraftsmenHighlightSuite extends DataHighlightSuite
{

	protected function tableName()
	{

		return "drft_DraftHighlight";

	}

	protected function dataHighlightConstructor($id, $colour, $max, $min)
	{
		return new DraftDataHighlight($id, $colour, $max, $min);
	}
}