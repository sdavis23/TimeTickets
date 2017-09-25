<?php


namespace App\SuiteComponents;

use App\SuiteComponents\MainSuiteClient;



class EquipmentLineItem implements \JsonSerializable
{
	

	public $hours;
	public $equip_id;
	public $id;
	public $description;


	public function __construct($id, $hours, $equip_id, $description)
	{
		$this->id = $id;
		$this->hours = $hours;
		$this->equip_id = $equip_id;
		
		$this->description = $description;
	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'hours' => $this->hours,
            'equip_id' => $this->equip_id,
            'description' => $this->description
        ];
    }

}

class EquipmentLineItemSuite extends SuiteTimeTicketModelController
{


	protected function moduleName()
	{
		return 'ttick_Equipment_LineItems';
	}


	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{

		//echo "PCLD: " . print_r($sugar_pointcloud, true);
		
		$line_item = $this->getPrimaryValue($sugar_pointcloud);
		$equip = $this->getFirstLinkedValue($sugar_pointcloud, 0);
		
		

		return new EquipmentLineItem(	$line_item->id->value,
										$line_item->hours->value,
										$equip->id->value,
										$line_item->description->value);

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
									$assoc_array['equip_id'], 
									$assoc_array['hours'],
									$assoc_array['description']);

	}

	protected function deleteLineItem_assoc_array($assoc_array)
	{

		//return $assoc_array['id'];
		return $this->deleteLineItem($assoc_array['id']);

	}

	protected function deleteLineItem($id)
	{

		

		return $this->client->deleteExistingRecord($this->moduleName(), $id);
	}

	/**
	*
	* @param ticket_id - the id of the daily work ticket.
	* @param id - the id of the line item
	* 	an id of NEW means that it is a new record.
	*
	* @return - a boolean based on the success of the save
	**/

	protected function saveLineItem($ticket_id, $id, $equip_id, $hours, $description)
	{

		$record_vals = array(	
								"hours" => $hours, 
								"description" => $description );

		


		if($id == "NEW")
		{

			$result = $this->client->saveNewRecord($this->moduleName(), $record_vals);
			$this->client->setRelationship("ttick_DailyWorkTickets",  $ticket_id, $result->id, "ttick_equipment_lineitems_ttick_dailyworktickets");
			
		}

		else
		{
			$result = $this->client->saveExistingRecord($this->moduleName(), $id, $record_vals);
			
		}

		
		$this->client->setRelationship($this->moduleName(), $result->id, $equip_id, "ttick_equipment_lineitems_ttick_equipment_1");
		
		
		return $result->id;
	}

	protected function getFields()
	{
		return array( 'id',  'hours', 'description');
	}


	public function get_listByDailyWorkTicketID($workticket_id)
	{

		//$query = "id IN (SELECT ttick_labo48ecneitems_idb FROM  ttick_labour_lineitems_ttick_dailyworktickets_c" .
		//			" WHERE  ttick_labof82etickets_ida  = '". $workticket_id. "' )";

	
		return $this->getRelatedModelObjects( "ttick_DailyWorkTickets", $workticket_id, "ttick_equipment_lineitems_ttick_dailyworktickets",  "", "", 70);

	}


	public function getLinkedFields()
	{


		return array( 
				array( 'name' => 'ttick_equipment_lineitems_ttick_equipment_1',
					   'value' => array('id') ) 
			);

	}


}