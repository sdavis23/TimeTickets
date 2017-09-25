
/*	
	Returns true - if the project has all of the necessary info 
	to properly print the invoice.
*/
export function projectInfoComplete(project)
{
	console.log("LOCATION: " + project.location);

	return (project.location.length > 0) && (project.customer_rep.id != "NONE");
   
   
}