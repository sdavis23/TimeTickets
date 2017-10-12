<?php


namespace App\SuiteComponents;


abstract class DataHighlight implements \JsonSerializable
{
	

	private $min;
	private $max;
	private $colour;
	

	public function __construct($id, $colour, $min, $max)
	{

		$this->id= $id;
		$this->min = $min;
		$this->max = $max;
		$this->colour = $colour;
		
	}

	/**
	* @param data_object - the object coming in from the data base.
	* @return the value to compare the min and max against
	**/
	abstract function getValue($data_object);


	/*
	* @return - an all-caps string representation of the colour.
	* 	Example: GREEN
	*/
	public function colour()
	{
		return $this->colour;
	}

	/*
		Compares: the min of data_object using get value. 
			return true if greager than the min, and false if greater than the min
	*/
	public function compareMax($data_object)
	{

		return $this->getValue($data_object) > $this->max;

	}


	/*
		Compares: the min of data_object using get value. 
			return true if less than the min, and false if greater than the min
	*/
	public function compareMin($data_object)
	{

		return $this->getValue($data_object) < $this->min;

	}

	 public function jsonSerialize() 
	 {
        return [
        	'id' => $this->id,
        	'min' => $this->min,
        	'max' => $this->max,
        	'colour' => $this->colour
        	
        ];
    }

}
