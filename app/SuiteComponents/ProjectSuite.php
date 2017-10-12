<?php

namespace App\SuiteComponents;
use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\CustomerRepSuite;
use App\SuiteComponents\SuiteTimeTicketModelController;
use App\SuiteComponents\LabourLineItemSuite;
use App\SuiteComponents\DailyWorkTicketSuite;
use App\SuiteComponents\ConstructionHighlightSuite;
use App\SuiteComponents\ProjectTaskSuite;


class Project implements \JsonSerializable
{
	

	public $id;
	public $job_num;
	public $date;
	public $customer_rep;
	public $location;
	public $old_job_num;
	public $name;
	public $budget;

	public $board_id;


	public function __construct($id, $job_num, $date, $location, $customer_rep, $name, $old_job_num, $board_id, $budget = 0)
	{
		$this->id = $id;
		$this->job_num = $job_num;
		$this->date = $date;
		$this->customer_rep = $customer_rep;
		$this->location = $location;
		$this->old_job_num = $old_job_num;
		$this->name = $name;
		$this->budget = $budget;
		$this->board_id = $board_id;
		
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
            'name' => $this->name,
            'budget' => $this->budget,
            'board_id' => $this->board_id ];
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

	public function nextJobNum()
	{
		return date('y') . "-" . ($this->getGreatestJobNumber() + 1);
	}

	public function getModelById($id)
	{
		if($id == 'NEW')
		{
			return array('id' => "NEW", 'job_num' => "", 'date' => date_create()->format('Y-m-d'), 'location'=>'', "customer_rep" => '', 'old_job_num' => $this->nextJobNum() );

		}
		else
		{

			return parent::getModelById($id);

		}

	}


	public function updateProjects($new_projects)
	{

		$current_projects = $this->indexByBoardID();

		$same_board_id = array_intersect_key($new_projects, $current_projects);
		$no_board_id = array_diff_key($new_projects, $current_projects);

		foreach ($same_board_id as $key => $value) 
		{
			
			
			// same board id, different location: location needs to be updated
			if($current_projects[$key]->location != $value['location'])
			{

				$this->saveLocation($current_projects[$key]->id, $value['location']);

			}

		}


		foreach ($no_board_id as $key => $value)
		{
			$trello_location = $value['location'];

			$same_location = array_values(array_filter( $current_projects, 
												function($project) use ($trello_location)
												{
													return $project->location == $trello_location;
												} ));

			if(count($same_location) > 0)
			{

				$this->saveBoardID($same_location[0]->id, $value['board_id']);

			}

			// no board_id, no location, this must be a new project.
			else
			{
				
				$this->save("NEW", 	"0", $value['date_start'], 
									$value['location'], 
									"-1", 
									$value['name'], 
									$this->nextJobNum(), 
									0, $value['board_id']  );
			}

		}



		return $this->successResponse("Successfully Updated Projects");

	}

	private function saveBoardID($id, $board_id)
	{

		return $this->saveSingleValue($id, "trello_board_id_c", $board_id);

	}

	private function saveLocation($id, $location)
	{
		return $this->saveSingleValue($id, "location_c", $location);
	}

	private function saveSingleValue($id, $name, $value)
	{


		$record_vals = array($name => $value);

		try
		{
			$result = $this->client->saveExistingRecord($this->moduleName(), $id, $record_vals);
				
			return $this->successResponse($result->id);
			
		}
		catch(Exception $e)
		{
			return $this->failureResponse("Could not save tables! Please report issue." . $e->message());
		}


	}

	public function indexByBoardID()
	{
		$projects = array_values(array_filter($this->index(), 
			function($project)
			{

				return strlen($project->board_id) > 0;

			}));


		$projects_by_id = array();

		for($i = 0; $i < count($projects); $i++)
		{
			$projects_by_id[$projects[$i]->board_id] = $projects[$i];
		}

		return $projects_by_id;

	}

	public function totalCost($project_id)
	{

		$labour_item_suite = new LabourLineItemSuite();
		$workticket_suite = new DailyWorkTicketSuite();
		$worktickets = $this->getDailyWorkTickets($project_id);

		$cost = 0;

		if($worktickets != null)
		{
			for($ticket_index = 0; $ticket_index < count($worktickets); $ticket_index++)
			{
				$labour = $labour_item_suite->get_listByDailyWorkTicketID($worktickets[$ticket_index]->id);

				for($line_index = 0;  $line_index < count($labour); $line_index++)
				{
					$cost = $cost + $labour[$line_index]->totalCost();
				}

			}
		}


		return $cost;
	}


