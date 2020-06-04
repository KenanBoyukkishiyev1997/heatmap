// ---------------------------------------------------------------------------------
// 
var version ="5.4.0.08";
//bura
var numpad_url = "http://10.0.22.23:8002";
var heatmap_url = "http://10.0.22.36:8000/heatmap";
// 
// Updates: 
// 5.2.01   - First version
//
// 5.2.2.b  - Fixed footer does not move along while scrolling down
// 5.2.3    - BvD 20130105
//			- Changed branch calculations to use info from Queue and Workstation table to show correct figures
//          - changed Staff Member name to show full name instead of logon name.
// 5.2.4    - BvD 20131018
//          - Waiting values where not reset when switching branch
//          - Branch name was not always shown
// 5.2.3.01 - BvD 20131024
//          - ProfileId  is now taken from the servicepoint connector, requires access rights for opspanel in shiro.ini
//          - Status could show null if the staff logout from the workstation while serving customers
//          - Reduced number of rest calls
//          - On hoover for queue status changed to onclick
// 5.2.3.02 - Removed colour from the table rows
// 5.2.3.03 - Workaround for branch list not appearing when using LDAP
//          - Removed webcam option
// 5.3.2.04 - BvD 20141128 
//			- Upgraded to managementinformation V2
//			- Webcam panel is only shown if url available
//          - url for webcam will first be search in description, if not found searched in address3
//          - click on logo will now bring you back to the home screen
//          - Warning will be shown if user has no access to the needed connectors
// 5.3.2.05 - Bvd/AB 20141201
// 			- Removed the line when ghost workstation was returned by the rest
//			- Added the option to exclude certain queues by name from the display. Excluded Queues array defined in new file settings.js
// 5.3.2.06 - BvD 20150130
//  		- Merge central and distributed panel into one
//          - average waiting time corrected
//          - added application.png for usage in 5.4
// 5.4.0.07 - BvD 20150310
//			- style sheet updates
//          - force IE8 emulation
//          - compatible with 5.4
// 5.4.0.08 - BvD 20150612
//          - removed the nowrap class from the name fields in the tables to allow long names
// ---------------------------------------------------------------------------------

