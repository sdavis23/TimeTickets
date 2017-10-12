<?php

namespace App\SuiteComponents;
use App\SuiteComponents\EmployeeSuite;
use App\SuiteComponents\ProjectSuite;
use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\SuiteTimeTicketModelController;
use App\SuiteComponents\DraftsmenHighlightSuite;

class ProjectTask implements \JsonSerializable
{
	public $id;
	public $name;
	public $estimated_time;
	public $description;
	public $actual_time;
	public $assigned_to;
	public $project;
	public $colour;
	public $card_id;
	public $is_done;

	public function __construct($id, $name, $estimated_time, $actual_time, $description, $assigned_to, $project, $card_id, $is_done)
	{

		$this->id = $id;
		$this->name = $name;
		$this->estimated_time = $estimated_time;
		$this->description = $description;
		$this->assigned_to = $assigned_to;
		$this->actual_time = $actual_time/120;
		$this->project = $project;
		$this->is_done = $is_done;

		$this->colour = "#ffffff";

	}

	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'name' => $this->name,
            'description' => $this->description,
            'estimated_time' => $this->estimated_time,
            'assigned_to' => $this->assigned_to,
            'actual_time' => number_format($this->actual_time, 2),
            'project' => $this->project, 
            'colour' => $this->colour,
            'card_id' => $this->card_id,
            "is_done" => $this->is_done
            ]; 
    }



}



class ProjectTaskSuite extends SuiteTimeTicketModelController
{

	private $data_highlight;

	public function __construct()
	{
		parent::__construct();

		$this->data_highlight = new DraftsmenHighlightSuite();
	}

	protected function moduleName()
	{
		return 'drft_ProjectTask';
	}


	protected function sugarObjectToModelObject( $data_object )
	{

		
		$task = $this->getPrimaryValue($data_object);

		$project = $this->getFirstLinkedValue($data_object, 1);
		$emp = $this->getFirstLinkedValue($data_object, 0);
		$emp_suite = new EmployeeSuite();
		
		

		return new ProjectTask(	$task->id->value,
								$task->name->value,
								$task->estimated_time_c->value,
								$task->actual_time->value,
								$task->description->value, 
								$emp_suite->getModelById($emp->id->value),
								$project->id->value,
								$task->card_id_c->value,
								$task->is_done_c->value);

	}


	public function updateTasks($tasks)
	{

		$project_suite = new ProjectSuite();
		$employee_suite = new EmployeeSuite();
		//echo "HELLO!";

		for($i = 0; $i < count($tasks); $i++)
		{

			$task = $tasks[$i];

			$card_tasks = $this->getModelObjects("card_id_c = '" . $task['card_id']. "'", "", 1);

			$task_id = "NEW";
			$estimated_time = 0;

			$project = $project_suite->getModelObjects("trello_board_id_c = '" . $task['board_id'] . "'", "", 1);
			$employee = $employee_suite->getModelObjects("trello_user_id_c = '" . $task['employee_trello_id'] . "'", "", 1);

			$project_id = 0;
			$employee_id = "c806040c-9d3d-ddf3-ec47-59de373868c6";

			if(count($project) > 0)
			{
				$project_id = $project[0]->id;
			}

			if(count($employee) > 0)
			{
				$employee_id = $employee[0]->id;
			}


			if( count($card_tasks) > 0)
			{
				$task_id = $card_tasks[0]->id;
				$estimated_time = $card_tasks[0]->estimated_time;
				
			}


			//echo "EMPLOYEE ID: " . $employee_id;

			

				//echo "SAVING!";

				$this->save(	$task_id, 
								$task['name'], 
								$estimated_time, 
								$task['actual_time'], 
								$employee_id,
								$task['description'],
								$project_id, 
								$task['card_id'], 
								$task['done']);
			

		}

	}

	public function getModelById($id)
	{
		if($id == 'NEW')
		{
			return array('id' => "NEW", 'name' => "",  'estimated_time_c'=> '',  "actual_time" => "", "assigned_to" => "", 'description' => '' );

		}
		else
		{

			return parent::getModelById($id);

		}

	}

	private function applyColour($tasks)
	{


		for($i = 0; $i < count($tasks); $i++)
		{

			$tasks[$i]->colour = $this->data_highlight->getHexValue($tasks[$i]);

		}

		return $tasks;

	}


