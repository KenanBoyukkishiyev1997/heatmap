//todo
// change following command back to managementinformation service instead of servicepoint service
// _getUser




var MIService = (function($) {

//	var _isCentral = true;


	var _mountingPoint = '/rest'

//	if (_isCentral == true) {
//		_mountingPoint = '/qsystem/rest'
//	}
	
	$.ajax({
		type: 'GET',
		url: '/qsystem/rest/managementinformation/v2/systemInformation',
		dataType: 'json',
		async: false,
		cache: false,
		success: function() {
			_isCentral = true;
			_mountingPoint = '/qsystem/rest'
		},
		error: function(xhr, type) {
		}
	});

	var _user;
	var _sysInfo;
	var _profiles;
	var _branches;
	var _branch;
	var _branchVariables;
	var _serviceData;
	var _services;
	
	function _getUser() {
		$.ajax({
			type: 'GET',
			url: '/rest/entrypoint/user',
//			url: _mountingPoint +'/rest/managementinformation/user',
			dataType: 'json',
			async: false,
			cache: false,
			success: function(user) {
				_user = user;
			},
			error: function(xhr, type) {
				_user = null;
			}
		});
	}
	
	function _getSysInfo() {
		$.ajax({
			type: 'GET',
			url: _mountingPoint +'/managementinformation/v2/systemInformation',
			dataType: 'json',
			async: false,
			cache: false,
			success: function(info) {
				_sysInfo = info;
			},
			error: function(xhr, type) {
				_sysInfo = null;
			}
		});
	}
	
	function _logout() {
		$.ajax({
			type: 'PUT',
			url: _mountingPoint +'/rest/entrypoint/logout',
			dataType: 'json',
			async: false,
			success: function() {
				
			},
			error: function(xhr, type) {
			
			}
		});
	}
	
	function _getProfiles(params) {
		$.ajax({
			type: 'GET',
//			url: _mountingPoint +'/servicepoint/branches/' + params.branchId + '/workProfiles',
			url: _mountingPoint +'/managementinformation/v2/branches/' + params.branchId + '/profiles',
			dataType: 'json',
			async: false,
			cache: false,
			success: function(profiles) {
				_profiles = profiles;
			},
			error: function(xhr, type) {
				_profiles = null;
			}
		});
	}
	
	function _setProfile(params) {
		$.ajax({
			type: 'PUT',
			url: _mountingPoint +'/managementinformation/v2/branches/' + params.branchId + '/user/' + params.staffName + '/profile/' + params.profileNumber,
			dataType: 'json',
			async: false,
			success: function() {
				
			},
			error: function(xhr, type) {
				
			}
		});
	}
	
	function _getQueueServiceData(params) {
		$.ajax({
			type: 'GET',
			url: _mountingPoint +'/managementinformation/v2/branches/' + params.branchId + '/queues/' + params.queueId + '/visits',
			dataType: 'json',
			async: false,
			cache: false,
			success: function(serviceData) {
				_serviceData = serviceData;
			},
			error: function(xhr, type) {
				_serviceData = null;
			}
		});
	}
	
	
	function _getBranches() {
		$.ajax({
			type: 'GET',
			url: _mountingPoint +'/managementinformation/v2/branches',
			dataType: 'json',
			async: false,
			cache: false,
			success: function(branches) {
				_branches = branches;
			},
			error: function(xhr, type) {
				
				_branches = null;
			}
		});
	}
	
	function _getQueueData(branchId, callback) {
		$.ajax({
			type: 'GET',
			url: _mountingPoint +'/managementinformation/v2/branches/' + branchId + '/queues',
			dataType: 'json',
			async: true,
			cache: false,
			success: function(queues) {
				callback(queues);
			},
			error: function(xhr, type) {
				
			}
		});
	}
	
	function _getWorkstationData(branchId, callback) {
		$.ajax({
			type: 'GET',
			url: _mountingPoint +'/managementinformation/v2/branches/' + branchId + '/servicePoints',
			dataType: 'json',
			async: true,
			cache: false,
			success: function(workstations) {
				callback(workstations);
			},
			error: function(xhr, type) {
				
			}
		});
	}

	function _getBranchVariables(branchId) {
		$.ajax({
			type: 'GET',
			url: _mountingPoint +'/entrypoint/branches/' + branchId + '/variables',
			dataType: 'json',
			async: false,
			cache: false,
			success: function(branchVariables) {
				_branchVariables = branchVariables;
			},
			error: function(xhr, type) {
				_branchVariables = null;
			}
		});
	}
	
	function _setBranchVariable(branchId,name,value) {
		$.ajax({
			type: 'PUT',
			url: _mountingPoint +'/entrypoint/branches/' + branchId + '/variables',
			contentType: 'application/json',
			dataType: 'json',
			data: '{"name":"' + name + '","value":"' + value + '"}',
			async: false,
			success: function() {
			},
			error: function(xhr, type) {
			}
		});
	}

	function _getServices() {
		var isCentral = true;
		var branchId = sessvars.branchId;
		var url = _mountingPoint +'/rest/entrypoint/branches/' + branchId + '/services';
		$.ajax({
			'type' : 'GET',
			'url' : url,
			dataType: 'json',
			async: false,
			cache: false,
			success: function(services) {
				_services = services;
			},
			error: function() {
				_services = [];
			}			
		});
	}	
	
	function _getVariable(params) {
		$.ajax({
			type: 'GET',
			url: _mountingPoint +'/entrypoint/branches/' + params.branchId + '/variables/' + params.variableName,
			dataType: 'json',
			async: false,
			cache: false,
			success: function(value) {
				_variableValue = value;
			},
			error: function(xhr, type) {
				_variableValue = null;
			}
		});
	}
	
	function _getBranch(branchId) {
		$.ajax({
			type: 'GET',
			url: _mountingPoint +'/managementinformation/v2/branches/' + branchId ,
			dataType: 'json',
			async: false,
			cache: false,
			success: function(branch) {
				_branch = branch;
			},
			error: function(xhr, type) {
				_branch = null;
			}
		});
	}
	
	return {
	
		getCurrentUser : function() {
			_getUser();
			return _user;
		},
		
		getSystemInformation : function() {
			_getSysInfo();
			return _sysInfo;
		},
		
		logout : function() {
			_logout();
		},
		
		setProfile : function(params) {
			_setProfile(params);
		},
		
		getProfiles : function(params) {
			_getProfiles(params);
			return _profiles;
		},
		
		getQueueServiceData : function(params) {
			_getQueueServiceData(params);
			return _serviceData;
		},
		
		getBranches : function() {
			_getBranches();
			return _branches;
		},
		
		getBranch : function(branchId) {
			_getBranch(branchId);
			return _branch;
		},
		
		getQueueData : function(branchId, callback) {
			_getQueueData(branchId, callback);
		},
		
		getWorkstationData : function(branchId, callback) {
			_getWorkstationData(branchId, callback);
		},

		getBranchVariables : function(branchId) {
			_getBranchVariables(branchId);
			return _branchVariables;
		},

		setBranchVariable : function(branchId,name,value) {
			_setBranchVariable(branchId,name,value);
		},		
		
		getServices : function() {
			_getServices();
			return _services;
		},

		getVariable : function(params) {
			_getVariable(params);
			return _variableValue;
		}		
	
	};

})(jQuery);