/*

  This function loads JSON data from laravel.
  and maps it into the structure the react side of things is expecting.

*/
function loadFromLaravel(url, map_func)
{


  console.log("URL: " + url);

   return  $.get(url
    ).then(
      function(list)
      {

        return new Promise(function(resolve, reject)
                {

                  //console.log("URL: " + JSON.stringify(url) + ", " + JSON.stringify(list.map(map_func)) );
                  resolve(list.map(map_func));

                });


      });



}

/*
  Returns a promise where on a resolve gives a lookup defined by:
    the JSON data structure retruned from a url and \
    f_key and f_val - as functions on the structure

    f_key - function that takes in the JSON returned from the url
      and returns the key for the lookup

    f_val - function that takes in the JSON returned from the url and  
      returns the value for the lookup

*/
function loadLookup(url, f_key, f_val)
{


   return loadFromLaravel(url, 

          function(item)
          {

            //console.log("Pre Dictionary: " + JSON.stringify(item));
            return {key: f_key(item), val: f_val(item) };
          }

    ).then(
        function(list)
        {

         return new Promise(
                function(resolve, reject)
                {
                  var lookup = {};

                  //console.log("Pre Dictionary: " + JSON.stringify(list));


                  list.forEach(
                    function(value)
                    {

                     // console.log("Turning into dictionary: " + JSON.stringify(value));
                      lookup[value.key] = value.val;

                    });

                  //console.log("Calculated LookUp: " + JSON.stringify(lookup) );
                  resolve(lookup);

                });


        } );


}



function loadOccupationLookup()
{

  //console.log("Loading Occupations");
  return loadLookup("/occupations", function(json_occ){return json_occ.id; }, function(json_occ){return {code: json_occ.code, rate: json_occ.rate, is_supervisor: json_occ.is_supervisor }; });

}

export function loadCustomerReps()
{
  return loadFromLaravel("/customer_rep_index", function(customer_rep){ return customer_rep; })
}

export function loadCustomerRep(id)
{
  return loadFromLaravel("/customer_rep_json/" + id, function(customer_rep){ return customer_rep; })
}


export function loadEmployee(id)
{


  return loadFromLaravel("/employee_json/" + id, function(emp){ return emp; })
  
}

export function loadClient(id)
{

  return loadFromLaravel("/client_json/" + id, function(client){ return client; })
}

export function loadClientIndex()
{


  return loadFromLaravel("/client_index", function(client){ return client; })
  
}

/*
  Returns occupations in the form of {id, name}
*/
export function loadOccupations()
{
  return loadFromLaravel("/occupations", function(occupation){ return {id: occupation.id, code: occupation.code} });
}

function loadEquipmentLookup()
{

  
  return loadLookup("/equipment", function(json_equip){ return json_equip.id; }, function(json_equip){ return json_equip; });
}

export function loadEmployees()
{

 
  return loadFromLaravel("/employees", function(emp){ return emp; });
}

export function loadLabourLineItems(id)
{

  //console.log("URL: " + "/dailyworkticket_labourlineitems/" + id);

 return loadFromLaravel("/dailyworkticket_labourlineitems/" + id,



            function(line_item)
            {


              
              return {  id: line_item.id,
                        employee: line_item.emp_id,
                        tt: line_item.traveltime,
                        reg: line_item.reg,
                        ot: line_item.overtime,
                        description: line_item.description,
                        occ: line_item.occ_id };
            });

}



function loadEquipmentLineItems(id)
{


  //console.log("Equipment Line Items URL: " + "/dailyworkticket_equipmentlineitems/" + id);

  

  return loadFromLaravel("/dailyworkticket_equipmentlineitems/" + id,



            function(line_item)
            {
              
              return {  id: line_item.id,
                        equip_id: line_item.equip_id,
                        hours: line_item.hours,
                        description: line_item.description
                      };
            });

}


export function loadEmployeeTableData(id)
{

 return Promise.all(

    [loadLabourLineItems(id),

    loadOccupationLookup(),


    loadEmployees(),

    loadEquipmentLookup() ] 

    ).then(
        
        function(value)
        {

          //console.log("Loaded Employees!");
            return new Promise(
              function(resolve, reject)
              {

                resolve({

                   
                    occupations: value[1],
                    labour_lines: value[0],
                    employees: value[2]

                });


              });
      });

}

export function loadEquipment()
{

    return loadFromLaravel("/equipment",



            function(line_item)
            {
              
              return {  id: line_item.id,
                        unit_number: line_item.unit_number,
                        name: line_item.name
                      }
            });

}

export function loadEquipmentTableData(id)
{

  //console.log("Loading Equipment");

 return Promise.all([loadEquipmentLineItems(id),

    loadEquipment()
  ]).then(
    function(val)
    {

      //console.log("Equipment Loaded");
      return new Promise(
            function(resolve, reject)
            {

              resolve({
                equipment: val[1],
                equipment_lineitems: val[0]

              });

            });


    }

  );


}

export function loadEquipmentAndLabour(id)
{

  //console.log("Loading Equipment and labour");

  return loadEquipmentTableData(id).then(
        function(val)
        {

          //console.log("Equipment Async Val: " + JSON.stringify(val));

      
          return loadEmployeeTableData(id).then(
            function(emp_val)
            {


              //console.log("Employee Async Val: " + JSON.stringify(val));
              return new Promise(
                function(resolve, reject)
                {

                resolve({

                    equipment_tableData: val,
                    labour_tableData: emp_val

                });

            });

          });

        
      }
    );


}

export function loadDailyTicketEditData(workticket_id)
{

  return loadEquipmentAndLabour(workticket_id).then(
    function(eq_val)
    {

      console.log('Loading Project Index');

      return Promise.all([loadDailyTicket(workticket_id),
            loadProjectIndex()
          ]
    ).then(
      function(val)
      {
          console.log("Loaded project Index");

        return new Promise(
            function(resolve, reject)
            {

              resolve({

                labour_tableData: eq_val.labour_tableData,
                equipment_tableData: eq_val.equipment_tableData,
                dailyticket_summary: val[0],
                projects: val[1]

              });

            });

      });




    });

}

export function loadProjectIndex()
{

  console.log("Loading Projects!");
  return loadFromLaravel("/project_index", function(data){ return data; });
}

export function loadProject(id)
{

  return loadFromLaravel("/project_json/" + id, function(data){ return data; });
}


function loadDailyTicket(id)
{

  console.log("Loading Daily Ticket: " + id);
  return loadFromLaravel("/dailyworkticket_json/" + id, function(data){ return data; });

}

export function loadAllDailyTickets()
{

  return loadFromLaravel("/dailyworkticket_index", function(data){ return data; });

}

export function loadDailyTicketViewData(id)
{

  console.log("Loading Occupations and labour");

  return Promise.all([loadLabourLineItems(id),
          loadOccupationLookup(),
          loadDailyTicket(id)]).then(
        function(val)
        {

              console.log("Returned: " + JSON.stringify(val));

              return new Promise(
                function(resolve, reject)
                {

                resolve({

                    labour_items: val[0],
                    occupations: val[1],
                    daily_ticket: val[2][0]

                });
              });

   
      });


}