	public function getByProjectID($project_id)
	{
		$tasks =  $this->applyColour(array_values(array_filter($this->index(), 
			function($task) use($project_id)
			{

				return $task->project == $project_id;

			})));

		usort($tasks, 
			function($task_a, $task_b)
			{

				return ($task_a->actual_time - $task_a->estimated_time) > ($task_b->actual_time - $task_b->estimated_time);

			});


		usort($tasks, 
			function($task_a, $task_b)
			{

				return ($task_a->assigned_to->last_name < $task_b->assigned_to->last_name);

			});

		


		return $tasks;
	}


	
	public function save($id, $name, $estimated_time, $actual_time, $assigned_to, $description, $project_id, $card_id = null, $is_done = "0")
	{

		
		$record_vals = array( "name" => $name, "estimated_time_c" => $estimated_time, "description" => $description, "actual_time" => $actual_time, "is_done_c" => $is_done);

		if($card_id != null)
		{
			$record_vals['card_id_c'] = $card_id;
		}

		if($id == "NEW")
		{
			$result = $this->client->saveNewRecord($this->moduleName(), $record_vals);
			
		}

		else
		{
			$result = $this->client->saveExistingRecord($this->moduleName(), $id, $record_vals);
		}

		$this->client->setRelationship($this->moduleName(),  $result->id, $project_id, "drft_projecttask_ttick_projects");

		$this->client->setRelationship($this->moduleName(),  $result->id, $assigned_to, "ttick_employee_drft_projecttask_1");
			
		return $this->successResponse($result->id);
		 		
	}

	public function grabByEmployee($emp_id)
	{

		$tasks = array_values(array_filter($this->index(), 
								function($project_task) use($emp_id)
								{
									return $project_task->assigned_to->id == $emp_id;

								}));


		for($i = 0; $i < count($tasks); $i++)
		{
			$tasks[$i]->colour = $this->data_highlight->getHexValue($tasks[$i]);
		}

		return $tasks;
	}


	/*

		returns an array with two elements,
			project_ids - the unique ids of the projects of the employees.
			project_tasks - the task objects

	*/
	public function getEmployeeProjectData($emp_id)
	{

		$all_tasks = $this->grabByEmployee($emp_id);
		$project_suite = new ProjectSuite();
		$project_ids = [];
		

		for($i = 0; $i < count($all_tasks); $i++)
		{

			if(!in_array($all_tasks[$i]->project, $project_ids))
			{
				array_push($project_ids, $all_tasks[$i]->project);
			}

		}

		return array("projects" => array_map(function($project_id) use ($project_suite)

											{ return $project_suite->getModelById($project_id); } , $project_ids), "project_tasks" => $all_tasks);

	}

	/*
		Given an array of task: saves each one.
		Upon success returns an array of sucess id's where the id's correspond to
		each task in the order the tasks were given to the function
	*/
	public function save_task_array($tasks)
	{
		$failed = false;
		$success_ids = array();

		for($i = 0; $i < count($tasks) && !($failed); $i++)
		{
		 	$resp = $this->save(	$tasks[$i]["id"], 
									$tasks[$i]['name'], 
									$tasks[$i]['estimated_time'], 
									$tasks[$i]['actual_time'], 
									$tasks[$i]['assigned_to'], 
									$tasks[$i]['description'],
									$tasks[$i]['project_id']);

		 	if($resp['status'] == "FAIL")
		 	{
		 		$failed = true;
		 	}

		 	else
		 	{
		 		array_push($success_ids, $resp['msg']);
		 	}
		}

		if($failed)
		{
			return $this->failureResponse("Could not save Table");
		}

		else
		{
			return $this->successResponse($success_ids);
		}
	}


	public function delete($id)
	{
		return $this->client->deleteExistingRecord($this->moduleName(), $id);
	}

	public function index()
	{
		return $this->getModelObjects("", "", 70);
	}



	protected function getFields()
	{
		return array( 'id', 'name', 'estimated_time_c', 'actual_time', 'description', 'card_id_c', "is_done_c");
	}

	public function getLinkedFields()
	{


		return array( 

			

				array( 'name' => 'ttick_employee_drft_projecttask_1',
					   'value' => array('id') ),

				array( 'name' => 'drft_projecttask_ttick_projects',
					   'value' => array('id') )

			);

	}



}