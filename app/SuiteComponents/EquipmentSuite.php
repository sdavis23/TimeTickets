<?php

namespace App\SuiteComponents;
use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\SuiteTimeTicketModelController;



class Equipment implements \JsonSerializable
{
	

	public $id;
	public $name;
	public $unit_number;
	public $description;
	public $rate;


	public function __construct($id, $name, $unit_number, $description, $rate)
	{
		$this->id = $id;
		$this->name = $name;
		$this->unit_number = $unit_number;
		$this->description = $description;
		$this->rate = $rate;

	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'name' => $this->name,
            'unit_number' => $this->unit_number,
            'description' => $this->description,
            'rate' => $this->rate
        ];
    }

}

class EquipmentSuite extends SuiteTimeTicketModelController
{


	protected function moduleName()
	{
		return 'ttick_Equipment';
	}

	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{

		
		$equip = $this->getPrimaryValue($sugar_pointcloud);
		//echo print_r($equip, true);

		return new Equipment(	$equip->id->value,
								$equip->name->value,
								$equip->unit_num->value,
								$equip->description->value, 
								$equip->rate->value);

	}

	protected function getFields()
	{
		return array( 'id', 'unit_num', 'name', 'description', 'rate');
	}


	public function get_equipment_list()
	{

		return $this->getModelObjects( "", "", 70);
	}



}