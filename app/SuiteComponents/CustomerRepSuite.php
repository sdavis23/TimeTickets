<?php


namespace App\SuiteComponents;

use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\AccountSuite;
use App\SuiteComponents\SuiteTimeTicketModelController;




class  CustomerRep implements \JsonSerializable
{
	


	public $id;
	public $company_name;
	public $first_name;
	public $last_name;
	public $phone;
	public $email;
	public $company_id;
	public $mailing_address;


	public function __construct($id, $company_name, $company_id, $first_name, $last_name, $phone, $email, $mailing_address)
	{
		$this->id = $id;
		$this->company_name = $company_name;
		$this->first_name = $first_name;
		$this->last_name = $last_name;
		$this->phone = $phone;
		$this->email = $email;
		$this->company_id = $company_id;

		if(empty($mailing_address))
		{

			$this->mailing_address = "";
		}
		else
		{
			$this->mailing_address = $mailing_address;
		}
		
	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'company_id' => $this->company_id,
        	'company_name' => $this->company_name,
        	'first_name' => $this->first_name,
        	'last_name' => $this->last_name,
        	'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->mailing_address
        ];
    }

}

class CustomerRepSuite extends SuiteTimeTicketModelController
{


	protected function moduleName()
	{
		return 'Contacts';
	}


	public function getModelById($id)
	{
		if($id == 'NEW' || $id == 'NONE')
		{
			return array('id' => $id, 'company_id' => "", 'company_name' => "", 'first_name' => "", "last_name" => "", "phone" => "", "email" => "" );

		}
		else
		{

			return parent::getModelById($id);

		}

	}

	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{

		
		$contact = $this->getPrimaryValue($sugar_pointcloud);

		$account_controller = new AccountSuite();
		$account = $account_controller->getModelById($contact->account_id->value);
		
		

		

		//echo print_r($contact, true);


		return new CustomerRep($contact->id->value, 
										$account->name,
										$account->id,
										$contact->first_name->value,
										$contact->last_name->value,
										$contact->phone_work->value,
										$contact->email1->value,
										$contact->primary_address_street->value);

	}

	public function getByAccountAndEmail($id, $account_id, $email)
	{
		
		$reps = $this->index();
		
		return array_values(array_filter($reps, 
			function($rep) use ($account_id, $email, $id)
			{
				return ($rep->email == $email) && 
					   ($rep->company_id == $account_id) && !($rep->id == $id);

			}));


	}


	public function save($id, $first_name, $last_name, $phone, $email, $client_id, $address)
	{

		$record_vals = array(	
								"first_name" =>  $first_name,
								"last_name" => $last_name,
								"phone_work" => $phone,
								"primary_address_street" => $address,
								"account_id" => $client_id,
								"email1" => $email );

		
		if(strlen($client_id) == 0)
		{
			return $this->failureResponse("Client is required");
		}

		else if(count($this->getByAccountAndEmail($id, $client_id, $email)) > 0)
		{
			return $this->failureResponse("There is already the email address: " . $email . " for this client");
		}

		else if(strlen($first_name) == 0  || strlen($last_name) == 0)
		{
			return $this->failureResponse("You must enter a first and last name!");
		}

		else if(strlen($phone) == 0)
		{
			return $this->failureResponse("Phone Number is required");
		}

		else if(strlen($email) == 0)
		{
			return $this->failureResponse("Email is required");
		}

		else if(strlen($address) == 0)
		{
			return $this->failureResponse("Address is Required");
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
		}

		return $this->successResponse($result->id);
		
	}
	



	public function index()
	{
		return $this->getModelObjects( "", "", 70);
	}

	protected function getFields()
	{
		return array( 'id', 'first_name',  'last_name', 'email1', 'phone_work', 'account_id', 'primary_address_street');
	}


	


}