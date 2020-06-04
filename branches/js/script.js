/**
 * @format
 * @variables
 */
$(function () {
	const tablePreloader = document.getElementsByClassName("preloader-table")[0];
	const table = document.getElementById("table");
	const tableMainPreloader = document.getElementById("preloader-table");
	const tableWrap = document.getElementsByClassName("table-wrap")[0];
	const paginationWrap = document.getElementById("pagination");

	const mainLink = "/heatmap";
	const BASE_URL = "http://10.0.22.36:8080/QmaticMap/";
	const GET_TOTAL = "getTotalBranch";
	const GET_TOTAL_BY_PAGINATION = "getTotalBranchByPagination";
	const GET_DEPARTMENT = "getTotalBranchByDepartmentPagination";
	const GET_TOTAL_SIZE = "getBranchListSize";
	const GET_DEPARTMENT_SIZE = "getBranchListSizeByDep";
	const GET_VACATION = "getVacationUser";
	const COUNT_PER_PAGE = 15;
	const searchList = document.getElementById("search-list");

	let elementSize = 0;
	let startPaginationData = 1;
	let tableView = "Total";
	let oldTableView = "Total";
	let requestDepartment = "Xidmet";
	let regValue, inputLength;
	let timerId;
	let searchText = "";

	let requestBranches = [];

	let answer = [];

	/**
	 * @@Checkers
	 */

	let oldRequestDepartment = "Xidmet",
		oldRequestPagination = 1;

	const getTotalBranches = async () => {
		const OLD_PAGINATION = startPaginationData;
		const OLD_DEPARTMENT = requestDepartment;
		isRequest = true;
		const response = await fetch(BASE_URL + GET_TOTAL_BY_PAGINATION, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				start: (startPaginationData - 1) * COUNT_PER_PAGE + 1,
				count: COUNT_PER_PAGE,
				name: "%%",
			}),
		});
		const data = await response.json();
		return {
			response: data,
			pagination: OLD_PAGINATION,
			department: OLD_DEPARTMENT,
			oldSearch: searchText,
		};
	};

	const getTotalBranchesSearch = async () => {
		const OLD_PAGINATION = startPaginationData;
		const OLD_DEPARTMENT = requestDepartment;
		const OLD_SEARCH = searchText;
		isRequest = true;
		const response = await fetch(BASE_URL + GET_TOTAL_BY_PAGINATION, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				start: 1,
				count: 500,
				name: "%" + searchText + "%",
			}),
		});
		const data = await response.json();
		return {
			response: data,
			pagination: OLD_PAGINATION,
			department: OLD_DEPARTMENT,
			oldSearch: OLD_SEARCH,
		};
	};

	const getDepartment = async () => {
		const OLD_PAGINATION = startPaginationData;
		const OLD_DEPARTMENT = requestDepartment;
		isRequest = true;
		const response = await fetch(BASE_URL + GET_DEPARTMENT, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				start: (startPaginationData - 1) * 10 + 1,
				count: COUNT_PER_PAGE,
				departmentName: requestDepartment,

				name: "%%",
			}),
		});
		const data = await response.json();
		return {
			response: data,
			pagination: OLD_PAGINATION,
			department: OLD_DEPARTMENT,
		};
	};

	const getDepartmentSearch = async () => {
		const OLD_PAGINATION = startPaginationData;
		const OLD_DEPARTMENT = requestDepartment;
		isRequest = true;
		const response = await fetch(BASE_URL + GET_DEPARTMENT, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				start: (startPaginationData - 1) * 10 + 1,
				count: COUNT_PER_PAGE,
				departmentName: requestDepartment,
				name: "%" + searchText + "%",
			}),
		});
		const data = await response.json();
		return {
			response: data,
			pagination: OLD_PAGINATION,
			department: OLD_DEPARTMENT,
		};
	};

	const getDepartmentSize = async () => {
		const response = await fetch(BASE_URL + GET_DEPARTMENT_SIZE, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				depName: requestDepartment,
				name: "%" + searchText + "%",
			}),
		});
		const data = await response.json();
		return data;
	};

	const getTotalElementSize = async () => {
		const response = await fetch(BASE_URL + GET_TOTAL_SIZE, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				name: "%" + searchText + "%",
			}),
		});
		const data = await response.json();
		return data;
	};

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

	const changeTableView = (view) => {
		tableView = view === "Total" ? "Total" : "department";
	};

	const changeDepartment = (department) => {
		requestDepartment = department;
	};
	const drowPaginationInfo = () => {
		if (elementSize == 0) {
			return;
		}
		let toPag = startPaginationData * COUNT_PER_PAGE;
		document.getElementById("summ-pag").innerHTML = elementSize;

		document.getElementById("to-pag").innerHTML =
			toPag > elementSize ? elementSize : startPaginationData * COUNT_PER_PAGE;
		document.getElementById("start-pag").innerHTML =
			(startPaginationData - 1) * COUNT_PER_PAGE + 1;
		document.getElementsByClassName("dataTables_info")[0].style.display =
			"flex";
	};
	const addTippy = () => {
		console.log("fte", tippy);
		tippy("#fte", {
			content: "Full time equivalent",
		});
		tippy("#mft", {
			content: "Max free time",
		});
		tippy(".counters", {
			content: "Counters",
		});
		tippy(".departments", {
			content: "Departments",
		});
		tippy("#osp", {
			content: "Open service points",
		});
		tippy("#csp", {
			content: "Closed service point",
		});
	};

	const callRequest = () => {
		if (tableView === "Total") {
			if (searchText.length > 2) {
				getTotalBranchesSearch()
					.then((response) => {
						const pag = response.pagination,
							dep = response.department,
							respOldSearch = response.oldSearch;
						if (
							pag === startPaginationData &&
							dep === requestDepartment &&
							respOldSearch === searchText
						) {
							isRequest = false;
							requestBranches = response;

							drowTotal(response.response);
							addTippy();
							getTotalElementSize().then((response) => {
								elementSize = response.size;
								if (elementSize < 1) {
									document.getElementById("alert-cant-save").style.right =
										"40px";
								}
								drowPaginationInfo();
								drowPagination();
								clearTimeout(timerId);
								clearTimeout(timerId);
								timerId = setTimeout(callRequest, 9000);
							});
						}
					})
					.catch((err) => {
						throw err;
					});
			} else {
				getTotalBranches()
					.then((response) => {
						const pag = response.pagination,
							dep = response.department;
						if (
							pag === startPaginationData &&
							dep === requestDepartment &&
							searchText === ""
						) {
							isRequest = false;
							requestBranches = response;
							drowPaginationInfo();
							drowTotal(response.response);
							addTippy();
							getTotalElementSize().then((response) => {
								elementSize = response.size;
								drowPaginationInfo();
								drowPagination();
								clearTimeout(timerId);
								clearTimeout(timerId);
								timerId = setTimeout(callRequest, 9000);
							});
						}
					})
					.catch((err) => {
						throw err;
					});
			}
		} else {
			if (searchText.length > 2) {
				getDepartmentSearch().then((response) => {
					if (response.response.length == 0) {
						tablePreloader.style.display = "none";
						table.style.display = "table";
						hideLoader();
						document.getElementById("table").innerHTML = "No data found";
					}
					const pag = response.pagination,
						oldSearch = searchText,
						dep = response.department;
					if (
						pag === startPaginationData &&
						dep === requestDepartment &&
						oldSearch === searchText
					) {
						isRequest = false;
						requestBranches = response;
						drowPaginationInfo();
						drowDepartment(response.response);
						addTippy();
						setVacationActions();
						getDepartmentSize().then((response) => {
							elementSize = response.size;
							drowPagination();
							clearTimeout(timerId);
							clearTimeout(timerId);
							timerId = setTimeout(callRequest, 9000);
						});
					}
				});
			} else {
				getDepartment().then((response) => {
					const pag = response.pagination,
						dep = response.department;
					if (
						pag === startPaginationData &&
						dep === requestDepartment &&
						searchText === ""
					) {
						isRequest = false;
						requestBranches = response;
						drowPaginationInfo();
						drowDepartment(response.response);
						addTippy();
						setVacationActions();
						getDepartmentSize().then((response) => {
							elementSize = response.size;
							drowPagination();
							clearTimeout(timerId);
							clearTimeout(timerId);
							timerId = setTimeout(callRequest, 9000);
						});
					}
				});
			}
		}
	};

	callRequest();

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

	/**
	 * custom search
	 */

	const getMapPercentData = async () => {
		const response = await fetch(BASE_URL + "/getMapPercentData");
		const data = await response.json();
		return data;
	};

	getMapPercentData().then((response) => {
		drowSearchItems(response);
	});

	function drowSearchItems(data) {
		let items = ``;

		data.forEach((dataItem) => {
			let item = ``;
			item += `<div class="list-group-item" data-id="${dataItem.id}" data-name="${dataItem.name}">
					<span>${dataItem.name}</span>
				</div>`;
			items += item;
		});
		document.getElementById("search-list").innerHTML = items;
		setActionsForListItem();
	}

	/**
	 *
	 * @param {*} data drowers
	 */

	const tableHeaders = `<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col" class="actions">Actions</th>
						<th scope="col">Branch name</th>
						<th scope="col">Served percent</th>
						<th scope="col">Total visits</th>
						<th scope="col">Served</th>
						<th scope="col">Waiting</th>
						<th scope="col">Free users</th>
						<th scope="col">
							<span id="mft">MFT</span>
						</th>
						<th scope="col">
							<span id="osp">OSP</span>
						</th>
						<th scope="col">
							<span id="csp">CSP</span>
						</th>
					</tr>
					</thead>
				<tbody id="body">`;

	const drowRow = (data, i) => {
		return `<tr>
				<th scope="row">${(startPaginationData - 1) * COUNT_PER_PAGE + 1 + i}</th>
				<td>
					<div class="d-flex justify-content-center">
						<a
							type="button"
							class="btn btn-counters mr-1 counters"
							data-tippy-content="Counters"
							href="/heatmap/counters/?branch=${data.id}"
						>
							C
						</a>
						<a
							type="button"
							class="btn btn-department departments"
							data-tippy-content="Departments"
							href="/heatmap/departments/?branch=${data.id}"
						>
							D
						</a>
					</div>
				</td>
				<td>${data.branchName}</td>
				<td>${data.alert >= 0 ? data.alert : "---"}</td>
				<td>${data.totalVisits}</td>
				<td>${data.served}</td>
				<td>${data.waiting}</td>
				<td>${data.freeUsers}</td>
				<td>${data.maxFreeTime}</td>
				<td>${data.openServicePoints}</td>
				<td>${data.closedServicePoints}</td>
			</tr>`;
	};

	const drowTotal = (data) => {
		let tableRows = tableHeaders,
			tableRow = ``;

		for (let i = 0; i < data.length; i++) {
			if (inputLength > 2) {
				if (regValue.test(data[i].branchName)) {
					tableRow += drowRow(data[i], i);
				}
			} else {
				tableRow += drowRow(data[i], i);
			}
		}
		if (tableRow === "") {
			document.getElementById("table").innerHTML = "No data find!";
			tableWrap.style.border = "none";
			paginationWrap.style.display = "none";
			return;
		}
		tableRows += tableRow + `</tbody>`;
		document.getElementById("table").innerHTML = tableRows;
		tablePreloader.style.display = "none";
		table.style.display = "table";
		paginationWrap.style.display = "flex";
		hideLoader();
	};

	const drowRowDepartment = (data, i) => {
		return `<tr>
				<th scope="row">${(startPaginationData - 1) * COUNT_PER_PAGE + 1 + i}</th>
				<td>
					<div class="d-flex justify-content-center">
						<a
							type="button"
							class="btn btn-counters mr-1 counters"
							href="/heatmap/counters/?branch=${data.id}"
						>
							C
						</a>
						<a
							type="button"
							class="btn btn-department departments"
							href="/heatmap/departments/?branch=${data.id}"
						>
							D
						</a>
					</div>
				</td>
				<td>${data.branchName}</td>
				<td>${data.alert >= 0 ? data.alert : "---"}</td>
				<td>${data.totalVisits}</td>
				<td>${data.served}</td>
				<td>${data.waiting}</td>
				<td>${data.factualEmployee}</td>
				<td>${data.currentEmployee}</td>
				<td>${
					data.vacation == 0
						? data.vacation
						: `<span style="text-decoarion: underline; color: blue; cursor: pointer;" class="vacation-button" data-branchId="${data.id}" data-departmentForRequest="${requestDepartment}">${data.vacation}</span>`
				}</td>
				<td>${data.tripTo}</td> 
				<td>${data.tripFrom}</td>
			</tr>`;
	};

	const tableHeaderDepartment = `<thead>
										<th scope="col">#</th>
										<th scope="col" class="actions">Actions</th>
										<th scope="col">Branch name</th>
										<th scope="col">Served percent</th>
										<th scope="col">Total visits</th>
										<th scope="col">Served</th>
										<th scope="col">Waiting</th>
										<th scope="col">
											<div id="fte">FTE</div>
										</th>
										<th scope="col">Online user</th>
										<th scope="col">Vacation</th>
										<th scope="col">Trip to</th>
										<th scope="col">Trip from</th>
										</tr>
									</thead>
								<tbody id="body">`;

	const drowDepartment = (data) => {
		let tableRows = tableHeaderDepartment,
			tableRow = ``;
		for (let i = 0; i < data.length; i++) {
			if (inputLength > 2) {
				if (regValue.test(data[i].branchName)) {
					let rowInner = drowRowDepartment(data[i], i);
					tableRow += rowInner;
				}
			} else {
				let rowInner = drowRowDepartment(data[i], i);
				tableRow += rowInner;
			}
		}
		tableRows += tableRow;
		document.getElementById("table").innerHTML = tableRows;
		if (tableRow === "") {
			document.getElementById("table").innerHTML = "No data find!";
			tableWrap.style.border = "none";
			paginationWrap.style.display = "none";
			return;
		}
		tablePreloader.style.display = "none";
		table.style.display = "table";
		paginationWrap.style.display = "flex";
		hideLoader();
	};

	const drowVacatin = (vData) => {
		let vItems = ``;
		vData.forEach((item) => {
			let vItem = `<tr>`;
			vItem += `<th scope="row">${item.fulname}</th>`;
			vItem += `<th>${item.from}</th>`;
			vItem += `<th>${item.to}</th>`;
			vItems += vItem;
		});
		document.getElementById("v-body").innerHTML = vItems;
		vModalShow();
		vLoaderHide();
	};

	// actions
	/**
	 *
	 * @param {*} navigationItems
	 */

	const setNavigationListener = (navigationItems) => {
		Object.keys(navigationItems).forEach((item) => {
			navButton[item].addEventListener("click", function () {
				document.getElementsByClassName("dataTables_info")[0].style.display =
					"none";
				startPaginationData = 1;
				const isActive = this.classList.contains("navigation-item-active");
				const view = this.getAttribute("data-view");
				const department = this.getAttribute("data-department");
				changeTableView(view);
				changeDepartment(department);
				startPaginationData = 1;
				showTableLoading();
				showLoader();
				callRequest();
				oldTableView = department;
				if (!isActive) {
					Object.keys(navButton).forEach((item) => {
						navButton[item].classList.remove("navigation-item-active");
					});
					this.classList.add("navigation-item-active");
				}
			});
		});
	};

	const navButton = document.getElementsByClassName("nav-item");
	setNavigationListener(navButton);

	const showTableLoading = () => {
		const isEqual = oldTableView === tableView;
		paginationWrap.style.display = "none";
		if (!isEqual) {
			tablePreloader.style.display = "block";
			table.style.display = "none";
		} else {
			tablePreloader.style.display = "noen";
			table.style.display = "table";
		}
	};

	const showLoader = () => {
		table.style.display = "none";
		tableMainPreloader.style.display = "flex";
		paginationWrap.style.display = "none";
	};
	showLoader();
	const hideLoader = () => {
		table.style.display = "table";
		tableMainPreloader.style.display = "none";
		paginationWrap.style.display = "flex";
	};

	/**
	 * vacatin madal
	 */
	const vModalWrapShow = () =>
		(document.getElementById("vm-wrap").style.display = "flex");

	const vModalWrapHide = () =>
		(document.getElementById("vm-wrap").style.display = "none");

	const vModalShow = () =>
		(document.getElementById("vm").style.display = "block");
	const vModalHide = () =>
		(document.getElementById("vm").style.display = "none");

	const vLoaderShow = () =>
		(document.getElementById("vm-loader").style.display = "block");

	const vLoaderHide = () =>
		(document.getElementById("vm-loader").style.display = "none");

	const vModal = document.getElementById("vm-wrap");
	vModal.onclick = () => {
		vModalWrapHide();
		vLoaderShow();
		vModalHide();
	};
	/**
	 * pagination
	 */

	const setPaginationActions = () => {
		const pagination = document.getElementsByClassName("page-link");
		Object.keys(pagination).forEach((item, index) => {
			pagination[item].addEventListener("click", function () {
				Object.keys(pagination).forEach((item) => {
					pagination[item].classList.remove("active");
				});
				document.getElementsByClassName("dataTables_info")[0].style.display =
					"none";
				this.classList.add("active");
				startPaginationData = parseInt(this.getAttribute("data-pagination"));
				showTableLoading();
				showLoader();
				callRequest();
			});
		});
	};

	const paginationItem = (startPaginationData, i) => {
		return `<li class="paginate_button page-item ${
			i === startPaginationData ? "active" : ""
		}""><a
				data-pagination="${i}
				href="#"
				aria-controls="bs4-table"
				data-dt-idx="1"
				tabindex="0"
				class="page-link"
				>${i}</a>
			</li>`;
	};

	const drowPagination = () => {
		let paginationItems = ``;
		let isNeed =
			elementSize / COUNT_PER_PAGE === parseInt(elementSize / COUNT_PER_PAGE);
		let count = isNeed
			? elementSize / COUNT_PER_PAGE
			: elementSize / COUNT_PER_PAGE + 1;
		if (count > 10) {
			const CENTER = parseInt(count / 2);

			if (startPaginationData > CENTER) {
				for (let i = 1; i < count; i++) {
					if (i < 2) {
						paginationItems += paginationItem(startPaginationData, i);
					} else if (i === 2) {
						paginationItems += `<div class="pagination-item pagination-item-disable" >...</div>`;
					} else if (i > 2 && i < startPaginationData - 3) {
						paginationItems = ``;
					} else if (
						i > startPaginationData - 3 &&
						i < startPaginationData + 3
					) {
						paginationItems += paginationItem(startPaginationData, i);
					} else if (i > startPaginationData + 3 && i < count) {
						paginationItems = ``;
					} else if (i === count) {
						paginationItems += paginationItem(startPaginationData, i);
					}
				}
			} else {
				for (let i = 1; i < count; i++) {
					paginationItems += paginationItem(startPaginationData, i);
				}
			}
		} else {
			for (let i = 1; i < count; i++) {
				paginationItems += paginationItem(startPaginationData, i);
			}
		}

		document.getElementById("pagination").innerHTML = paginationItems;
		setPaginationActions();
	};

	/***
	 * cusotm search
	 */

	const inputElement = document.getElementById("search-td");

	getMapPercentData().then((response) => {
		drowSearchsItems(response);
	});

	function setActionsForListItem() {
		const listForAction = document.getElementsByClassName("list-group-item");
		const branchesLists = document.querySelectorAll(".link-item");
		Object.keys(branchesLists).forEach((item) => {
			branchesLists[item].onclick = function (e) {
				e.stopPropagation();
				COUNTER_INPUT.value = "";
				DEPARTMENT_INPUT.value = "";
				console.log(
					"branchesLists[item].onclick -> e.event.target",
					e.event.target,
				);
			};
		});
		Object.keys(listForAction).forEach((item) => {
			listForAction[item].onclick = function () {
				inputValue = this.getAttribute("data-name");
				searchText = inputValue;
				isSearch = true;
				$("#search").val(inputValue);
				document.getElementsByClassName("ion-android-search")[0].style.display =
					"none";
				document.getElementsByClassName("icon-close")[0].style.display =
					"block";
				clearTimeout(timerId);
				clearTimeout(timerId);
				clearTimeout(timerId);
				clearTimeout(timerId);
				showTableLoading();
				showLoader();
				callRequest();
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
		document.getElementById("search-list").innerHTML = items;
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
		searchList.style.transform = "scaleY(1)";
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

	$(".icon-close").click(function () {
		document.getElementsByClassName("dataTables_info")[0].style.display =
			"flex";
		$("#search").val("");
		searchList.style.transform = "scaleY(0)";
		searchText = "";
		clearTimeout(timerId);
		clearTimeout(timerId);
		clearTimeout(timerId);
		clearTimeout(timerId);
		showTableLoading();
		showLoader();
		callRequest();
	});
	$("#search").on("input", function (e) {
		const VAL = this.value;
		searchText = this.value;
		document.getElementsByClassName("ion-android-search")[0].style.display =
			"block";
		document.getElementsByClassName("icon-close")[0].style.display = "none";
		showNeedListItem(VAL);
		if (VAL.length < 1) {
			searchList.style.transform = "scaleY(0)";
			searchText = "";
			clearTimeout(timerId);
			clearTimeout(timerId);
			clearTimeout(timerId);
			clearTimeout(timerId);
			showTableLoading();
			showLoader();
			callRequest();
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

	document.onclick = function (e) {
		searchList.style.transform = "scaleY(0)";
	};
});
