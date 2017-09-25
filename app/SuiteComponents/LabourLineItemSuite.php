<?php


namespace App\SuiteComponents;

use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\LabourLineItemSuite;
use App\SuiteComponents\EmployeeSuite;
use App\SuiteComponents\OccupationSuite;
use App\SuiteComponents\SuiteTimeTicketModelController;


/*
	returns 0 if $val is a null string otherwise returns $val

*/
function null_val_zero($val)
{

	return $val == "" ? 0 : $val;

}

class LabourLineItem implements \JsonSerializable
{
	

	public $id;
	public $emp_id;
	public $occ_id;
	public $reg;
	public $overtime;
	public $traveltime;
	public $description;
	public $workticket_id;
	public $date_entered;


	public function __construct($id, $emp_id, $occ_id, $reg, $overtime, $traveltime, $description, $workticket_id, $date_entered)
	{
		$this->id = $id;
		$this->emp_id = $emp_id;
		$this->occ_id = $occ_id;
		$this->reg  = $reg;
		$this->overtime = $overtime;
		$this->traveltime = $traveltime;
		$this->description = $description;
		$this->workticket_id = $workticket_id;

		$this->date_entered = $date_entered;
	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'emp_id' => $this->emp_id,
            'occ_id' => $this->occ_id,
            'reg' => $this->reg,
            'overtime' => $this->overtime,
            'traveltime' => $this->traveltime,
            'description' => $this->description,
            'date_entered' => $this->date_entered
        ];
    }

}

class LabourLineItemSuite extends SuiteTimeTicketModelController
{


	protected function moduleName()
	{
		return 'ttick_Labour_LineItems';
	}

	


	/**
	*	
	*	saves an array of line items where each element is in the same form
	*	as the json-serializations for a line item model
	*
	*	@param item_array: is an array of line items.
	*  	@return an array of booleans - where each boolean corresponds to whether
	* 			or not an item saved correctly
	*/
	public function saveLineItems($item_array)
	{

		//return print_r($item_array[0], true);
		return array_map([$this, "saveLineItem_assoc_array"], $item_array);

	}

	public function deleteLineItems($item_array)
	{
		//return "Deleting Items: " . print_r($item_array, true);
		return array_map([$this, "deleteLineItem_assoc_array"], $item_array);
	}
	/**
	*
	* @param assoc_array: is an associative array where the keys correspond to the keys
	* 	in the JSON serialization of the LabourLineItemmodels
	* @return a boolean based on the success of the ave
	*/

	protected function saveLineItem_assoc_array($assoc_array)
	{

		return $this->saveLineItem(	$assoc_array['dailyworkticket_id'], 
									$assoc_array['id'],  
									$assoc_array['emp_id'], 
									$assoc_array['occ_id'],
									$assoc_array['reg'], 
									$assoc_array['ot'], 
									$assoc_array['tt'], 
									$assoc_array['description']);

	}

	protected function deleteLineItem_assoc_array($assoc_array)
	{

		//return $assoc_array['id'];
		return $this->deleteLineItem($assoc_array['id']);

	}

	protected function deleteLineItem($id)
	{

		$client = new MainSuiteClient();

		return $client->deleteExistingRecord($this->moduleName(), $id);
	}

	/**
	*
	* @param ticket_id - the id of the daily work ticket.
	* @param id - the id of the line item
	* 	an id of NEW means that it is a new record.
	*
	* @return - a boolean based on the success of the save
	**/

