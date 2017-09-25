<?php

namespace App\SuiteComponents;
use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\LabourLineItemSuite;
use App\SuiteComponents\ProjectSuite;
use App\SuiteComponents\SuiteTimeTicketModelController;


class Occupation implements \JsonSerializable
{
	

	public $code;
	public $description;
	public $rate;
	public $is_supervisor;
	public $short_name;


	public function __construct($id, $code, $description, $rate, $short_name, $is_supervisor)
	{
		$this->id = $id;
		$this->code = $code;
		$this->description = $description;
		$this->rate = $rate;
		$this->is_supervisor = $is_supervisor;
		$this->short_name = $short_name;

	}


	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
            'code' => $this->code,
            'description' => $this->description,
            'rate' => $this->rate,
            'short_name' => $this->short_name,
            'is_supervisor'=> $this->is_supervisor
        ];
    }

}

class OccupationSuite extends SuiteTimeTicketModelController
{


	protected function moduleName()
	{
		return 'ttick_OCCUPATIONS';
	}

	protected function sugarObjectToModelObject( $sugar_pointcloud)
	{

		
		$occ = $this->getPrimaryValue($sugar_pointcloud);
		

		return new Occupation(	$occ->id->value,
								$occ->name->value,
								$occ->description->value, 
								$occ->rate->value,
								$occ->short_name_c->value,
								$occ->is_supervisor_c->value);

	}

	public function isOccupationSupervisor($occ_id)
	{


		// "IS supervisor: " . print_r($this->getModelObject($client, $occ_id), true) . "\n";

		return $this->getModelObject($occ_id)->is_supervisor;

	}

	/**
	*	@param labour_compare - the line item we are comparing, labour_lineitem to.
	*	@param labour_lineItem - a line item on the labours of the work ticket
	*	@param date_str - the date in a string: that we are interested in
	*   @param before_given_date - boolean: true means we are filtering for those worktickets
	*			that come before or on the given date.
	**/

	private function filterIsSupervisor($labour_compare, $labour_lineItem, $date_str, $before_given_date)
	{

		// first test if the occupation is a supervisor
		if($this->isOccupationSupervisor($labour_lineItem->occ_id))
		{

			$workticket_suite = new DailyWorkTicketSuite();

			$workticket =  $workticket_suite->getModelByID($labour_lineItem->workticket_id);


			$format = "Y-m-d";


			$date = \DateTime::createFromFormat($format, $date_str);
			$project_date = \DateTime::createFromFormat("Y-m-d", $workticket->date);
			//echo "Date: " . print_r($date, true);
			

			// then test the dates
			if($before_given_date)
			{
				if($date > $project_date)
				{
					return true;
				}

				else if($date == $project_date)
				{

					return strtotime($labour_compare->date_entered) > strtotime($labour_lineItem->date_entered);
					
				}
				else
				{
					return false;
				}
			}

			else
			{
				if($date < $project_date)
				{
					return true;
				}

				else if($date == $project_date)
				{

					return strtotime($labour_compare->date_entered) < strtotime($labour_lineItem->date_entered);
					
				}
				else
				{
					return false;
				}
			}
			
			
		}
		else
		{
			//echo "Is Supervisor Failed";
			return false;
		}

	}

	/**
	*	@param supervisor_id - the id of the supervisor we are grabbing from the tickets.
	*	@param date_str - the date, represented by a string, relative to which the tickets are grabbed
	* 	@param before_given_date - if true returns those tickets that have the employee that corresponds to
	*			superivsor_id and occur on or before the given date
	*
	*	@return the work ticket models that have supervisor_id as a supervisor  and occur either before or date_str
	*		depending on if before_given_date is true or false, respectively
	**/
	private function grabSupervisorTickets($itemCompare, $supervisor_id, $date_str, $before_given_date)
	{


		$lineItemSuite = new LabourLineItemSuite();
		$workticket_suite = new DailyWorkTicketSuite();
	
		//echo "Outer Date: " . $date . "\n";

		$filter_func = 
			function($labour_lineItem) use($date_str, $itemCompare, $before_given_date)
			{

				return $this->filterIsSupervisor($itemCompare, $labour_lineItem, $date_str, $before_given_date);

			};

		$lineItems = $lineItemSuite->getRelatedModelObjects("ttick_Employee", $supervisor_id, "ttick_labour_lineitems_ttick_employee",  "", "", 70);


		return array_map(
			function($line_item) use ($workticket_suite)
			{

				return array("line_item" => $line_item, "work_ticket" => $workticket_suite->getModelByID($line_item->workticket_id) );

			}, array_values(array_filter($lineItems, $filter_func)));

	}

