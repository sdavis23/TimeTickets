<?php

namespace App;
use App\Http\Controllers\LabourLineItemController;
use App\Http\Controllers\EquipmentLineItemController;
use App\Http\Controllers\DailyWorkTicketController;
use App\Prince;
use App\SuiteComponents\EmployeeSuite;
use App\SuiteComponents\OccupationSuite;
use App\SuiteComponents\EquipmentSuite;
use App\SuiteComponents\LabourLineItemSuite;
use App\SuiteComponents\ProjectSuite;
use App\SuiteComponents\DailyWorkTicketSuite;


class Invoice
{

	private $pdfFolder = "/var/www/html/time_tickets/public/downloads/";

	private function totalLineItems($lineItem)
	{

		//echo "Line Item: " . print_r($lineItem, true);
		$emp_suite = new EmployeeSuite();
		$employee = $emp_suite->getModelById($lineItem->emp_id);
		$occ_suite = new OccupationSuite();
		$occupation = $occ_suite->getModelById($lineItem->occ_id);
		$rate = $occupation->rate;

		//echo "Totalling Name: " .number_format($lineItem->reg*$rate + $lineItem->overtime*($rate*1.5) + $rate*$lineItem->traveltime, 2);

		return array(
			'emp_name' => $employee->first_name . " " . $employee->last_name,
			'occ_name' => $occupation->short_name,
			'reg' => $lineItem->reg,
			'overtime' => $lineItem->overtime,
			'traveltime' => $lineItem->traveltime,
			'labour_description' => $lineItem->description,
			'emp_rate' => $occupation->rate,
			'labour_total' => $lineItem->totalCost() );

	}

	private function getLabourTotal($totaled_lineItem)
	{
		return $totaled_lineItem['labour_total'];
	}



	private function getEquipTotal($totaledEquipItem)
	{

		return $totaledEquipItem['equip_total'];
	}

	private function totalEquipItems($equipItem)
	{

		$equip_suite = new EquipmentSuite();
		$equipment = $equip_suite->getModelById($equipItem->equip_id);

		return array(
				'equip_description' => $equipment->name,
				'unit_number' => $equipment->unit_number,
				'hours' => $equipItem->hours,
				'equip_rate'=> $equipment->rate,
				'equip_total' => number_format($equipment->rate*$equipItem->hours, 2) );

	}

	private function combineLabourAndEquipment($labourLineItems, $equipLineItems)
	{


		$totaled_lineItems =  $labourLineItems;
		$totaled_equipment =  $equipLineItems;

		$current_index = 0;
		$final_array = array();

		while($current_index < count($totaled_lineItems) && $current_index < count($totaled_equipment))
		{
			array_push($final_array, array_merge($totaled_lineItems[$current_index], $totaled_equipment[$current_index]) );

			$current_index++;
		}

	

		while($current_index < count($totaled_lineItems) )
		{
			array_push($final_array, array_merge($totaled_lineItems[$current_index], $this->emptyEquipItem()) );

			$current_index++;
		}

		while($current_index < count($totaled_equipment) )
		{
			array_push($final_array, array_merge($totaled_equipment[$current_index], $this->emptyLabourItem()) );

			$current_index++;
		}


		return $final_array;
	}

	private function reduceDescription($string, $labour_item)
	{
		return $string . $labour_item->description . ", ";
	}

	private function emptyLabourItem()
	{


		return array(
			'emp_name' => "&nbsp;",
			'occ_name' => "&nbsp;",
			'reg' => "&nbsp;",
			'overtime' => "&nbsp;",
			'traveltime' => "&nbsp;",
			'labour_description' => "&nbsp;",
			'emp_rate' => "&nbsp;",
			'labour_total' => "&nbsp;");

	}

	private function emptyLineItem()
	{
		return array(	'emp_name' => "&nbsp;",
						'emp_occ' => "&nbsp;",
						'emp_rate' => "&nbsp;",
						'emp_reg' =>"&nbsp;",
						'emp_ot' => "&nbsp;",
						'emp_trvl' => "&nbsp;",
						'emp_total' => "&nbsp;",
						'equip_name' => "&nbsp;",
						'equip_unitNo' => "&nbsp;",
						'equip_rate' => "&nbsp;",
						'equip_hours' => "&nbsp;",
						'equip_total' => "&nbsp;");
	}

	private function emptyEquipItem()
	{

	

		return array(
				'equip_description' => "&nbsp;",
				'unit_number' => "&nbsp;",
				'hours' => "&nbsp;",
				'equip_rate'=> "&nbsp;",
				'equip_total' => "&nbsp;"
			);

	}

