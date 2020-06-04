$(function () {
	const trueNames = {
		tickets: {
			name: "TICKETS",
			fullName: "Ticket count",
			icon: "fa fa-ticket",
		},
		served: {
			name: "SERVED",
			fullName: "Served customer count",
			icon: "fa fa-handshake-o",
		},
		waiting: {
			name: "WAITING",
			fullName: "Waiting customer count",
			icon: "fa fa-users",
		},
		noShow: {
			name: "NO SHOW",
			fullName: "Noshow count",
			icon: "fa fa-user-o",
		},
		rejected: {
			name: "REJECT",
			fullName: "Reject count",
			icon: "fa fa-frown-o",
		},
		removed: {
			name: "REMOVED",
			fullName: "Removed customer count",
			icon: "fa fa-trash",
		},
		averageWaitingTime: {
			name: "AWT",
			fullName: "Avg waiting time",
			icon: "fa fa-spinner",
		},
		averageServingTime: {
			name: "AST",
			fullName: "Avg serving time",
			icon: "fa fa-hourglass-half",
		},
		maxWaitingTime: {
			name: "MWT",
			icon: "fa fa-hourglass-end",
		},
		maxServingTime: {
			name: "MST",
			fullName: "Max serving time",
			icon: "fa fa-hourglass",
		},
		firstTicketTime: {
			name: "FTT",
			fullName: "First ticket time",
			icon: "fa fa-sign-in",
		},
		lastTicketTime: {
			name: "LTT",
			fullName: "Last ticket time",
			icon: "fa fa-sign-out",
		},
		alert: {
			name: "Served percent",
			fullName: "Served percent",
			icon: "fa fa-percent",
		},
	};
	const cardPreloader = `<div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div><div class="card-item card-item-preloader"><p>Card</p><p>00:00:00</p></div>`;
	const mainLink = "/heatmap";
	let searchText = "";
	let departmentsObject = {};
	const BASE_URL = "http://10.0.22.36:8080/QmaticMap/";
	const GET_DEPARTMENTS_NAME = "getDepartmentNamesData";
	const GET_DEPARTMENT_DATA = "getDepartmentsData";
	const GET_DEPARTMENT = "getTotalBranchByDepartmentPagination";
	const GET_QUEUES_DATA = "getDepartmentQueuesData";
	const QMATIC_GET_PERCENT = "getMapPercentData";
	const TABLE = document.getElementById("table");
	const TABLE_TOP = document.getElementById("table-top");
	const TABLE_PRELOADER_TOP = document.getElementById("table-preloader-top");

	const urlParams = new URLSearchParams(window.location.search);
	const BRANCH_ID = urlParams.get("branch") || 1;

	let currDepartmentName = "";
	let currDepartmentId;
	let cards = {};
	let timeoutID;

	const nameTag = document.getElementById("branch-name");
	const TABLE_PRELOADER = document.getElementById("table-preloader");

	const fetchNames = async () => {
		const response = await fetch(BASE_URL + GET_DEPARTMENTS_NAME, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				branchId: BRANCH_ID,
			}),
		});
		const data = await response.json();
		return data;
	};

	const fetchData = async () => {
		const OLD_ID = currDepartmentId;
		const response = await fetch(BASE_URL + GET_DEPARTMENT_DATA, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				departmentId: currDepartmentId,
			}),
		});
		const data = await response.json();
		return {
			data: data,
			oldId: OLD_ID,
		};
	};

	const fetchQueues = async () => {
		const OLD_ID = currDepartmentId;
		const response = await fetch(BASE_URL + GET_QUEUES_DATA, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				departmentId: currDepartmentId,
			}),
		});
		const data = await response.json();
		return {
			response: data,
			oldId: OLD_ID,
		};
	};

	const getDepartmentSearch = async () => {
		Object.values(departmentsObject).forEach((item) => {
			item.id == currDepartmentId
				? (currDepartmentName = item.departmentName)
				: null;
		});
		const response = await fetch(BASE_URL + GET_DEPARTMENT, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				start: 1,
				count: 1,
				departmentName: currDepartmentName,
				name: "%" + searchText + "%",
			}),
		});
		const data = await response.json();
		return data;
	};

	fetchNames()
		.then((response) => {
			departmentsObject = response.departmentNames;
			setFirstDepartment(response.departmentNames);
			setBranchName(response.branchName);
			drowNavigation(response.departmentNames);
		})
		.then(() => {
			setData();
		});

	const setData = () => {
		fetchData().then((response) => {
			if (response.oldId === currDepartmentId) {
				parseCards(response.data);
				drowCards();
			}
			clearTimeout(timeoutID);
			// timeoutID = setTimeout(setData, 8000);
		});
		fetchQueues().then((response) => {
			if (response.oldId === currDepartmentId) {
				drowQueues(response.response);
				addTippy();
			}
		});
		drawTopTable();
	};

	const setBranchName = (name) => {
		nameTag.innerHTML = name;
		searchText = name;
	};

	const setPreloaders = () => {
		const CARD_WRAP = document.getElementsByClassName("cards")[0];
		TABLE.style.display = "none";
		TABLE_TOP.style.display = "none";
		TABLE_PRELOADER.style.display = "block";
		TABLE_PRELOADER_TOP.style.display = "block";
		CARD_WRAP.innerHTML = cardPreloader;
	};

	const setFirstDepartment = (departments) => {
		const ID = departments[0].id;
		currDepartmentId = ID;
	};

	const addTippy = () => {
		tippy(".AWT", {
			content: "Average waiting time",
		});
		tippy(".AST", {
			content: "Average serving time",
		});
		tippy(".MWT", {
			content: "Max waiting time",
		});
		tippy(".MST", {
			content: "Max serving time",
		});
		tippy(".FTT", {
			content: "First ticket time",
		});
		tippy(".LTT", {
			content: "Last ticket time",
		});
	};

	const topTableHeader = `<thead><tr><td>FTE</td><td>Online user</td><td>Vacation</td><td>Trip to</td><td>Trip from</td></tr></thead>`;

	const topTableWrap = (header, body) => {
		return `<table class="table table-striped table-top" id="table-top" style="display: table; opacity: 1;">
					${header}
					${body}
				</table>`;
	};

	const drowTopTableUI = (header, body) => {
		let tableHtml = topTableWrap(header, body);
		document.getElementById("table-top").innerHTML = tableHtml;
	};

	const drawTopTable = () => {
		getDepartmentSearch().then((response) => {
			const carsWrap = document.getElementsByClassName("cards")[0];
			const {
				id,
				alert,
				factualEmployee,
				currentEmployee,
				vacation,
				tripTo,
				tripFrom,
			} = response[0];
			let body = `<tbody>
							<tr>
								<td>${factualEmployee}</td>
								<td>${currentEmployee}</td>
								<td>
								${
									vacation == 0
										? vacation
										: `<span style="text-decoarion: underline; color: blue; cursor: pointer;" class="vacation-button" data-branchId="${id}" data-departmentForRequest="${currDepartmentName}">${vacation}</span>`
								}
								</td>
								<td>${tripTo}</td>
								<td>${tripFrom}</td>
							</tr>
						</tbody>`;
			drowTopTableUI(topTableHeader, body);
			document.getElementById("table-preloader-top").style.display = "none";
			document.getElementById("table-top").style.display = "table";
			setVacationActions();
		});
	};

	const navigationItem = (element, index) =>
		`<li data-id="${element.id}"
		data-department="${
			element.departmentName
		}" class="nav-item"><a class="nav-link ${
			index === 0 ? "active" : ""
		}"  data-toggle="tab" href="#tab-i_3">${element.departmentName}</a></li>`;

	const drowNavigation = (data) => {
		let NavName = "";
		data.forEach((element, index) => {
			NavName += navigationItem(element, index);
		});
		document.getElementsByClassName("nav-tabs")[0].innerHTML = NavName;
		addEventTonavigation();
	};

	const parseCards = (data) => {
		Object.keys(data).forEach((element) => {
			if (element !== "queueList") {
				cards[element] = data[element];
			}
		});
	};

	const pasreQueues = async (queuesData) => {
		await (queues = queuesData);
	};

	const cardItem = (element, is3d) => `
					<div class="${
						!is3d
							? `card col-2 top-card top-card-active ${trueNames[element].name}`
							: `card col-3 top-card top-card-active ${trueNames[element].name}`
					}" id="customersWaiting-wrap">
						<div class="card-body">
							<div class="row">
								<div class="col-12">
									<p class="card-subtitle text-muted fw-500">
									${trueNames[element].name}
									</p>
									<h3 class="text-success mt-2" id="customersWaiting">
									${cards[element] === null ? "---" : cards[element]}
									${trueNames[element].name == "Alert" ? "%" : ""}
									</h3>
									<div class="left-card-icon">
										<i class="${trueNames[element].icon}" aria-hidden="true"></i>
									</div>
								</div>
								<div class="col-12">
									<div class="progress mt-3 mb-1" style="height: 6px;">
										<div class="progress-bar bg-success" role="progressbar" style="width: 83%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
									</div>
								</div>
							</div>
						</div>
					</div>`;

	const drowCards = () => {
		let cardsHtml = ``;
		Object.keys(cards).forEach((element) => {
			if (element != "alert") return;
			cardsHtml += cardItem(element, true);
		});
		Object.keys(cards).forEach((element) => {
			if (element == "alert") return;
			if (
				element == "lastTicketTime" ||
				element == "firstTicketTime" ||
				element == "maxWaitingTime" ||
				element == "averageServingTime" ||
				element == "maxServingTime"
			) {
				return;
			} else {
				cardsHtml += cardItem(element, true);
			}
		});
		Object.keys(cards).forEach((element) => {
			if (element == "alert") return;
			if (
				element == "lastTicketTime" ||
				element == "firstTicketTime" ||
				element == "maxWaitingTime" ||
				element == "averageServingTime" ||
				element == "maxServingTime"
			) {
				cardsHtml += cardItem(element, false);
			}
		});
		document.getElementsByClassName("cards")[0].innerHTML = cardsHtml;
	};

	const drowQueuesRow = (item, index) => {
		return `
		<tr>
			<th scope="row">${index + 1}</th>
			<td>${item["name"]}</td>
			<td>${item["tickets"]}</td>
			<td>${item["served"]}</td>
			<td>${item["waiting"]}</td>
			<td>${item["noShow"]}</td>
			<td>${item["rejected"]}</td>
			<td>${item["removed"]}</td>
			<td>${item["averageWaitingTime"]}</td>
			<td>${item["averageServingTime"]}</td>
			<td>${item["maxWaitingTime"]}</td>
			<td>${item["maxServingTime"]}</td>
			<td>${item["firstTicketTime"] === null ? "---" : item["firstTicketTime"]}</td>
			<td>${item["lastTicketTime"] === null ? "---" : item["lastTicketTime"]}</td>
		</tr>
		`;
	};

	const drowQueues = (queues) => {
		if (queues === undefined) {
			document.getElementById("tbody").innerHTML = `<tr><td>No queue</td></tr>`;
			return;
		}
		let rows = ``;
		queues.forEach((element, index) => {
			rows += drowQueuesRow(element, index);
		});
		document.getElementById("tbody").innerHTML = rows;
		document.getElementById("table-preloader").style.display = "none";
		document.getElementById("table").style.display = "table";
	};

	const setActiveNavigation = (currItem) => {
		const navItems = document.getElementsByClassName("navigation-item");
		Object.keys(navItems).forEach((element) => {
			navItems[element].classList.remove("navigation-item-active");
			currItem.classList.add("navigation-item-active");
		});
	};

	const addEventTonavigation = () => {
		const navItem = document.getElementsByClassName("nav-item");
		Object.keys(navItem).forEach((element) => {
			navItem[element].addEventListener("click", function () {
				const ID = this.getAttribute("data-id");
				currDepartmentId = ID;
				setActiveNavigation(this);
				setPreloaders();
				clearTimeout(timeoutID);
				setData();
			});
		});
	};

	//action
	const menuBtn = document.getElementsByClassName("menu-btn")[0];
	const asideBack = document.getElementsByClassName("aside-back")[0];
	const aside = document.getElementsByClassName("aside")[0];
	const asideClose = document.getElementById("aside-close");

	/***
	 * cusotm search
	 */

	const getMapPercentData = async () => {
		const response = await fetch(BASE_URL + QMATIC_GET_PERCENT);
		const data = await response.json();
		return data;
	};

	const inputElement = document.getElementById("search-td");
	const searchList = document.getElementById("search-list");

	getMapPercentData().then((response) => {
		drowSearchsItems(response);
	});

	function setActionsForListItem() {
		const listForAction = document.getElementsByClassName("list-group-item");
		const branchesLists = document.querySelectorAll(".link-item");
		// console.log("setActionsForListItem -> branchesLists", branchesLists);
		Object.keys(branchesLists).forEach((item) => {
			branchesLists[item].onclick = function (e) {
				COUNTER_INPUT.value = "";
				DEPARTMENT_INPUT.value = "";
			};
		});
		Object.keys(listForAction).forEach((item) => {
			listForAction[item].onclick = function () {
				inputValue = this.getAttribute("data-name");
				var reg = new RegExp(inputValue, "i");
				regValue = reg;
				inputLength = inputValue.length;

				deleteBranches();
				if (whichShown === "time") {
					drowBranchesTime(responseAllFilials);
					drowBranchesTimeBaku(responseBakuFiliasl);
				} else {
					drowBranchesPercent(responseAllFilials);
					drowBranchesPercentBaku(responseBakuFiliasl);
				}
			};
		});
	}

	function drowSearchsItems(data) {
		let items = `<a class="dropdown-item counters-item no-data" href="#">No data found</a>`,
			counterItems = `<a class="dropdown-item counters-item no-data" href="#">No data found</a>`,
			departmentItems = `<a class="dropdown-item counters-item no-data" href="#">No data found</a>`;

		data.forEach((dataItem) => {
			let item = ``,
				counterItem = ``,
				departmentItem = ``;
			item += `<div class="list-group-item" data-id="${dataItem.id}" data-name="${dataItem.name}">
					<span>${dataItem.name}</span>
				</div>`;
			counterItem += `<a class="dropdown-item counters-item link-item" href="${mainLink}/counters/?branch=${dataItem.id}"  data-name="${dataItem.name}">${dataItem.name}</a>`;
			departmentItem += `<a class="dropdown-item  departments-item link-item" href="${mainLink}/departments/?branch=${dataItem.id}"  data-name="${dataItem.name}">${dataItem.name}</a>`;
			items += item;
			counterItems += counterItem;
			departmentItems += departmentItem;
		});

		document.getElementById("counter-list").innerHTML = counterItems;
		document.getElementById("department-list").innerHTML = departmentItems;
		setActionsForListItem();
	}

	const setNoData = (list, regExp, searchType) => {
		let noDatas = document.querySelectorAll(".no-data");
		noDatas.forEach((item) => (item.style.display = "none"));

		const listBool = Object.values(list).some((item) =>
			regExp.test(item.getAttribute("data-name")),
		);
		if (searchType == "counters") {
			!listBool
				? (document
						.getElementById("counter-list")
						.querySelector(".no-data").style.display = "block")
				: null;
		} else if (searchType == "departments") {
			!listBool
				? (document
						.getElementById("department-list")
						.querySelector(".no-data").style.display = "block")
				: null;
		} else {
			!listBool
				? (document
						.getElementById("department-list")
						.querySelector(".no-data").style.display = "block")
				: null;
		}
	};

	function showNeedListItem(value, searchType) {
		let listItems;
		if (searchType == "counters") {
			listItems = document.getElementsByClassName("counters-item");
		} else if (searchType == "departments") {
			listItems = document.getElementsByClassName("departments-item");
		} else {
			listItems = document.getElementsByClassName("list-group-item");
		}

		var reg = new RegExp(value, "i");
		Object.keys(listItems).forEach((item) => {
			let name = listItems[item].getAttribute("data-name");
			if (reg.test(name)) {
				listItems[item].style.display = "block";
			} else {
				listItems[item].style.display = "none";
			}
		});
		setNoData(listItems, reg, searchType);
	}

	const COUNTER_INPUT = document.getElementById("counter-input");
	const DEPARTMENT_INPUT = document.getElementById("department-input");

	$("#search").on("input", function (e) {
		const VAL = this.value;
		showNeedListItem(VAL);
		if (VAL.length < 1) {
			searchList.style.transform = "scaleY(0)";
			var reg = new RegExp("", "i");
			regValue = reg;
			deleteBranches();
			if (whichShown === "time") {
				drowBranchesTime(responseAllFilials);
				drowBranchesTimeBaku(responseBakuFiliasl);
			} else {
				drowBranchesPercent(responseAllFilials);
				drowBranchesPercentBaku(responseBakuFiliasl);
			}
		}
	});

	COUNTER_INPUT.onfocusin = function () {
		$(this).parent().siblings("#counter-list").show();
	};

	DEPARTMENT_INPUT.onfocusin = function () {
		$(this).parent().siblings("#department-list").show();
	};

	$("#counter-input").on("input", function (e) {
		const VAL = this.value;
		showNeedListItem(VAL, "counters");
	});

	$("#department-input").on("input", function (e) {
		const VAL = this.value;
		showNeedListItem(VAL, "departments");
	});

	$.ajax({
		url: "/rest/servicepoint/user/",
		type: "GET",
		success: function (data) {
			$("#usrnm").text(data["fullName"]);
			$(".img-circle").attr(
				"src",
				"/heatmap/assets/images/profile/" + data["userName"] + ".jpg",
			);
		},
	});

	// vacation
	const GET_VACATION = "getVacationUser";

	const fetchVacation = async (department, branch) => {
		const response = await fetch(BASE_URL + GET_VACATION, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				departmentName: department,
				branchId: branch,
			}),
		});
		const data = await response.json();
		return data;
	};

	const getVacationDataForModal = (dep, branch) => {
		fetchVacation(dep, branch).then((response) => {
			drowVacatin(response);
		});
	};

	const setVacationActions = () => {
		const vacations = document.getElementsByClassName("vacation-button");
		Object.keys(vacations).forEach((item) => {
			vacations[item].onclick = function () {
				const department = this.getAttribute("data-departmentForRequest");
				const branch = this.getAttribute("data-branchId");
				vModalWrapShow();
				vLoaderShow();
				getVacationDataForModal(department, branch);
			};
		});
	};
});
