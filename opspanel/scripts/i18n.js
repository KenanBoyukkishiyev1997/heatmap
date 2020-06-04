
function i18nPage() {
	
	//document title in web browser header
    document.title = jQuery.i18n.prop('title.application_name');
    $('#appName').text(jQuery.i18n.prop('title.header.application_name'));
	
	//header links
	$('#appTitle').text(jQuery.i18n.prop('application.title'));
	$('#settingsLink').text(jQuery.i18n.prop('application.settings'));
    $('#logoutLink').text(jQuery.i18n.prop('button.logout'));
	
	//forms
	$('#branchFormTitle').text(jQuery.i18n.prop('form.branch.title'));
	$('#branchSelect').text(jQuery.i18n.prop('form.branch.select'));
	$('#profileFormTitle').text(jQuery.i18n.prop('form.profile.title'));
	$('#profileSelect').text(jQuery.i18n.prop('form.profile.select'));
	$('#webCamFormTitle').text(jQuery.i18n.prop('form.web.cam.title'));
	$('#accessRightsFormTitle').text(jQuery.i18n.prop('form.access.rights.title'));
	$('#accesRightsForm').text(jQuery.i18n.prop('form.access.rights'));

	//buttons
	$('#branchFormOK').val(jQuery.i18n.prop('button.ok'));
	$('#profileFormOK').val(jQuery.i18n.prop('button.ok'));
	$('#profileFormCancel').val(jQuery.i18n.prop('button.cancel'));
	$('#webCamOpen').val(jQuery.i18n.prop('button.web.cam.open'));
	$('#webCamClose').val(jQuery.i18n.prop('button.web.cam.close'));
	$('#opspanelClose').val(jQuery.i18n.prop('button.opspanel.close'));

	//data panels
	$('#panelCustomers').text(jQuery.i18n.prop('panel.customers.waiting'));
	$('#panelMaxWait').text(jQuery.i18n.prop('panel.max.wait'));
	$('#panelAvgWait').text(jQuery.i18n.prop('panel.avg.wait'));
	$('#panelCounterOpen').text(jQuery.i18n.prop('panel.counter.open'));
	$('#panelCounterServing').text(jQuery.i18n.prop('panel.counter.serving'));
	$('#panelWebCam').text(jQuery.i18n.prop('panel.web.cam'));
	
	//panels
	$('#queuesTitle').text(jQuery.i18n.prop('panel.queues.title'));
	$('#queuesHeaderName').text(jQuery.i18n.prop('panel.queues.header.name'));
	$('#queuesHeaderCustomers').text(jQuery.i18n.prop('panel.queues.header.customers'));
	$('#queuesHeaderWaitTime').text(jQuery.i18n.prop('panel.queues.header.waittime'));
	$('#queuesHeaderEstimate').text(jQuery.i18n.prop('panel.queues.header.estimate'));

	$('#workstationsTitle').text(jQuery.i18n.prop('panel.workstations.title'));
	$('#workstationsHeaderName').text(jQuery.i18n.prop('panel.workstations.header.name'));
	$('#workstationsHeaderStaff').text(jQuery.i18n.prop('panel.workstations.header.staff'));
	$('#workstationsHeaderStatus').text(jQuery.i18n.prop('panel.workstations.header.status'));
	$('#workstationsHeaderProfile').text(jQuery.i18n.prop('panel.workstations.header.profile'));
	$('#workstationsHeaderService').text(jQuery.i18n.prop('panel.workstations.header.service'));
	$('#workstationsHeaderTicket').text(jQuery.i18n.prop('panel.workstations.header.ticket'));
	$('#workstationsHeaderServingTime').text(jQuery.i18n.prop('panel.workstations.header.servingtime'));
	$('#workstationsHeaderCustomer').text(jQuery.i18n.prop('panel.workstations.header.customer'));
	
}