var selectedProfile;
var selectedStaff;
var selectedWorkstation;
var queueInfoGet = 0;
var selectedQueueId;
var selectedQueueName;
var initQueues = 0;
var initWorkstations = 0;
var webCamUrl;
var webCamWindow = false ;
var branchVariables;
var customersWaiting = 0 ;
var queueWithWaiting = 0 ;
var maxWaitingTime = 0 ;
var totalWaitingTime= 0;
var openServicePoints = 0 ;
var customersBeingServed = 0 ;
var branches;
var accessRights = [0,0,0,0,0];

 $(document).ready(function() {
	sessvars.locale = "en";
	var user = MIService.getCurrentUser();
	if (user != null ) {
		accessRights[1] = 1;
	
		var userName = user.firstName + ' ' + user.lastName
//	if(typeof sessvars.locale == "undefined" || sessvars.locale == "" || null == sessvars.locale || sessvars.userName != userName ) {
		if(sessvars.userName != userName ) {
			sessvars.branchId = -1;
			if ( user.locale != null) {
				sessvars.locale = user.locale;
			}                    
			sessvars.userName = userName;
		}
		$('#userName').text(sessvars.userName);
	}
	
	jQuery.i18n.properties({
		name:'opspanel_messages', 
		path:'lang/', 
		mode:'map',
		language: sessvars.locale == "en" ? " " : sessvars.locale, //hack to avoid trying to load bundle with "_en" ending in case of system language "en"
		callback : function () {
			i18nPage();
		}
	});

	var systemInformation = MIService.getSystemInformation();
	if (systemInformation != null ) {
		sessvars.footer = jQuery.i18n.prop('info.powered.by') + " "  + systemInformation.productName + " " + systemInformation.releaseName + " " + " [" + systemInformation.productVersion + " - " + version + "] " + jQuery.i18n.prop('info.licenced.to') + " " + (typeof systemInformation.licenseCompanyName == "undefined" || systemInformation.licenseCompanyName == "" || systemInformation.licenseCompanyName == null ? jQuery.i18n.prop('info.no.licence') : systemInformation.licenseCompanyName);
		$('#footerContent').text(sessvars.footer);
		$('#currentBranch').html(sessvars.branchName);
		accessRights[2] = 1;
	}

	if ( accessRights[1] == 1 && accessRights[2] == 1  ) {
		getBranches();
	} else {
		showAccessInvalid();
	
	}
 });

 function showAccessInvalid() {
	 showModal('accessRightsPage');
		html= "<table><tr><td><br>" + jQuery.i18n.prop('no.access.part.one') + "</td></tr>";
		html += "<tr><td>&nbsp;&nbsp;&nbsp;-&nbsp;" + jQuery.i18n.prop('no.access.to.entrypoint')  + "</td></tr>";
		html += "<tr><td>&nbsp;&nbsp;&nbsp;-&nbsp;" + jQuery.i18n.prop('no.access.to.managementinformation')  + "</td></tr>";
		html+="<tr><td><br>" + jQuery.i18n.prop('no.access.part.two') + "</td></tr>";
		html += "<tr><td></td></tr>";

		if (accessRights[1] == 0) {
			html += "<tr><td> <img src='images/connector_access_ep.jpg'></td></tr>";
		}
		if (accessRights[2] == 0) {
			html += "<tr><td> <img src='images/connector_access_mi.jpg'></td></tr>";
		}
		html +="<tr><td>&nbsp;</td></tr></table>";
		$("#accessRightsContent").html(html);

	 }
 
 function showSettings() {
	var $branches = $('#branches');
	
	clearInterval(sessvars.branchTimer);
	
	$branches.empty().append('<option value="-1">' + jQuery.i18n.prop('form.branch.select.default') + '</option>');
	
	if(branches == null) {
		showError(jQuery.i18n.prop('error.fetch.branch'));
		return;
	}
	
	if(branches.length == 0) {
		showError(jQuery.i18n.prop('error.no.branch'));
		return;
	};
	
	for(i=0; i < branches.length; i++) {
		$branches.append('<option value="' + branches[i].id + '">' + branches[i].name + '</option>');
	}
	
	if(sessvars.branchId > 0) {
		$branches.val(sessvars.branchId);
	}
	
	if(branches.length == 1) {
		$branches.attr('disabled', 'disabled');
		$branches.val(branches[0].id);
	}
    showModal('branchSelectPage');
 }
 
 function getBranches() {
	var $branches = $('#branches');
	branches = MIService.getBranches();
	
	clearInterval(sessvars.branchTimer);
	
	if(sessvars.branchId > 0) {
		$('#branch').html(sessvars.branchName);
		loadData();
		getBranchData();
		return;
	}
	
	$branches.empty().append('<option value="-1">' + jQuery.i18n.prop('form.branch.select.default') + '</option>');
	
	
	
	if(branches == null) {
		showError(jQuery.i18n.prop('error.fetch.branch'));
		return;
	}
	
	if(branches.length == 0) {
		showError(jQuery.i18n.prop('error.no.branch'));
		return;
	};
	
	for(i=0; i < branches.length; i++) {
		$branches.append('<option value="' + branches[i].id + '">' + branches[i].name + '</option>');
	}
	
	if(branches.length == 1) {
		$branches.attr('disabled', 'disabled');
		$branches.val(branches[0].id);
	}
	   showModal('branchSelectPage');
}

function setBranch() {
	var $branches = $('#branches');
	
	if($branches.val() == -1) {
		showError(jQuery.i18n.prop('error.invalid.branch'));
		return;
	}
	
	sessvars.branchId = $branches.val();
	sessvars.branchName = $branches.find("option:selected").text();
	$('#currentBranch').html(sessvars.branchName);
	$('#branch').html(sessvars.branchName);
	loadData();
	getBranchData();
}

window.onload = function() {
	const urlParams = new URLSearchParams(window.location.search);
	const branchID = urlParams.get("branch") || null;
	const branchName = urlParams.get("branchname") || null;
	if(branchID !== null) {
		sessvars.branchId = branchID;
		sessvars.branchName = branchName;
		$('#currentBranch').html(sessvars.branchName);
		$('#branch').html(sessvars.branchName);
		loadData();
		getBranchData();
	}
}

function loadData() {
	refreshData();
	sessvars.branchTimer =setInterval("refreshData()",30000); 
	hideModal('branchSelectPage');
}

function refreshData() {
	queueWithWaiting = 0 ;
	totalWaitingTime= 0;
	refreshQueueData();
	refreshWorkstationData();
	refreshBranchData();
}

function getBranchData() {
$('#webCamPanel').show();
	var branch = MIService.getBranch(sessvars.branchId);
	webCamUrl = branch.parameters.description;
	if (webCamUrl == "" ) {
		webCamUrl = branch.parameters.address3;
	}

	if (webCamUrl == "" ) {
		$('#webCamPanel').hide();
	}
}

