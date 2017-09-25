<?php 

namespace App\SuiteComponents;

use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\SuiteTimeTicketModelController;


class DailyWorkTicket implements \JsonSerializable
{
	

	public $id;
	public $ticket_number;
	public $date;
	public $project;


	public function __construct($id, $ticket_number, $date, $project)
	{
		$this->id = $id;
		$this->ticket_number = $ticket_number;
		$this->date = $date;
		$this->project = $project;

	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'name' => $this->ticket_number,
            'date' => $this->date,
            'project' => $this->project
        ];
    }

}

class DailyWorkTicketSuite extends SuiteTimeTicketModelController
{


	protected function moduleName()
	{
		return 'ttick_DailyWorkTickets';
	}

	public function getModelById($id)
	{

		if($id == "NEW")
		{

			$list = $this->get_list("date_dailywork_c < '" . date("Y-m-d") . "'", "date_dailywork_c DESC");

			if(count($list) == 0)
			{
				$list = $this->get_list();
			}

			return new DailyWorkTicket("NEW", "", date("Y-m-d"), $list[0]->project);
		}

		else
		{
			return parent::getModelById($id);
		}
	}

	/*
		Gives the tickets that falls within [date_start, date_end] inclusive.
		and belong to the $job_number
		
	*/
	public function getTicketsBetween( $date_start, $date_end)
	{

		return $this->get_list("date_dailywork_c <='" . $date_end->format('Y-m-d') ."' AND date_dailywork_c >='" . $date_start->format('Y-m-d') . "'", "date_dailywork_c DESC");

	}

	public function get_list($query = "", $order_by = "")
	{
		

		return $this->getModelObjects($query, $order_by, 70);
	}

	protected function sugarObjectToModelObject($sugar_pointcloud)
	{

		
		$proj_controller = new ProjectSuite();
		$ticket = $this->getPrimaryValue($sugar_pointcloud);

		//echo print_r($ticket, true);

		return new DailyWorkTicket(	$ticket->id->value,
									$ticket->ticketnum->value,
									$ticket->date_dailywork_c->value,
									$proj_controller->getModelById($this->getFirstLinkedValue($sugar_pointcloud, 0)->id->value));

	}

	/**
	 * @param id - the id of the ticket - assumes the ticket has been set at least once.
	 * 		and so: the id is anything but NEW.
	 * 
	 * @param ticket_number - the new ticket number to make. 
	 *
	*/
	public function saveTicketNumber($id, $ticket_number)
	{

		$record_vals = array(	"ticketnum" => $ticket_number );

	 	$this->client->saveExistingRecord($this->moduleName(), $id, $record_vals);
	}

	/*

		Saves the daily work ticket summary items.
		Does not: save the line items on the daily tickets.

		id - NEW is a flag dictating that this is a new record.

	*/
	public function save($id, $ticket_number, $date, $project)
	{

		


		if($id == "NEW")
		{

			$record_vals = array(	"ticketnum" => $ticket_number, 
									"date_dailywork_c" => $date );

			$result = $this->client->saveNewRecord($this->moduleName(), $record_vals);
			
			//return $client->setRelationship($this->moduleName(), $result->id, $employee_id, 'ttick_labour_lineitems_ttick_employee');
		}

		else
		{

			$record_vals = array(	"ticketnum" => $ticket_number, 
									"date_dailywork_c" => $date );

			$result = $this->client->saveExistingRecord($this->moduleName(), $id, $record_vals);
			
		}

		$this->client->setRelationship($this->moduleName(), $result->id, $project, "ttick_projects_ttick_dailyworktickets");
		 


		return $result->id;
	}



	protected function getFields()
	{
		return array( 'id', 'ticketnum', 'date_dailywork_c');
	}


	public function getLinkedFields()
	{


		return array( 
				array( 'name' => 'ttick_projects_ttick_dailyworktickets',
					   'value' => array('id') ) 
			);

	}


}