$(function () {
	// constants
	const mainLink = "/heatmap";
	const BASE_URL = "http://10.0.22.36:8080/QmaticMap/";
	const GET_COUNT = "getBranchListSize";
	const GET_FTE = "getFteData";
	const INSER_DATA = "factualEmployee";
	const QMATIC_GET_PERCENT = "getMapPercentData";

	let isSearch = false;
	let COUNT_PER_PAGE = 213;
	let searchText = "";
	const TABLE = document.getElementById("table");
	const TABLE_SEARCH = document.getElementById("table-search");
	const TABLE_PRELOADER = document.getElementById("table-preloader");
	const ALERT_WRAPPER = document.getElementById("alert-wrapper");
	const TABLE_HEADER = document.getElementById("table-header");
	const saveBtn = document.getElementById("save");
	// search constants
	const inputElementTable = document.getElementById("search");

	// custom search constants
	const searchList = document.getElementById("search-list");

	const showLoadingIndicator = () => {
		TABLE.innerHTML = "";
		TABLE.style.height = "400px";
		TABLE_SEARCH.style.display = "none";
		document.getElementById("lds-spinner").style.display = "block";
	};

	const hideLoadingIndicator = () => {
		document.getElementById("lds-spinner").style.display = "none";
	};

	const getMapPercentData = async () => {
		const response = await fetch(BASE_URL + QMATIC_GET_PERCENT);
		const data = await response.json();
		return data;
	};

	const fetchSize = async () => {
		const response = await fetch(BASE_URL + GET_COUNT);
		const data = await response.json();
		return data;
	};

	let dataForInsert = {};
	let dataForFetch = {};
	let dataForInsertShadow = {};

	const inserData = async () => {
		let response;
		try {
			response = await fetch(BASE_URL + INSER_DATA, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(dataForInsert),
			});
		} catch (error) {
			console.log("inserData -> error", error);
		}

		const data = await response.json();
		return data;
	};

	const fetchData = async () => {
		const response = await fetch(BASE_URL + GET_FTE, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				start: 1,
				count: COUNT_PER_PAGE,
				name: "%%",
			}),
		});
		const data = await response.json();
		return data;
	};

	const fetchSearchData = async () => {
		const response = await fetch(BASE_URL + GET_FTE, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				start: 1,
				count: COUNT_PER_PAGE,
				name: `%${searchText}%`,
			}),
		});
		const data = await response.json();
		return data;
	};

	const drowDefaultUi = (response) => {
		drowTable(response);
		showTable();
		hideLoadingIndicator();
	};

	const drowSearchUi = (response) => {
		drowSearchTable(response);
		hideLoadingIndicator();
	};

	fetchSize().then((response) => {
		summData = response.size;
	});

	const setDefault = () => {
		fetchData().then((response) => {
			hideLoadingIndicator();
			drowDefaultUi(response);
			setActionForInputs();
		});
	};

	setDefault();

	const setSearch = () => {
		fetchSearchData().then((response) => {
			hideLoadingIndicator();
			drowSearchUi(response);
			setActionForInputs();
		});
	};

	const tHead = `
		<thead>
			<tr>
				<th scope="col">#</th>
				<th scope="col">Branch name</th>
				<th scope="col">Xidmet</th>
				<th scope="col">Satish</th>
				<th scope="col">Kassa</th>
				<th scope="col">Huquqi shexsler</th>
				<th scope="col">Kassa - Huquqi shexsler</th>
			</tr>
		</thead>`;

	const drowRowItem = (departmentData) => {
		return `<td>
				${
					departmentData.id !== 0
						? `<input class="input-changable" title="${
								departmentData.id
						  }" data-id="${
								departmentData.id
						  }" type='number' min='0' max='100' value='${
								departmentData === undefined ? "0" : departmentData.count
						  }'>`
						: `<span>N/A</span>`
				}
			</td>`;
	};
	const ITEMS = [3, 4, 1, 2, 0];

	const drowRow = ({ branchName, departmentCounts }, index) => {
		return `<tr data-name="${branchName}">
				<th scope="row">${index + 1}</th>
				<td>${branchName}</td>
				${ITEMS.map((item) => drowRowItem(departmentCounts[item])).join("")}
			</tr>`;
	};

	const drowTable = (data) => {
		let tableRows = tHead;
		TABLE.innerHTML =
			tableRows +
			data.map((item, index) => drowRow(item, index)).join("") +
			`</tbody>`;
		showTable();
		hideLoadingIndicator();
	};

	const drowSearchTable = (data) => {
		let tableRows = tHead,
			tableRow = ``;
		data.forEach((item) => {
			tableRow += drowRow(item);
		});
		tableRows += tableRow + `</tbody>`;
		if (tableRow == "") {
			document.getElementById("table-search-inner").innerHTML = `
			<tr>
			<th>Sorry, we dont have data for this request!..<span style="transform: scale(3)">🤷‍♂️</span> </th></tr>
		`;
			hideLoadingIndicator();
			showSearcgTable();
		} else {
			document.getElementById("table-search-inner").innerHTML = tableRows;
			showSearcgTable();
			hideLoadingIndicator();
		}
	};

	const showTable = () => {
		TABLE.style.height = "auto";
	};
	const showSearcgTable = () => (TABLE_SEARCH.style.display = "table");

	/**
	 * search
	 */

	inputElementTable.oninput = function (event) {
		searchText = event.target.value;
		let lengthSearch = searchText.length;
		if (lengthSearch > 0) {
			document.getElementsByClassName("ion-android-search")[0].style.display =
				"none";
			document.getElementsByClassName("icon-close")[0].style.display = "block";
		} else {
			document.getElementsByClassName("ion-android-search")[0].style.display =
				"block";
			document.getElementsByClassName("icon-close")[0].style.display = "none";
		}
		let reg = new RegExp(searchText, "i");
		let rows = document.querySelectorAll("tbody > tr");

		rows.forEach((item) => {
			let itemName = item.getAttribute("data-name");
			if (reg.test(itemName)) {
				item.style.display = "table-row";
			} else {
				item.style.display = "none";
			}
		});
	};

	const showNoDataToSave = () => {
		ALERT_WRAPPER.innerHTML = `<div class="alert alert-warning border-0" role="alert">
	No data to save!
	<button
			type="button"
			class="close"
			data-dismiss="alert"
			aria-label="Close"
		>
			<span aria-hidden="true">×</span>
			</button>
	</div>`;
		setTimeout(() => {
			ALERT_WRAPPER.innerHTML = "";
		}, 3000);
	};

	const showDateIsSaved = () => {
		ALERT_WRAPPER.innerHTML = `
	<div class="alert alert-success" role="alert">
			Data success save!
			<button
				type="button"
				class="close"
				data-dismiss="alert"
				aria-label="Close"
			>
				<span aria-hidden="true">×</span>
			</button>
		</div>`;
		setTimeout(() => {
			ALERT_WRAPPER.innerHTML = "";
		}, 2000);
	};

	const showApiProblem = (error) => {
		ALERT_WRAPPER.innerHTML = `
		<div class="alert alert-danger" role="alert">
			There is problem with API! ${error}
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">×</span>
			</button>
		</div>`;
		// document.getElementById("alert-saved").style.right = "40px";
		setTimeout(() => {
			ALERT_WRAPPER.innerHTML = "";
		}, 2000);
	};

	saveBtn.onclick = (e) => {
		if (Object.keys(dataForFetch).length === 0) {
			e.preventDefault();
			showNoDataToSave();
			return;
		}

		let newArr = [];
		Object.keys(dataForFetch).forEach((item) => {
			newArr.push(dataForFetch[item]);
		});
		dataForInsert = newArr;
		let errorRequest = false;
		inserData()
			.then((response) => {
				const { status, error } = response;
				if (status === 404) {
					errorRequest = true;
					showApiProblem(error);
				}
			})
			.catch((error) => {
				console.log("saveBtn.onclick -> error", error);
				showApiProblem(error);
			});
		if (errorRequest) {
			dataForInsert = {};
			return;
		}
		showLoadingIndicator();
		if (isSearch) {
			setSearch();
		} else {
			setDefault();
		}
		showDateIsSaved();
		dataForInsert = {};
	};

	// set data for insert

	const setActionForInputs = () => {
		const inputs = document.getElementsByClassName("input-changable");
		Object.keys(inputs).forEach((item) => {
			inputs[item].addEventListener("input", function (e) {
				const ID = this.getAttribute("data-id");
				const COUNT = this.value;
				if (dataForFetch[ID] == undefined) {
					dataForFetch[ID] = {
						departmentId: ID,
						count: COUNT,
					};
					dataForInsertShadow[ID] = {
						departmentId: ID,
						count: e.srcElement.defaultValue,
					};
					this.style.color = "red";
				} else {
					if (COUNT == dataForInsertShadow[ID].count) {
						this.style.color = "#333";
						delete dataForFetch[ID];
						delete dataForInsertShadow[ID];
					} else {
						dataForFetch[ID].count = COUNT;
					}
				}
			});
		});
	};

	window.onscroll = function () {
		let scrollFlued = document
			.getElementById("table-wrapper")
			.getBoundingClientRect().top;
		let sidebarWidth = document.getElementsByClassName("side_bar")[0]
			.clientWidth;
		if (scrollFlued < 70) {
			TABLE_HEADER.style.position = "fixed";
			TABLE_HEADER.style.top = "70px";
			TABLE_HEADER.style.right = "0";
			TABLE_HEADER.style.zIndex = "1001";
			TABLE_HEADER.style.width = `calc(100% - ${sidebarWidth}px)`;
		} else if (scrollFlued === 70) {
			saveBtn.style.opacity = "0";
			TABLE_SEARCH.opacity = "0";
			setTimeout(() => {
				saveBtn.style.opacity = "1";
				TABLE_SEARCH.opacity = "1";
			}, 500);
		} else {
			TABLE_HEADER.style.position = "static";
			TABLE_HEADER.style.top = "70px";
			TABLE_HEADER.style.right = "0";
			TABLE_HEADER.style.zIndex = "1";
			TABLE_HEADER.style.width = "100%";
		}
	};

	/***
	 * cusotm search
	 */

	getMapPercentData().then((response) => {
		let newArr = [...new Set(response)];
		drowSearchsItems(response);
	});

	function setActionsForListItem() {
		const listForAction = document.getElementsByClassName("list-group-item");
		const branchesLists = document.querySelectorAll(".link-item");
		Object.keys(branchesLists).forEach((item) => {
			branchesLists[item].onclick = function (e) {
				console.log(
					"branchesLists[item].onclick -> e.event.target",
					e.event.target,
				);
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
		let counterItems = `<a class="dropdown-item counters-item no-data" href="#">No data found</a>`,
			departmentItems = `<a class="dropdown-item counters-item no-data" href="#">No data found</a>`;

		data.forEach((dataItem) => {
			let counterItem = ``,
				departmentItem = ``;
			counterItem += `<a class="dropdown-item counters-item link-item" href="${mainLink}/counters/?branch=${dataItem.id}"  data-name="${dataItem.name}">${dataItem.name}</a>`;
			departmentItem += `<a class="dropdown-item  departments-item link-item" href="${mainLink}/departments/?branch=${dataItem.id}"  data-name="${dataItem.name}">${dataItem.name}</a>`;
			counterItems += counterItem;
			departmentItems += departmentItem;
		});
		document.getElementById("counter-list").innerHTML = counterItems;
		document.getElementById("department-list").innerHTML = departmentItems;
		setActionsForListItem();
	}

	const showHideSearchListElements = (list, regExp) => {
		Object.keys(list).forEach((item) => {
			let name = list[item].getAttribute("data-name");
			if (regExp.test(name)) {
				list[item].style.display = "block";
			} else {
				list[item].style.display = "none";
			}
		});
	};

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
		const reg = new RegExp(value, "i");
		showHideSearchListElements(listItems, reg);
		setNoData(listItems, reg, searchType);
	}

	const COUNTER_INPUT = document.getElementById("counter-input");
	const DEPARTMENT_INPUT = document.getElementById("department-input");

	$(".icon-close").click(function () {
		searchText = "";
		inputElementTable.value = "";
		isSearch = false;
		document.getElementsByClassName("ion-android-search")[0].style.display =
			"block";
		document.getElementsByClassName("icon-close")[0].style.display = "none";
		document.getElementById("table").style.display = "table";
		document.getElementById("table-search").style.display = "none";
		let reg = new RegExp(searchText, "i");
		let rows = document.querySelectorAll("tbody > tr");

		rows.forEach((item) => {
			let itemName = item.getAttribute("data-name");
			if (reg.test(itemName)) {
				item.style.display = "table-row";
			} else {
				item.style.display = "none";
			}
		});
		PAGINATION.style.display = "flex";
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
});