function refreshBranchData() {
	var branch = MIService.getBranch(sessvars.branchId);
	$('#branchAvgWait').text( formatIntoHHMMSS(branch.averageWaitingTime));
	$('#branchMaxWait').text( formatIntoHHMMSS(branch.maxWaitingTime));
}

function refreshQueueData() {
	MIService.getQueueData(sessvars.branchId, function(queues) {
		$("#queues").find("tr:gt(0)").remove();	
		customersWaiting = 0;
		maxWaitingTime = 0 ;
	
		for(i=0; i < queues.length; i++) {
			var excludeQueue = false;
			for (j=0 ; j < excludedQueues.length ; j++) {
				if ( excludedQueues[j] == (queues[i].name) ) {
					excludeQueue = true;
				}
			}

			var s = '';
			s += '<tr class="even"';
			if(queues[i].customersWaiting > 0) {
				s += ' onclick="javascript:showQueue(' + queues[i].id + ');" onmouseout="javascript:hideQueue();">';
			} else {
				s += '>';
			}
			
			s += '<td >' + queues[i].name + '</td>';
			s += '<td align="center">' + queues[i].customersWaiting + '</td>';
			
			customersWaiting += parseInt(queues[i].customersWaiting);

			s += '<td align="center">' + formatIntoHHMMSS(queues[i].waitingTime) + '</td>';
		
			if (queues[i].waitingTime > maxWaitingTime) {
				maxWaitingTime = queues[i].waitingTime;
			}
			totalWaitingTime +=queues[i].waitingTime;
			if (parseInt(queues[i].customersWaiting) > 0) {
				queueWithWaiting +=1;
			}
			if (parseInt(queues[i].estimatedWaitingTime) > 0) {
				s += '<td align="center">' + formatIntoHHMMSS(queues[i].estimatedWaitingTime) + '</td>';
			} else {
				s += '<td align="center">' + '00:00:00' + '</td>';
			}
			s += '</tr>';
			if (excludeQueue == false) {
				$('#queues').append(s);
			}
		}

		var resort = true;
		$("#queues").trigger("update", [resort]);

      	if (initQueues == 0) {
			initQueues =1;
			$("#queues").tablesorter( { sortList: [[0,0]]} );
		}
	// temp added due to connector issues	
		$('#branchCustomers').text(customersWaiting);
	/*	$('#branchMaxWait').text( formatIntoHHMMSS(maxWaitingTime));
		if (queueWithWaiting > 0) {
			var avgWaitTime = Math.round(totalWaitingTime/(queueWithWaiting));
		} else {
			var avgWaitTime = 0;
		}
		$('#branchAvgWait').text( formatIntoHHMMSS(avgWaitTime));
	*/	
	});
}



function refreshWorkstationData() {
	MIService.getWorkstationData(sessvars.branchId, function(workstations) {
		$("#workstations").find("tr:gt(0)").remove();
		openServicePoints = 0;
		customersBeingServed= 0;	

		for(i=0; i < workstations.length; i++) {
		if ( workstations[i].name != null ) {
			var s = '';
			s += '<tr class="even">';

			s += '<td >' + workstations[i].name + '</td>';
			
			if (workstations[i].status  == 'CLOSED' || (workstations[i].staffFullName == null && workstations[i].workProfileName == null)) {
			 	s += '<td nowrap><span class="closed">' + jQuery.i18n.prop('info.status.closed') + '</span></td>';
			 } else {
				s += '<td >' + workstations[i].staffFullName + '</td>';
			}
			
			s += '<td nowrap>' + workstations[i].currentServiceName + '</td>';
			s += '<td nowrap>' + workstations[i].currentTicketNumber + '</td>';
			s += '<td>' + ( (workstations[i].currentTicketNumber != "") ?formatIntoHHMMSS(workstations[i].currentTransactionTime): ' ') + '</td>';
			s += '<td nowrap>' + ((workstations[i].currentCustomerName != null) ? workstations[i].currentCustomerName : ' ')  + '</td>';
			if (workstations[i].currentTicketNumber != "") { 
				customersBeingServed += 1;
			}
			if (workstations[i].status  == 'CLOSED' || (workstations[i].staffFullName == null && workstations[i].workProfileName == null)) {
				s += '<td nowrap></td>';
			 } else {
				openServicePoints += 1;
				s += '<td ><a href="#" onclick="javascript:changeProfile(' + workstations[i].workProfileId + ',\'' + workstations[i].staffName + '\',\'' + workstations[i].workProfileName +'\');"><span>' + workstations[i].workProfileName + '</span></a></td>';
//				s += '<td nowrap><input type="button" class="button" onclick="javascript:changeProfile('   + workstations[i].workProfileId + ',\'' + workstations[i].staffName+'\')"; value="' + workstations[i].workProfileName + '"></input>';
			}

			s += '</tr>';
			$('#workstations').append(s);
		}
}
		var resort = true;
		$("#workstations").trigger("update", [resort]);

      	if (initWorkstations == 0) {
			initWorkstations =1;
			$("#workstations").tablesorter( { sortList: [[0,0]]} );
		}
		
		// temp added due to connector issues	
		$('#branchCounterOpen').text(openServicePoints);
		$('#branchCounterServing').text(customersBeingServed);
	});
}



