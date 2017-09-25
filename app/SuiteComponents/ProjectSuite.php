<?php

namespace App\SuiteComponents;
use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\CustomerRepSuite;
use App\SuiteComponents\SuiteTimeTicketModelController;


class Project implements \JsonSerializable
{
	

	public $id;
	public $job_num;
	public $date;
	public $customer_rep;
	public $location;
	public $old_job_num;
	public $name;



	public function __construct($id, $job_num, $date, $location, $customer_rep, $name, $old_job_num)
	{
		$this->id = $id;
		$this->job_num = $job_num;
		$this->date = $date;

		$this->customer_rep = $customer_rep;
		
		$this->location = $location;
		$this->old_job_num = $old_job_num;
		$this->name = $name;

	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'job_num' => $this->job_num,
            'date' => $this->date,
            'customer_rep' => $this->customer_rep,
            'location' => $this->location,
            'old_job_num' => $this->old_job_num,
            'name' => $this->name
        ];
    }

    private function splitJobNum()
    {
    	return explode("-", $this->old_job_num);
    }

    /*
		Tests to see if the jobnumber is of the form 17-##
    */
    public function isJobNumberStdFormat()
    {
    	$job_number_split = $this->splitJobNum();

    	return (	   (count($job_number_split) == 2)
						
						&& (is_numeric($job_number_split[1]) ) );

    }


    /*
		Breaks a job number of the form "17-##"
		into it's respective components.

		If the jobnumber cannot be broken in such a way returns 
		an empty array.
    */
   	public function jobNumberTuple()
	{
		$split = $this->splitJobNum();


		return array("year" => $split[0], "number" => $split[1]);
	}

}



class ProjectSuite extends SuiteTimeTicketModelController
{


	protected function moduleName()
	{
		return 'ttick_Projects';
	}

	public function getModelById($id)
	{
		if($id == 'NEW')
		{
			return array('id' => "NEW", 'job_num' => "", 'date' => date_create()->format('Y-m-d'), 'location'=>'', "customer_rep" => '', 'old_job_num' =>  date('y') . "-" . ($this->getGreatestJobNumber() + 1) );

		}
		else
		{

			return parent::getModelById($id);

		}

	}




	/*
		Finds the gratest int suffics for all  job Number of the form YY-##.

		YY - two digit number representing current year.

	*/
	public function getGreatestJobNumber()
	{

		$year = date("y");

		
		$filtered_array = array_values(array_filter($this->index(), 
				function($project) use ($year)
				{
					

					return ($project->isJobNumberStdFormat()) && $project->jobNumberTuple()['year'] == $year;
					


				}));

		usort($filtered_array, 

				function($project_a, $project_b)
				{

					$job_number_a = $project_a->jobNumberTuple()['number'];
					$job_number_b = $project_b->jobNumberTuple()['number'];

					return $job_number_a < $job_number_b;
				});


		return $filtered_array[0]->jobNumberTuple()['number'];

	}


	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{

		
		$rep_controller = new CustomerRepSuite();
		$proj = $this->getPrimaryValue($sugar_pointcloud);
		$customer = $this->getFirstLinkedValue($sugar_pointcloud, 0);

		$customer_id;

		if(!$customer)
		{
			$customer_id = "NONE";
		}
		else
		{
			$customer_id = $customer->id->value;
		}


		return new Project(	$proj->id->value,
							$proj->job_num->value,
							$proj->date_project_c->value,
							$proj->location_c->value,
							$rep_controller->getModelById($customer_id),
							$proj->name->value,
							$proj->old_job_num_c->value);

	}

	public function save($id, $job_num, $date, $location, $rep_id, $name, $old_job_num)
	{

		if(!$location)
		{
			$location = "";

		}

		if(!$old_job_num)
		{
			$old_job_num = "";
		}



		$record_vals = array(
						
						"location_c" => $location,
						"date_project_c" => date_create($date)->format('Y-m-d'),
						"old_job_num_c" => $old_job_num,
						"name" => $name);


		//echo "Record: " . print_r($record_vals, true);

		if(count($this->getModelObjects("old_job_num_c = '" . $old_job_num . "' AND ttick_projects.id != '" . $id . "'", "", 1)) > 0)
		{
			return array("status"=> "FAIL", "msg" => "There already Exists a project with Job Number: " . $old_job_num);
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


			$current_val = $this->getModelById($result->id);

			if(!$rep_id && $id != "NEW")
			{
				
				$this->client->setRelationship($this->moduleName(), $result->id, $current_val->customer_rep->id, 'ttick_projects_contacts_1', 1);
			}
			else if($rep_id)
			{
				
				$this->client->setRelationship($this->moduleName(), $result->id, $rep_id, 'ttick_projects_contacts_1');
			}

			

			return array("status" => "SUCC", "msg" => $result->id);

		}

	}

	public function mapToJobNum($project)
	{
			return array($project->job_num => $project);

	}

	public function getListByJobNum()
	{

		return array_map([$this, "maptoJobNum"], $this->getModelObjects( "", "", 70));

	}


	public function get_list()
	{

		return $this->index();

	}


	public function index()
	{
		return $this->getModelObjects("", "", 70);
	}

	protected function getFields()
	{
		return array( 'id', 'job_num', 'location_c', 'date_project_c', 'old_job_num_c', 'name');
	}


	public function getLinkedFields()
	{


		return array( 
				array( 'name' => 'ttick_projects_contacts_1',
					   'value' => array('id') ) 
			);

	}


}