	/**
	*	@param emp_id - the employee id from the supervisor is pulled from
	*	@param date - the date, represented by a string, that corresponds to the tickets we are pulling from, after
	* 	@param number - the number by which the 
	**/
	private function adjustTicketNumbersAfter($itemCompare, $emp_id, $date, $number)
	{

		$employee_suite = new EmployeeSuite();
		$workticket_suite = new DailyWorkTicketSuite();

		$supervisor = $employee_suite->getModelById($emp_id);

		$tickets = $this->grabSupervisorTickets($itemCompare, $emp_id, $date, false);

		usort($tickets, 
			function($ticket_a, $ticket_b)
			{
				///echo print_r($ticket_a);

				$workticket_date_a =  \DateTime::createFromFormat("Y-m-d", $ticket_a['work_ticket']->date);
				$workticket_date_b = \DateTime::createFromFormat("Y-m-d", $ticket_b['work_ticket']->date);


				if( $workticket_date_a == $workticket_date_b)
				{

					$lineitem_entered_a = \DateTime::createFromFormat("Y-m-d", $ticket_a['line_item']->date_entered);
					$lineitem_entered_b = \DateTime::createFromFormat("Y-m-d", $ticket_b['line_item']->date_entered);

					return $lineitem_entered_a > $lineitem_entered_b;

				}

				else
				{
					return $workticket_date_a > $workticket_date_b;
				}

			});

		$ret_array = array();


		$workticket_suite->saveTicketNumber($itemCompare->workticket_id, $this->makeTicketNumber($supervisor, \DateTime::createFromFormat("Y-m-d", $date), $number));

		for($i = 0; $i < count($tickets); $i++)
		{
			$workticket_suite->saveTicketNumber($tickets[$i]['work_ticket']->id, $this->makeTicketNumber($supervisor, \DateTime::createFromFormat("Y-m-d", $tickets[$i]['work_ticket']->date), $number + $i + 1));
		}


		
	}

	private function adjustTicketNumbers($itemCompare, $supervisor, $date, $number, $workticket_suite, $date_before)
	{


		$tickets = $this->grabSupervisorTickets($itemCompare, $supervisor->id, $date, $date_before);

		usort($tickets, 
			function($ticket_a, $ticket_b)
			{
				///echo print_r($ticket_a);

				$workticket_date_a =  \DateTime::createFromFormat("Y-m-d", $ticket_a['work_ticket']->date);
				$workticket_date_b = \DateTime::createFromFormat("Y-m-d", $ticket_b['work_ticket']->date);


				if( $workticket_date_a == $workticket_date_b)
				{

					$lineitem_entered_a = \DateTime::createFromFormat("Y-m-d", $ticket_a['line_item']->date_entered);
					$lineitem_entered_b = \DateTime::createFromFormat("Y-m-d", $ticket_b['line_item']->date_entered);

					return $lineitem_entered_a > $lineitem_entered_b;

				}

				else
				{
					return $workticket_date_a > $workticket_date_b;
				}

			});

		


		for($i = 0; $i < count($tickets); $i++)
		{
			$workticket_suite->saveTicketNumber($tickets[$i]['work_ticket']->id, $this->makeTicketNumber($supervisor, \DateTime::createFromFormat("Y-m-d", $tickets[$i]['work_ticket']->date), $number + $i + 1));
		}

	}

	/**
	* 
	* @param itemCompare - the labour item we are comparing to for the date.
	* @param emp_id
	* @return - the number of times that the employee corresponding to $emp_id appears as a supervisor
	* 	on a daily line item that is not itemCompare
	*
	**/
	private function countSupervisor($itemCompare, $emp_id, $date)
	{
		

		$tickets = $this->grabSupervisorTickets($itemCompare, $emp_id, $date, true);
		return count($tickets);


	}


	private function makeTicketNumber($employee, $date, $number)
	{
		return $employee->initials . "-"  . $date->format('y') . "-" . $number;
	}

	/**
	*	@param supervisor_id - the id of the supervisor on workticket_id
	*	@param workticket_id - the id of the work ticket that is being inserted or
	*			updated
	* 	@param date_str - the date we are worried about.
	*
	*	@return - the daily work ticket number to use for said date.
	*/
	public function rectifyTicketNumbers($lineCompare, $supervisor_id, $workticket_id)
	{
		$employee_suite = new EmployeeSuite();
		$workticket_suite = new DailyWorkTicketSuite();
		$workticket = $workticket_suite->getModelByID($workticket_id);

		$employee = $employee_suite->getModelById($supervisor_id);

		$number = ((int)$this->countSupervisor($lineCompare, $supervisor_id, $workticket->date)) + 1;
		$date = \DateTime::createFromFormat("Y-m-d", $workticket->date);

		$workticket_suite->saveTicketNumber($workticket_id, $this->makeTicketNumber($employee, 
			$date, $number));

		$this->adjustTicketNumbers($lineCompare, $employee, $workticket->date, $number, $workticket_suite, false);
		$this->adjustTicketNumbers($lineCompare, $employee, $workticket->date, 0, $workticket_suite, true);

		
	}

	protected function getFields()
	{
		return array( 'id', 'name', 'description', 'rate', 'short_name_c', 'is_supervisor_c');
	}


	public function get_occupation_list()
	{

		return $this->getModelObjects("", "", 70);
	}



}