function allowShowQueue() { //added to avoid multiple rest calls to be send out on hoover
	queueInfoGet = 0;
}


function showQueue(queueId) {
	if (queueId != queueInfoGet) {		//to avoid multiple rest calls when hovering back and forward
		var params = {};
		params.branchId = sessvars.branchId;
		params.queueId = parseInt(queueId);
		
		var services = MIService.getQueueServiceData(params);
		var s = "";
		
		for(i=0; i < services.length; i++) {
			s += "<b>" + services[i].serviceName + "</b>";
			s += ", <small>" + jQuery.i18n.prop('info.services.waittime') + ": " +  formatIntoHHMMSS(parseInt(services[i].waitingTime));
			s += " (" + services[i].ticketNumber ;
			s += " / " +((services[i].customerName != null) ? services[i].customerName : ' ') + ")</small>";
			s += "<br/>";
		}
		
		$('#servicePopup').html(s);

		dialog.showPopup('#servicePopup');
		queueInfoGet = queueId ;
		setTimeout( function() { allowShowQueue(); }, 500);
	}
}

function hideQueue() {
	dialog.hidePopup('#servicePopup');
}

function changeProfile( profileId, staff, name) {
	selectedStaff = staff;
	var idFromList = '';
	var params = {};

    params.branchId = sessvars.branchId;

	var profiles = MIService.getProfiles(params);

	var $profiles = $('#profiles');
	
	$profiles.unbind('change');
	$profiles.empty();
	
	for(i=0; i < profiles.length; i++) {
		$profiles.append('<option value="' + profiles[i].id + '">' + profiles[i].name + '</option>');
		if (profiles[i].name == name) {
			idFromList = profiles[i].id;
			selectedProfile= idFromList;
		}
	}
	

	$profiles.val(idFromList);
	$profiles.change(function() {
		selectedProfile = $profiles.val();

	});
	showModal('profileSelectPage');
}

function setProfile() {
	var params = {};
    params.branchId = sessvars.branchId;
    params.staffName = selectedStaff;
	params.profileNumber = selectedProfile;
	
	//bura
	$.ajax({
		url: numpad_url + '/change_user_workprofile/',
		type: 'POST',
		data: {username : selectedStaff , workprofile : selectedProfile}
	});


	$.ajax({
		url: heatmap_url + '/change_user_workprofile/',
		type: 'POST',
		data: {username : selectedStaff , workprofile : selectedProfile}
	});

	////////////////////


	
	MIService.setProfile(params);
	
	refreshWorkstationData();
	hideModal('profileSelectPage');
}

function showCam() {
	if (webCamWindow == true ) {
		window.open(webCamUrl,'Waiting Area', 'width=800,height=600, location=no, menubar=no, scrollbars=no, toolbar=no, status=no' );
	} else {
		var html = '<iframe scrolling="no" height="600" width="100%" src="'+ webCamUrl +'" ></iframe>';
		document.getElementById('webCamScr').innerHTML = html;
		showModal('webCamPage');
	}
}

function hideCam() {
	var html = '&nbsp;';
	document.getElementById('webCamScr').innerHTML = html;
	hideModal('webCamPage');
}

function handleHome() {
	sessvars.$.clearMem();
    window.location.href = "/";
}

function handleLogoutQES() {
	try {
        sessvars.$.clearMem();
        MIService.logout();
        window.location.href = "/";
    } catch(ex) {
        showError(jQuery.i18n.prop('error.logout.failed') + ': ' + ex);
        return false;
    }
}

   



 