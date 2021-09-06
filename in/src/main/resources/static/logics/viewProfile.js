$(document).ready(function(){

populateData();

})// jquery end


function isActiveUser(value){
	if(value === 1){
		return 'Active';
	}else{
		return 'Deactive'
	}
}

function populateData(){
	//$('#table_id').dataTable().destroy();
	$('#table_id tbody').empty();
	$.ajax({
        type: "GET",
        url:getUsersProfileURL,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
			success: function (data) {
				console.log('get user profile data view', data);
				$.each(data.body,function(i,obj)
                {
	 		  var div_data = '<tr>'
					+ '<td>' + obj.firstName + ' ' + obj.lastName +'</td>'
                    + '<td>' + obj.accessType + '</td>'
					+ '<td>' + isActiveUser(obj.isActive) + '</td>'
					+ '<td> <a onClick="redirectToProfileDetails(' + obj.id+ ')" class="btn pointer">View/Edit</a></td>'
					+ '</tr>';
			    $(div_data).appendTo('#populateGrid');
                });
            }
      });
};

function redirectToProfileDetails(id){
	window.location = 'profile';
	sessionStorage.setItem('profileId',id);
}

