<?php


namespace App\SuiteComponents;

use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\DataHighlight;
use App\SuiteComponents\SuiteTimeTicketModelController;




abstract class DataHighlightSuite extends SuiteTimeTicketModelController
{

	public $WHITE_HEX = "#ffffff";
	public $GREEN_HEX = "#33bc2f";
	public $YELLOW_HEX = "#eddb5a";
	public $RED_HEX = "#db2c1c";

	private $GREEN_HIGHLIGHT;
	private $YELLOW_HIGHLIGHT;
	private $RED_HIGHLIGHT;

	

	/**
	* Default constructor.
	* right now relies on the fact that there are exactly 3 rows.
	**/

	public function __construct()
	{

		parent::__construct();

		$rows = $this->index();

		//echo "Rows: " . print_r($rows, true);

		for($i = 0; $i < count($rows); $i++)
		{

			 if($rows[$i]->colour() == "GREEN")
			 {
			 	//echo "** GREEN HIGHLIGHT **";
			 	$this->GREEN_HIGHLIGHT = $rows[$i];
			 }

			 else if($rows[$i]->colour() == "YELLOW")
			 {
			 	//echo "YELLO HIGHLIGHT";
			 	$this->YELLOW_HIGHLIGHT = $rows[$i];
			 }

			 else if($rows[$i]->colour() == "RED")
			 {

			 	//echo "RED HIGHLIGHT";
			 	$this->RED_HIGHLIGHT = $rows[$i];

			 }

		}

	}

	/**
	* @return the name of the table that corresponds to the 
	* 	data highlighting information
	*/
	abstract protected function tableName();

	/**
	*	@param colour - the colur of the datahighlight row.
	* 	@param min - the minimum value to belong to the highlight group.
	*	@param max - the maximum value for an object to belong to the highlihgt group
	*   @return the data highlight
	*
	*/
	abstract protected function dataHighlightConstructor($id, $colour, $min, $max);

	protected function moduleName()
	{
		return $this->tableName();
	}

	private function within($highlight, $data_object)
	{
		return !$highlight->compareMin($data_object) && !$highlight->compareMax($data_object);
	}

	
	public function getHexValue($data_object)
	{

		if($this->within($this->GREEN_HIGHLIGHT, $data_object))
		{
			return $this->GREEN_HEX;
		}

		else if($this->within($this->YELLOW_HIGHLIGHT, $data_object))
		{
			return $this->YELLOW_HEX;
		}

		else if($this->within($this->RED_HIGHLIGHT, $data_object))
		{
			return $this->RED_HEX;
		}

		else
		{
			return $this->WHITE_HEX;
		}
	}

	/**
	* @return null - because there is no one-to-one correspondence between a datahighlight and an appropriate
	*	model. Everything should be a accessed via auxillary function
	*/	
	protected function sugarObjectToModelObject( $sugar_object )
	{



		$data_highlight = $this->getPrimaryValue($sugar_object);

		

		return $this->dataHighlightConstructor(	$data_highlight->id->value, 
												$data_highlight->colour->value, 
												$data_highlight->min_val->value, 
												$data_highlight->max_val->value);
		
	}



	/**
     * 
	 * @param min - the minimum value required to belong to the group.
	 * @param max - the maximum value that belongs to this group
	**/

	public function save($id, $min, $max)
	{

		$record_vals = array(	
								"min_value" =>  $min,
								"max_value" => $max );

	
		$result = $this->client->saveExistingRecord($this->moduleName(), $id, $record_vals);
		

		return $this->successResponse($result->id);

	}

	public function save_array($objects)
	{

		for($i = 0; $i < count($objects); $i++)
		{

			$this->save($objects[$i]->id, $objects[$i]->min, $objects[$i]->max);

		}


		return $this->successResponse("Table Saved");

	}


	protected function getFields()
	{
		return array( 'id',  'colour', 'min_val', 'max_val');
	}


	public function index()
	{
		return $this->getModelObjects( "", "", 70);
	}
}