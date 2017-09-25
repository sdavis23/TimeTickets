<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\SuiteComponents\MainSuiteClient;
use App\SuiteComponents\EmployeeSuite;
use App\SuiteComponents\OccupationSuite;
use App\SuiteComponents\EquipmentSuite;
use App\SuiteComponents\LabourLineItemSuite;
use App\SuiteComponents\ProjectSuite;
use App\SuiteComponents\AccountSuite;
use App\SuiteComponents\DailyWorkTicketSuite;
use App\SuiteComponents\CustomerRepSuite;
use App\Providers\SuiteUserProvider;
use App\Invoice;







Route::get('/', function () {
    return view('welcome');
});


Route::get('/employees', 'EmployeeController@index');
Route::get('/occupations', 'OccupationController@index');
Route::get('/equipment', 'EquipmentController@index');

Route::post("/save_employee", 
	function(Request $request)
	{

		$employee_data = $request->all();

		$employee_controller = new EmployeeSuite();
		//echo "Data: " . print_r($employee_data, true);

		return $employee_controller->save( $employee_data['id'], 
											$employee_data['first_name'], 
											$employee_data['last_name'], 
											$employee_data['initials'],
											$employee_data['is_admin'], 
											$employee_data['email'], 
											$employee_data['occ_ids']);
	})->middleware('auth');

Route::post("/save_project", 
	function(Request $request)
	{

		$project_data = $request->all();

		$project_controller = new ProjectSuite();
		//echo "Data: " . print_r($employee_data, true);

		return $project_controller->save( 	$project_data['id'], 
											$project_data['job_num'], 
											$project_data['date'], 
											$project_data['location'], 
											$project_data['rep_id'], 
											$project_data['name'], 
											$project_data['old_job_num']);
	})->middleware('auth');


Route::get("/projects/{project_id}", 
	function($project_id)
	{

		return App::make("App\Http\Controllers\Projects")->show($project_id);

	})->middleware('auth');



Route::get("/dailyworkticket_json/{workticket_id}", 
	function($workticket_id)
	{

		return App::make("App\Http\Controllers\DailyWorkTicketController")->show($workticket_id);

	})->middleware('auth');

Route::get("/dailyworkticket_index/", 
	function()
	{

		return App::make("App\Http\Controllers\DailyWorkTicketController")->index();

	})->middleware('auth');


Route::get("/employee_edit/{employee_id}", 
	function($employee_id)
	{


		return view('employee_edit', ['employee_id' => $employee_id]);

	})->middleware('auth');


Route::get("/invoicePDF/{jobNumber}/{fromDate}/{toDate}", 
		function($jobNumber, $fromDate, $toDate)
		{

			$invoice = new Invoice();

			$zip_descriptor = $invoice->generateFromProjectNumberAndDate($jobNumber, date_create($fromDate), date_create($toDate));
		    

		    
		    return response()->download($zip_descriptor['zip_path'], $zip_descriptor['zip_name'])->deleteFileAfterSend(true);
		    
			
		})->middleware('auth');


Route::get("/dailyworkticket_toPDF/{workticket_id}", 
		function($workticket_id)
		{


			 $invoice = new Invoice();
			 $headers = array(
        			'Content-Type: application/pdf',
    		);

			$file_descriptor = $invoice->generatePDF($workticket_id);

			return  response()->download($file_descriptor['file_path'], $file_descriptor['file_name'], $headers)->deleteFileAfterSend(true);


		})->middleware('auth');

Route::get("/dailyworkticket_view/{workticket_id}", 
	function($workticket_id)
	{

		$invoice = new Invoice();

		return $invoice->generateHTML($workticket_id);


	})->middleware('auth');


Route::get('/dailyworkticket_GeneratePDF',

		function()
		{
			return view('dailyworkticket_pdfForm');
		}

	)->middleware('auth');


Route::get('/timeticket_edit/{ticket_id}', 
	function($ticket_id)
	{

		return view('timeticketedit', ['ticket_id' => $ticket_id]);

	})->middleware('auth');

Route::get('/dailyworkticket_labourlineitems/{workticket_id}', 
	function($workticket_id)
	{

		if($workticket_id == "NEW")
		{
			return array();
		}
		else
		{
			return App::make("App\Http\Controllers\LabourLineItemController")->show($workticket_id);
		}

	})->middleware('auth');

Route::get('/dailyworkticket_equipmentlineitems/{workticket_id}',
	function($workticket_id)
	{

		if($workticket_id == "NEW")
		{
			return array();
		}

		else
		{
			return App::make("App\Http\Controllers\EquipmentLineItemController")->show($workticket_id);
		}

	})->middleware('auth');

Route::post("/dailyticket_savesummary", 
				function(Request $request)
				{

					$request_data = $request->all();

					
					$workticket_suite = new DailyWorkTicketSuite();

					$suite = new OccupationSuite();

					$format = "Y-m-d";

					$date = \DateTime::createFromFormat($format, $request_data['date']);

					$id = $workticket_suite->save($request_data['dailyticket_id'], "NA-00", $request_data['date'], $request_data['project_id']);
					
					if($request_data['supervisor_id'] != "NONE")
					{

						$suite_occ = new OccupationSuite();
						$line_suite = new LabourLineItemSuite();

						return $suite_occ->rectifyTicketNumbers($line_suite->getModelByID($request_data['supervisor_line_item_id']), $request_data['supervisor_id'], $id);

					}
					
					
					//echo print_r($request->all, true); 
					return $id;

				})->middleware('auth');