	protected function saveLineItem($ticket_id, $id, $employee_id, $occ_id, $reg, $overtime, $traveltime, $description)
	{

		$record_vals = array(	
								"reg" => $reg, 
								"overtime" => $overtime,
								"travel_time" => $traveltime,
								"description" => $description );

		$client = new MainSuiteClient();


		if($id == "NEW")
		{

			$result = $client->saveNewRecord($this->moduleName(), $record_vals);
			$client->setRelationship("ttick_DailyWorkTickets",  $ticket_id, $result->id, "ttick_labour_lineitems_ttick_dailyworktickets");
			//return $client->setRelationship($this->moduleName(), $result->id, $employee_id, 'ttick_labour_lineitems_ttick_employee');
		}

		else
		{
			$result = $client->saveExistingRecord($this->moduleName(), $id, $record_vals);
			
		}

		$client->setRelationship($this->moduleName(), $result->id, $occ_id, "ttick_labour_lineitems_ttick_occupations");
		$client->setRelationship($this->moduleName(), $result->id, $employee_id, 'ttick_labour_lineitems_ttick_employee');
		//echo print_r("ID: " . $id, true);
		//cho print_r($record_vals, true);
		
		return $result->id;
	}

	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{

		//echo "Sugar Object: " . print_r($sugar_pointcloud, true);
		
		$line_item = $this->getPrimaryValue($sugar_pointcloud);
		$emp = $this->getFirstLinkedValue($sugar_pointcloud, 0);
		$occ = $this->getFirstLinkedValue($sugar_pointcloud, 1);
		$workticket = $this->getFirstLinkedValue($sugar_pointcloud, 2);

		

		return new LabourLineItem(	$line_item->id->value,
									$emp->id->value,
									$occ->id->value,
									null_val_zero($line_item->reg->value),
									null_val_zero($line_item->overtime->value), 
									null_val_zero($line_item->travel_time->value),
									$line_item->description->value,
									$workticket->id->value,
									$line_item->date_entered->value);

	}

	protected function getFields()
	{
		return array( 'id',  'reg', 'overtime', 'travel_time', 'description', 'date_entered');
	}

	public function employee_lastname_compare($line_a, $line_b)
	{

		
		$emp_suite = new EmployeeSuite();

		$emp_a = $emp_suite->getModelById($line_a->emp_id);
		$emp_b = $emp_suite->getModelById($line_b->emp_id);

		return strcmp($emp_a->last_name, $emp_b->last_name);
		

	}

	/*

		Brings the first labour_line with an occupation marked as is_supervisor,
			to the front of the array.

	*/
	public function supervisor_to_front($labour_lines)
	{

		$occ_suite = new OccupationSuite();


		$supervisor_index = -1;

		$array_index = 0;

		while($supervisor_index == -1 && $array_index < count($labour_lines))
		{

			$line_item = $labour_lines[$array_index];

			if($occ_suite->getModelById($labour_lines[$array_index]->occ_id)->is_supervisor)
			{
				$supervisor_index = $array_index;
			}
			else
			{
				$array_index++;
			}

		}

		//echo "Supervisor Index: " . $supervisor_index;

		if($supervisor_index == -1)
		{
			$supervisor_index = 0;
		}

		$front_of_array = array_splice($labour_lines, $supervisor_index, 1);


		return array_merge($front_of_array, $labour_lines);
	}


	public function get_listByDailyWorkTicketID($workticket_id)
	{

		//$query = "id IN (SELECT ttick_labo48ecneitems_idb FROM  ttick_labour_lineitems_ttick_dailyworktickets_c" .
		//			" WHERE  ttick_labof82etickets_ida  = '". $workticket_id. "' )";

		$all_lines = $this->getRelatedModelObjects( "ttick_DailyWorkTickets", $workticket_id, "ttick_labour_lineitems_ttick_dailyworktickets",  "", "", 70);
		usort($all_lines, [$this, "employee_lastname_compare"]);


		return $this->supervisor_to_front($all_lines);

	}


	public function getLinkedFields()
	{


		return array( 

			

				array( 'name' => 'ttick_labour_lineitems_ttick_employee',
					   'value' => array('id') ),

				array('name' => "ttick_labour_lineitems_ttick_occupations",
						'value' => array('id') ),
				
					array( 	'name' => 'ttick_labour_lineitems_ttick_dailyworktickets',
							'value' => array('id')
					)

			);

	}


}