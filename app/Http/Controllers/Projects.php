<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\SuiteComponents\ProjectSuite;
use App\SuiteComponents\MainSuiteClient;

class Projects extends Controller
{
    //
    public function show($id)
    {

    	$client = new MainSuiteClient();
    	$p = new ProjectSuite();
    	return $p->getModelObject($client,  $id);

    }

    public function indexByJobNum()
    {


    	$client = new MainSuiteClient();
    	$p = new ProjectSuite();
    	return $p->get_listByJobNum($client,  $id);


    }

    public function index()
    {


    	$client = new MainSuiteClient();
    	$p = new ProjectSuite();
    	return $p->get_list();


    }
}