	public function getIndexWithColour()
	{
		$projects = $this->index();
		$projects_colour = array_fill(0, count($projects), "#fffff");
		$data_highlight = new ConstructionHighlightSuite();



		for($i = 0; $i < count($projects); $i++)
		{
			array_push($projects_colour, array("project" => $projects[$i], "colour" => $data_highlight->getHexValue($projects[$i])));


		}

		return $projects_colour;

	}

	public function getDailyWorkTickets($project_id)
	{

		$dailyworkticket_suite = new DailyWorkTicketSuite();

		$worktickets = $dailyworkticket_suite->getRelatedModelObjects( "ttick_Projects", $project_id, "ttick_projects_ttick_dailyworktickets",  "", "", 70);


		if(count($worktickets) == 0)
		{
			return null;
		}
		else
		{
			return $worktickets;
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

		$budget = 0;


		if($proj->budget_c && strlen($proj->budget_c->value) > 0)
		{

			$budget = $proj->budget_c->value;
		}


		return new Project(	$proj->id->value,
							$proj->job_num->value,
							$proj->date_project_c->value,
							$proj->location_c->value,
							$rep_controller->getModelById($customer_id),
							$proj->name->value,
							$proj->old_job_num_c->value,
							$proj->trello_board_id_c->value,
							$budget);

	}


	/*
		Out of all: the projects that have tasks assigned:
			calculates the percentage each project is done.

	*/
	public function projectCompletion()
	{
		$task_suite = new ProjectTaskSuite();

		$all_projects = $this->index();
		$all_tasks = $task_suite->index();
		$percentage = array();

		for($i = 0; $i < count($all_projects); $i++)
		{

			$project = $all_projects[$i];

			$tasks = array_values(array_filter($all_tasks, 
						function($task) use ($project)
						{
							return $task->project == $project->id;


						} ));

			if(count($tasks) > 0)
			{



				$done_tasks = array_values(array_filter( $tasks, 
								function($task)
								{
									return $task->is_done;
								} ));


				array_push($percentage, array("project_id" => $project->id, "project_name" => $project->name, "percentage_done" => count($done_tasks)/count($tasks)));
			}

		}


		return $percentage;
	}

	/**
	* Saves the project with an ID of ID. An ID of NEW tells the server that this is a new record
	* @param job_num - this is the job number of the 
	* @param date - the start date of the project
	* @param location - the location of the project
	* @param rep_id - the id of the customer rep that corresponds to this project, a string of -1 means no id
	* @param name - the name of the project
	* @param budget
	* @param board_id - the board if of the project, -1 corresponds to no id
	* @return a message based on whether or not this was successful
	**/
	public function save($id, $job_num, $date, $location, $rep_id, $name, $old_job_num, $budget, $board_id = "-1")
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
						"name" => $name,
						"budget_c" => $budget);

		if($board_id != 0)
		{
			$record_vals["trello_board_id_c"] = $board_id;
		}


		//echo "Record: " . print_r($record_vals, true);

		try
		{
			if(count($this->getModelObjects("old_job_num_c = '" . $old_job_num . "' AND ttick_projects.id != '" . $id . "'", "", 1)) > 0)
			{
				return $this->failureResponse("There already Exists a project with Job Number: " . $old_job_num);
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
				else if($rep_id && $rep_id != "-1")
				{
				
					$this->client->setRelationship($this->moduleName(), $result->id, $rep_id, 'ttick_projects_contacts_1');
				}

			
				return $this->successResponse($result->id);
			}
		}
		catch(Exception $e)
		{
			return $this->failureResponse("Could not save tables! Please report issue." . $e->message());
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
		return array( 'id', 'job_num', 'location_c', 'date_project_c', 'old_job_num_c', 'name', "is_scan_project_c", "budget_c", "trello_board_id_c");
	}


	public function getLinkedFields()
	{


		return array( 
				array( 'name' => 'ttick_projects_contacts_1',
					   'value' => array('id') ) 
			);

	}


}