Route::post('/save_ticket', "LabourLineItemController@store");

Route::post('/save_ticketEquipment', "EquipmentLineItemController@store")->middleware('auth')->middleware('auth')->middleware('auth');

Route::post("/delete_labouritems", 
	function(Request $request)
	{

		return App::make("App\Http\Controllers\LabourLineItemController")->delete_items($request->all());

	})->middleware('auth');

Route::get("/customer_rep_json/{id}", 
		function($id)
		{

			$customer_rep_suite = new CustomerRepSuite();

			return array($customer_rep_suite->getModelByID($id));

		});

Route::get("/customer_rep_edit/{id}", 
		function($id)
		{

			return view('customer_rep_edit', ['rep_id' => $id]);
		})->middleware('auth');


Route::post("/save_customer_rep", 
		function(Request $request)
		{

			$customer_data = $request->all();

			$customer_controller = new CustomerRepSuite();
			//echo "Data: " . print_r($employee_data, true);

			return $customer_controller->save( 	$customer_data['id'], 
												$customer_data['first_name'], 
												$customer_data['last_name'], 
												$customer_data['phone'], 
												$customer_data['email'], 
												$customer_data['client_id'],
												$customer_data['address'] );

			
		})->middleware('auth');

Route::get("/customer_rep_index/", 
		function()
		{

			$customer_rep_suite = new CustomerRepSuite();

			return $customer_rep_suite->index();

		})->middleware('auth');

Route::get("/customer_rep_index_view", 
		function()
		{

			return view('customer_rep_index_view');
		})->middleware('auth');

Route::get("/client_json/{id}", 
		function($id)
		{

			$data = new AccountSuite();

			return [$data->getModelByID($id)];
		});


Route::get("/client_edit/{id}", 
		function($id)
		{

			//$data = new AccountSuite();

			return view('client_edit', ['client_id' => $id]);
		})->middleware('auth');



Route::get("/client_index_view", 
		function()
		{

			//$data = new AccountSuite();

			return view('client_index_view');
		})->middleware('auth');

Route::post("/save_client", 
		function(Request $request)
		{


			$customer_data = $request->all();

			$customer_controller = new AccountSuite();
			//echo "Data: " . print_r($employee_data, true);

			return $customer_controller->save( 	$customer_data['id'], 
												$customer_data['long_name'], 
												$customer_data['short_name'], 
												
												$customer_data['website'] );
		
		})->middleware('auth');

Route::get("/client_index", 
		function()
		{

			$data = new AccountSuite();

			return $data->index();

		})->middleware('auth');
		

Route::get("/project_json/{project_id}",
	function($project_id)
	{


		$data = new ProjectSuite();
		return array($data->getModelByID($project_id));

	})->middleware('auth');


Route::get("/project_edit/{project_id}",
	function($project_id)
	{

		return view('project_edit', ['project_id' => $project_id ]);

	})->middleware('auth');

Route::post("/delete_equipmentitems", 
	function(Request $request)
	{

		return App::make("App\Http\Controllers\EquipmentLineItemController")->delete_items($request->all());

	})->middleware('auth');

Route::get('/login_tosuite', 
		function()
		{

			$client = new MainSuiteClient();

			return print_r($client->loginUser("admin", "DARCT-4532"), true);

		});

Route::get("/home",
		function()
		{

			return view('home');

		});


Route::get("/employee_index_view",
		function()
		{

			return view('employee_index_view');

		})->middleware('auth');

Route::get("/project_index_view",
		function()
		{

			return view('project_index_view');

		})->middleware('auth');

Route::get("/grid",
		function()
		{

			return view('grid');

		});

Route::get("/forms",
		function()
		{

			return view('form');


		});

Route::get("/table",
		function()
		{

			return view('table');

		});

Route::get('/employee_json/{id}', 
		function($id)
		{

			$employee_suite = new EmployeeSuite();

			return array($employee_suite->getModelByID($id));

		})->middleware('auth');


Route::get('/test', 
	function()
	{

		$suite_occ = new OccupationSuite();
		$line_suite = new LabourLineItemSuite();

		return $suite_occ->rectifyTicketNumbers($line_suite->getModelByID('3152079d-0e50-9af6-aac1-59c569c5962f'), "e6b73c8e-406f-e293-eb1d-597e23758a8e", "717bf559-b12d-ff3b-f008-59c56956a049");

	});

Route::get("/project_index", 
	function()
	{
		$project_suite = new ProjectSuite();

		return $project_suite->get_list();

	})->middleware('auth');


Route::get("/calendar", 
	function()
	{

		return view("dailyworkticket_calendar");

	})->middleware('auth');

Route::get('/login_page', array('as' => 'login', 
	function()
	{

		return view('welcome');
		
	}));

Route::post("/login/", 
	function(Request $request)
	{

		$login_credentials = $request->all();


		if(Auth::attempt(['email' => $login_credentials['email'], 'id_token' => $login_credentials['id_token']]))
		{
			return array("LoggedIn" => true, "IsAdmin" => Auth::user()->is_admin);
		}

		else
		{
			return array("LoggedIn" => Auth::check());
		}
		
	});

Route::get('/home', 'HomeController@index')->name('home');