	public function generateHTML($workticket_id, $show_print_button = true)
	{

			// defines the minimum number of lines necessary
			$MIN_LINES = 9;


			$labour_items =  (new LabourLineItemController())->show($workticket_id);
			$equip_items =   (new EquipmentLineItemController() )->show($workticket_id);

			$labour_lines = array_map([$this, "totalLineItems"], $labour_items);
			$equip_lines=  array_map([$this, "totalEquipItems"], $equip_items);

			$description = array_reduce($labour_items, [$this, "reduceDescription"], "");

			$line_items = array_map(
							function($line)
							{
								//echo "Line: " . print_r($line, true);
								return array(	'emp_name' => $line['emp_name'],
												'emp_occ' => $line['occ_name'],
												'emp_rate' => number_format($line['emp_rate'], 0),
												'emp_reg' => $line['reg'],
												'emp_ot' => $line['overtime'],
												'emp_trvl' => $line['traveltime'],
												'emp_total' => number_format($line['labour_total'], 2),
												'equip_name' => $line['equip_description'],
												'equip_unitNo' => $line['unit_number'],
												'equip_rate' => $line['equip_rate'],
												'equip_hours' => $line['hours'],
												'equip_total' => $line['equip_total']

									);

							}, $this->combineLabourAndEquipment($labour_lines, $equip_lines) );


			// ensure that there are at least 12 lines
			while(count($line_items) < $MIN_LINES)
			{
				array_push($line_items, $this->emptyLineItem());
			}

			$labour_total = array_sum(array_map([$this, "getLabourTotal"], $labour_lines));
			$equip_total = array_sum(array_map([$this, "getEquipTotal"], $equip_lines));

			$sub_total = $labour_total + $equip_total;
		
			$gst = 0.05*$sub_total;

			$grand_total = $gst + $sub_total;

			$data_summary = (new DailyWorkTicketController() )->show($workticket_id);
			//echo "Summary: " . print_r($data_summary, true);

			//echo "Final List: " . print_r(combineLabourAndEquipment($line_items, $equip_items), true);

			return view('timeticket', [	'line_items' => $line_items, 
										'description' => $description,
										'data_summary' => $data_summary[0],
										'gst' => $gst,
										'labour_total' => $labour_total,
										'sub_total' => $sub_total,
										'equip_total' => $equip_total,
										'grand_total' => $grand_total,
										'show_print_button' => $show_print_button]); 

	}

	/*

		Given a work ticket id, returns the path on the server where the
		newly generated time ticket lays.

		Returns: an array of the form ('file_name', 'file_path')

	*/
	public function generatePDF($workticket_id)
	{

		$data_summary = ( new DailyWorkTicketController() )->show($workticket_id)[0];
		$prince = new Prince('/usr/bin/prince');
		//echo print_r($data_summary, true);

		$prince->setFileRoot("/var/www/html/time_tickets/public/");
			
		$fileName = $data_summary->project->old_job_num . "_" . $data_summary->date . ".pdf";
		$filePath = $this->pdfFolder . $fileName;

		$prince->convert_string_to_file($this->generateHTML($workticket_id, false), $filePath);

    	return array('file_name' => $fileName, 'file_path' => $filePath);
	}

	/*
		Given a project Number generates: a set of PDF's
			that are in the range [$from_date, $to_date] inclusive.

		puts the pdf's in a zip folder,
		returns the zip_path and the zip_name in an array

	*/
	public function generateFromProjectNumberAndDate($job_number, $from_date, $to_date)
	{
		$dailyticket_controller = new DailyWorkTicketSuite();
		$zip_name =  "Invoices-" . $job_number . "_" . $from_date->format("Y-m-d") . "_" . $to_date->format("Y-m-d") . ".zip";
		$zip_path =  $this->pdfFolder . $zip_name;

		$zip = new \ZipArchive();
		$zip->open($zip_path, \ZipArchive::CREATE);


		$tickets = array_values(array_filter($dailyticket_controller->getTicketsBetween($from_date, $to_date), 
			function($ticket) use ($job_number)
			{

				return $ticket->project->job_num == $job_number;

			}));

		$filePaths = [];	

		if(count($tickets) > 0)
		{
			
			//echo print_r($tickets, true);

			for($i = 0; $i < count($tickets); $i++)
			{

				$filePaths[$i] = $this->generatePDF($tickets[$i]->id);
			}

			
			for($i = 0; $i < count($filePaths); $i++)
			{

				$zip->addFile($filePaths[$i]['file_path'], $filePaths[$i]['file_name']);
			}


			
		}
		else
		{
			$zip->addEmptyDir('.');
		}

		$zip->close();

		

		return array('zip_path' => $zip_path, 'zip_name' => $zip_name);

		
	}



}