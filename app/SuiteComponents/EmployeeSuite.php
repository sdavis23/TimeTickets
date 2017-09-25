<?php


namespace App\SuiteComponents;
use App\SuiteComponents\MainSuiteClient;
use Illuminate\Contracts\Auth\Authenticatable; 
use App\SuiteComponentsSuiteTimeTicketModelController;


class Employee implements \JsonSerializable, Authenticatable
{

	public $first_name;
	public $last_name;
	public $initials;
	public $id;
	public $occupation_ids;
	public $email;
	public $is_admin;

	private $remember_token_c;
	private $gprofile_token;

	public function __construct($id, $firstName, $lastName, $id_token, $is_admin, $email, $occupation_ids, $initials)
	{

		$this->id = $id;
		$this->first_name = $firstName;
		$this->last_name = $lastName;
		$this->occupation_ids = $occupation_ids;
		$this->initials = $initials;
		$this->gprofile_token = $id_token;
		$this->email = $email;
		$this->is_admin = $is_admin;

	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'occ_list' => $this->occupation_ids,
            'email' => $this->email,
            'initials' => $this->initials
        ];
    }


    public function getAuthIdentifierName()
    {
    	return 'id';
    }

    public function getAuthIdentifier()
    {
    	return $this->id;
    }

    public function getAuthPassword()
    {

    	return $this->gprofile_token;
    }

    public function getRememberToken()
    {

    	return $this->gprofile_token;

    }

    public function setRememberToken($value)
    {

    	$suite = new EmployeeSuite();
    	$suite->saveRememberToken($value, $this->id);


    }

    public function getRememberTokenName()
    {

    	return "remember_token_c";
    }


}

class EmployeeSuite extends SuiteTimeTicketModelController
{

	protected function moduleName()
	{
		return 'ttick_Employee';
	}

	protected function sugarToModelId($sugar_obj)
	{
		return $sugar_obj->id->value;
	}

	

	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{

		
		$employee = $this->getPrimaryValue($sugar_pointcloud);
		$occ_ids = array_map([$this, "sugarToModelId"], $this->getAllLinkedValues($sugar_pointcloud, 0));
		
		return new Employee($employee->id->value,
							$employee->first_name->value, 
							$employee->last_name->value, 
							$employee->remember_token_c->value,
							$employee->is_admin_c->value,
							$employee->email_c->value,
							$occ_ids,
							$employee->initials->value);

	}

	

	public function saveRememberToken($token, $id)
	{

		$record_vals = array(	
								"remember_token_c" => $token );

		


		$result = $this->client->saveExistingRecord($this->moduleName(), $id, $record_vals);
		

		

	}

	public function getModelById($id)
	{
		if($id == 'NEW')
		{
			return array('id' => $id, 'first_name' => "", 'last_name' => "", 'occ_list' => [], "initials" => '', "email" => "" );

		}
		else
		{

			return parent::getModelById($id);

		}

	}

	public function getByEmailAddress($email)
	{

		$all_employees = $this->get_employee_list();

		return array_values(array_filter($all_employees, 
			function($employee) use ($email)
			{

				return $employee->email == $email;

			}));

	}

	/*

		Tries to save the employee: returning 
			{status: SUCC/FAIL, msg: }

		MSG - is only the id on a success
		FAIL - is the message to print to the user
	*/
	public function save($id, $first_name, $last_name, $initials, $is_Admin, $email, $occ_ids)
	{

		$record_vals = array(	
								"first_name" =>  $first_name,
								"last_name" => $last_name,
								"is_admin_c" => $is_Admin,
								"initials" => $initials,
								"email1" => $email );

		$same_email = $this->getByEmailAddress($email);


		if(strlen($initials) == 0)
		{
			return array("status" => "FAIL", "msg" => "Need to enter initials!");
		}

		else if(count($occ_ids) == 0)
		{
			return array("status" => "FAIL", "msg" => "Need at least one occupation!");
		}

		else if(count($this->getModelObjects("initials = '" . $initials ."' AND ttick_employee.id !='" . $id . "'", "", 1)) > 0)
		{
			return array("status" => "FAIL", "msg" => "Error: There is another employee with the initials: " . $initials);
		}

		else if(strlen($email) > 0 && (count($same_email) > 0) && $same_email[0]->id != $id)
		{
			return array("status" => "FAIL", "msg" => "Error: There is another employee with the  email: " . $email);
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


			for($i = 0; $i < count($occ_ids); $i++)
			{

				$this->client->setRelationship($this->moduleName(),  $result->id, $occ_ids[$i], "ttick_employee_ttick_occupations");

			}


			return array("status" => "SUCC", "msg" => $result->id);
		}
		

	}

	protected function getFields()
	{
		return array( 'id', 'first_name', 'last_name', 'initials', 'email_c', 'remember_token_c', 'gprofile_id_c', 'is_admin_c');
	}


	/*

		Returns a json encoded list of the employees

		ORDER: the first record is the supervisor all others are ordered alphabetically

	*/
	public function get_employee_list()
	{

		return $this->getModelObjects( "", "last_name", 70);
	}


	protected function getLinkedFields()
	{

		return array( array('name' => 'ttick_employee_ttick_occupations',
							'value' => array('id')
						)
					);

	}


}
