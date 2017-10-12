<?php

namespace App\SuiteComponents;
use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\SuiteTimeTicketModelController;

class Task implements \JsonSerializable
{
	public $id;
	public $name;
	public $estimated_time;
	public $description;

	public function __construct($id, $name, $estimated_time, $description)
	{

		$this->id = $id;
		$this->name = $name;
		$this->estimated_time = $estimated_time;
		$this->description = $description;

	}

	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'name' => $this->name,
            'description' => $this->description,
            'estimated_time' => $this->estimated_time ];
    }




}



class TaskSuite extends SuiteTimeTicketModelController
{

	protected function moduleName()
	{
		return 'drft_Task';
	}


	protected function sugarObjectToModelObject( $data_object )
	{

		
		$task = $this->getPrimaryValue($data_object);
		
		

		return new Task(	$task->id->value,
							$task->name->value,
							$task->estimated_time->value,
							$task->description->value );

	}

	public function getModelById($id)
	{
		if($id == 'NEW')
		{
			return array('id' => "NEW", 'name' => "",  'estimated_time'=> '', "" => '', 'description' => '' );

		}
		else
		{

			return parent::getModelById($id);

		}

	}


	public function save($id, $name, $estimated_time, $description)
	{

		$record_vals = array( "name" => $name, "estimated_time" => $estimated_time, "description" => $description );

		if(count($this->getModelObjects("drft_task.name = '". $name . "' AND drft_task.id !='" . $id ."'", "", 1)) > 0)
		{

			return $this->failureResponse("There is already a project with the name " . $name );

		}

		else if( strlen($estimated_time) == 0 )
		{

			return $this->failureResponse("You must enter estimated time");
		}

		else
		{

			if($id == "NEW")
			{
				$result = $this->client->saveNewRecord($this->moduleName(), $record_vals);
			
				//return $client->setRelationship($this->moduleName(), $result->id, $employee_id, 'ttick_labour_lineitems_ttick_employee');
			}

			else
			{
				$result = $this->client->saveExistingRecord($this->moduleName(), $id, $record_vals);
			}

			return $this->successResponse($result->id);

		}
		 


		
	}



	public function index()
	{
		return $this->getModelObjects("", "", 70);
	}



	protected function getFields()
	{
		return array( 'id', 'name', 'estimated_time', 'description');
	}


}