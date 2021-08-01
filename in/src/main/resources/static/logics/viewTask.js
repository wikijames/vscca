$(document).ready(function(){
//var dt = require( 'datatables.net' )();
//$('#table_id').DataTable();
	
//$("#table_id").dataTable({
  
/*"aaData":[
    ["Sitepoint","https://www.sitepoint.com","Blog","2013-10-15 10:30:00"],
    ["Flippa","http://flippa.com","Marketplace","null"],
    ["99designs","http://99designs.com","Marketplace","null"],
    ["Learnable","http://learnable.com","Online courses","null"],
    ["Rubysource","http://rubysource.com","Blog","2013-01-10 12:00:00"]
  ],
  "aoColumnDefs":[{
        "sTitle":"Site name"
      , "aTargets": [ "site_name" ]
  },{
        "aTargets": [ 1 ]
      , "bSortable": false
      , "mRender": function ( url, type, full )  {
          return  '<a href="'+url+'">' + url + '</a>';
      }
  },{
        "aTargets":[ 3 ]
      , "sType": "date"
      , "mRender": function(date, type, full) {
          return (full[2] == "Blog") 
                    ? new Date(date).toDateString()
                    : "N/A" ;
      }  
  }]*/
//});



	// populate intimationuser Dropdown
	//var emailId = 'manish@gmail.com';
	  $.ajax({
        type: "GET",
        url:"http://localhost:8080/vscca/taskDetails?emailId=manish@gmail.com",
        dataType: "json",
        success: function (data) {
		console.log('view manish data',data.body)
               $.each(data.body,function(i,obj)
                {
	 		  var div_data = '<tr>'
					+ '<td>' + obj.projectName + '</td>' 
                    + '<td>' + obj.partyName + '</td>'
					+ '<td>' + obj.responsibility + '</td>'
					+ '<td>' + obj.status + '</td>'
					+ '</tr>';
			    $(div_data).appendTo('#populateGrid'); 
				console.log('data div', div_data)
                });
            }
      });




})// jquery end

	function viewType(){
		var value = $('#viewType').val();
		console.log('value---',value);
		if(value == 'responsibility'){
			return populateData('http://localhost:8080/vscca/taskDetails?emailId=manish@gmail.com');
		}
		else if(value == 'exceution'){
			return populateData('http://localhost:8080/vscca/taskDetailsExceution?emailId=manish@gmail.com');
		}
		else if(value == 'intimation'){
			return populateData('http://localhost:8080/vscca/taskDetailsIntimation?emailId=manish@gmail.com');
		}
		else if(value == 'consulting'){
			return populateData('http://localhost:8080/vscca/taskDetailsConsulting?emailId=manish@gmail.com');
		}
	}

function populateData(url){
	//$('#table_id').dataTable().destroy();
	$('#table_id tbody').empty();
	$.ajax({
        type: "GET",
        url:url,
        dataType: "json",
        success: function (data) {
		console.log('view manish data',data.body)
               $.each(data.body,function(i,obj)
                {
	 		  var div_data = '<tr>'
					+ '<td>' + obj.projectName + '</td>' 
                    + '<td>' + obj.partyName + '</td>'
					+ '<td>' + obj.responsibility + '</td>'
					+ '<td>' + obj.status + '</td>'
					+ '</tr>';
			    $(div_data).appendTo('#populateGrid'); 
				console.log('data div', div_data)
                });
            }
      });
};
