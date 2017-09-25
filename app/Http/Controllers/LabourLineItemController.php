<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\SuiteComponents\LabourLineItemSuite;

class LabourLineItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }


    

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

         
         $line_suite = new LabourLineItemSuite();
        //
        //array_map([$this, ])
        return $line_suite->saveLineItems($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //

        $labour_lineitemsuite = new LabourLineItemSuite();

        return $labour_lineitemsuite->get_listByDailyWorkTicketID($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    public function delete_items($items)
    {
        $labour_lineitemsuite = new LabourLineItemSuite();

        return $labour_lineitemsuite->deleteLineItems($items);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        //$labour_lineitemsuite = new LabourLineItemSuite();

        //return $labour_lineitemsuite->deleteLineItems($id);
    }
}
