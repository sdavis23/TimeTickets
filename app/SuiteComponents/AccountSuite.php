<?php


namespace App\SuiteComponents;

use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\SuiteTimeTicketModelController;




class  Account implements \JsonSerializable
{
	

	public $name;
	public $id;
	public $short_name;
	public $website;
	

	public function __construct($id, $name, $short_name, $website)
	{
		$this->id= $id;
		$this->name = $name;
		$this->short_name=$short_name;
		$this->website=$website;
	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'name' => $this->name,
        	'short_name' => $this->short_name,
        	'website' => $this->website
        ];
    }

}

class AccountSuite extends SuiteTimeTicketModelController
{


	protected function moduleName()
	{
		return 'Accounts';
	}


	public function getModelById($id)
	{
		if($id == 'NEW' || $id == 'NONE')
		{
			return array('id' => $id, 'short_name' => "", 'long_name' => "", 'website' => "");

		}
		else
		{

			return parent::getModelById($id);

		}

	}

	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{

		
		$account = $this->getPrimaryValue($sugar_pointcloud);
		
		

		return new Account(	$account->id->value,
							$account->abbrev_c->value,
							$account->name->value,
							$account->website->value);

	}


	public function save($id, $long_name, $short_name, $website)
	{

		$record_vals = array(	
								"abbrev_c" =>  $long_name,
								"name" => $short_name,
								"website" => $website,
								);

		
		if(strlen($long_name) == 0)
		{
			return $this->failureResponse("Long name is required");
		}

		else if($this->getModelObjects("abbrev_c = '" . $long_name . "' AND accounts.id !='" . $id . "'", "", 70))
		{
			return $this->failureResponse("There already exists a client with that name!");
		}

		else if(strlen($short_name) == 0 )
		{
			return $this->failureResponse("Short Name is required");
		}

		

		else
		{
			if($id == "NEW")
			{
			
				$result = $this->client->saveNewRecord($this->moduleName(), $record_vals);
			}

			else
			{
				$result = $this->client->saveExistingRecord($this->moduleName(), $id, $record_vals);
			}
		}

		return $this->successResponse($result->id);

	}


	protected function getFields()
	{
		return array( 'id',  'abbrev_c', 'name', 'website');
	}


	public function index()
	{
		return $this->getModelObjects( "", "", 70);
	}

	


}