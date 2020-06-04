$(function () {
	const mainLink = "/heatmap";
	const BASE_URL = "http://10.0.22.36:8080/QmaticMap/"; // base url
	const POST_SEARCH = "getMapValyutaBranchData";
	const POST_TOTAL_DATA = "getMapValyutaBranchData"; // all data
	const BRANCH_COUNT = "getBranchListSize"; // size of branches
	const GET_TOTALS = "getMapValyutaData"; // cards data "get method"

	let COUNT_PER_PAGE = 15; // count of brach for pagination

	// view constants
	const TABLE = document.getElementById("table");
	const PAGINATION = document.getElementById("pagination");
	const cardWrap = document.getElementsByClassName("cards")[0];
	const TABLE_PRELOADER = document.getElementById("table-preloader");
	const TABLE_MASK = document.getElementById("table-headermask");

	let summData = 0; // sum all branches list
	let startPaginationData = 1; // pagination pposition
	let cards = [];
	let timeoutID;
	let inputValue = "";
	let isSearch = false;

	const COUNTER_INPUT = document.getElementById("counter-input");
	const DEPARTMENT_INPUT = document.getElementById("department-input");

	// main search

	const inputElementTable = document.getElementById("search-td");
	const searchList = document.getElementById("search-list");

	// custom search
	const inputElement = document.getElementById("search-td");

	const fetchCards = async () => {
		const response = await fetch(BASE_URL + GET_TOTALS);
		const data = await response.json();
		return data;
	};

	const parsCards = (data) => {
		cards = [];
		Object.keys(data).forEach((item) => {
			cards.push([`${item}`, data[item]]);
		});
	};

	const drowCards = () => {
		cards.forEach((item) => {
			if (item[0] !== "servedCustomers") {
				let wrap = document.getElementById(`${item[0]}-wrap`);
				let dataTag = document.getElementById(`${item[0]}`);
				wrap.classList.add("top-card-active");
				dataTag.innerHTML = item[1];
			}
		});
	};

	const addTippy = () => {
		console.log("fte", tippy);
		tippy("#averageWaitingTime-wrap", {
			content: "Average waiting time",
		});
		tippy("#maxWaitingTime-wrap", {
			content: "Max waiting time",
		});
		tippy("#maxWaitingTime-wrap", {
			content: "Max waiting time",
		});
		tippy("#awt", {
			content: "Average waiting time",
		});
		tippy("#mwt", {
			content: "Max waiting time",
		});
	};

	const fetchData = async () => {
		const OLD_PAGINATION = startPaginationData;
		const response = await fetch(BASE_URL + POST_TOTAL_DATA, {
			method: "post",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				start:
					startPaginationData === 1
						? 1
						: (startPaginationData - 1) * COUNT_PER_PAGE + 1,
				count: COUNT_PER_PAGE,
			}),
		});
		const data = await response.json();
		return {
			data: data,
			oldPagination: OLD_PAGINATION,
		};
	};

	const fetchSearchData = async () => {
		const response = await fetch(BASE_URL + POST_SEARCH, {
			method: "post",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				start: 1,
				count: summData,
				name: `%${inputValue}%`,
			}),
		});
		const data = await response.json();
		return data;
	};

	const getSize = async () => {
		const response = await fetch(BASE_URL + BRANCH_COUNT, {
			method: "post",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				name: "%%",
			}),
		});
		const data = await response.json();
		return data;
	};

	const getMapPercentData = async () => {
		const response = await fetch(BASE_URL + "getMapPercentData");
		const data = await response.json();
		return data;
	};

	getSize().then((response) => {
		summData = response.size - 1;
		drowPagination();
		setData();
	});

	const setData = () => {
		drowPaginationInfo();
		if (isSearch) {
			fetchSearchData().then((response) => {
				if (!isSearch) {
					clearTimeout(timeoutID);
					timeoutID = setTimeout(setData, 10000);
					return;
				}
				drowSearchTable(response);
				document.getElementById("table").style.display = "none";
				document.getElementById("table-search").style.display = "table";
				PAGINATION.style.display = "none";
				clearTimeout(timeoutID);
				timeoutID = setTimeout(setData, 10000);
			});
			fetchCards().then((response) => {
				parsCards(response);
				drowCards();
				addTippy();
			});
		} else {
			fetchCards().then((response) => {
				parsCards(response);
				drowCards();
			});
			fetchData().then((response) => {
				if (isSearch || response.oldPagination !== startPaginationData) {
					clearTimeout(timeoutID);
					timeoutID = setTimeout(setData, 10000);
					return;
				}

				drowTable(response.data);
				addTippy();
				clearTimeout(timeoutID);
				timeoutID = setTimeout(setData, 10000);
			});
		}
	};

	const drowRow = (item, index) => {
		return `
		<tr>
			<th scope="row">${(startPaginationData - 1) * COUNT_PER_PAGE + 1 + index}</th>
			<td>${item.name}</td>
			<td>${item.customersWaiting}</td>

			<td>${item.averageWaitingTime}</td>

			<td>${item.maxWaitingTime}</td>

			<td>${item.noShow}</td>

			<td>${item.removed}</td>

			<td>${item.servedCustomers}</td>

			<td>${item.tickets}</td>
		</tr>
		`;
	};

	const drowTable = (data) => {
		let tableRows = `
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Branch name</th>

					<th scope="col">Waiting</th>

					<th scope="col">
						<div id="awt">AWT</div>
					</th>

					<th scope="col">
						<div id="mwt">MWT</div>
					</th>
					<th scope="col">No show</th>

					<th scope="col">Removed</th>

					<th scope="col">Served</th>

					<th scope="col">Tickets</th>
				</tr>
			</thead>
			<tbody>`,
			tableRow = ``;
		data.forEach((item, index) => {
			tableRow += drowRow(item, index);
		});
		tableRows += tableRow + `</tbody>`;
		if (!isSearch) {
			document.getElementById("table").style.display = "table";
		}
		// TABLE_MASK.style.display = "table";
		document.getElementById("table").innerHTML = tableRows;
		document.getElementsByClassName("dataTables_info")[0].style.display =
			"flex";
		setTimeout(hideLoadingIndicator, 0);
	};

	const drowSearchTable = (data) => {
		let tableRows = `
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Branch name</th>

					<th scope="col">Waiting customers</th>

					<th scope="col">AWT</th>

					<th scope="col">MWT</th>
					<th scope="col">No show</th>

					<th scope="col">Removed</th>

					<th scope="col">Served</th>

					<th scope="col">Tickets</th>
				</tr>
			</thead>
			<tbody>`,
			tableRow = ``;
		data.forEach((item, index) => {
			tableRow += drowRow(item, index);
		});
		tableRows += tableRow + `</tbody>`;
		document.getElementById("table-search").innerHTML = tableRows;
		document.getElementById("table-search").style.display = "table";
		document.getElementById("lds-spinner").style.transform = "scale(0)";
	};

	const drowPaginationInfo = () => {
		let toPag = startPaginationData * COUNT_PER_PAGE;
		document.getElementById("summ-pag").innerHTML = summData;
		document.getElementById("to-pag").innerHTML =
			toPag > summData ? summData : startPaginationData * COUNT_PER_PAGE;
		document.getElementById("start-pag").innerHTML =
			(startPaginationData - 1) * COUNT_PER_PAGE + 1;
	};

	/**
	 * pagination
	 */

	const setPaginationActions = () => {
		const pagination = document.getElementsByClassName("paginate_button");
		if (Object.keys(pagination).length === 1) {
			return;
		}
		Object.keys(pagination).forEach((item, index) => {
			pagination[item].addEventListener("click", function (e) {
				e.preventDefault();
				Object.keys(pagination).forEach((item) => {
					pagination[item].classList.remove("pagination-item-active");
				});
				this.classList.add("pagination-item-active");
				startPaginationData = +this.getAttribute("data-pagination");
				clearTimeout(timeoutID);
				showLoadingIndicator();
				document.getElementById("table").style.display = "none";
				setData(startPaginationData);
			});
		});
	};

	const drowPagination = () => {
		document.getElementById("summ-pag").innerHTML = summData;
		document.getElementById("to-pag").innerHTML = startPaginationData;
		document.getElementById("start-pag").innerHTML = startPaginationData;
		let paginationItems = ``;
		let checkMinOne = summData / COUNT_PER_PAGE;

		let isNeed =
			summData / COUNT_PER_PAGE === parseInt(summData / COUNT_PER_PAGE);
		let count = isNeed
			? summData / COUNT_PER_PAGE
			: summData / COUNT_PER_PAGE + 1;
		if (checkMinOne < 1) {
			count = 1;
		}
		for (let i = 1; i < count; i++) {
			paginationItems += `
		<li class="paginate_button page-item${
			i === startPaginationData ? "active" : ""
		}"  data-pagination="${i}">
			<span
				
				aria-controls="bs4-table"
				data-dt-idx="1"
				tabindex="0"
				class="page-link"
				>${i}</span
			>
		</li>`;
		}
		PAGINATION.innerHTML = paginationItems;
		setPaginationActions();
	};

	//search

	inputElementTable.oninput = function (event) {
		inputValue = event.target.value;
		searchList.style.transform = "scaleY(1)";
		document.getElementsByClassName("ion-android-search")[0].style.display =
			"block";
		document.getElementsByClassName("icon-close")[0].style.display = "none";
		if (inputValue.length > 2) {
			const VAL = this.value;
			showNeedListItem(VAL);
		} else {
			isSearch = false;
			searchList.style.transform = "scaleY(0)";
			document.getElementById("table").style.display = "table";
			document.getElementById("table-search").style.display = "none";
			PAGINATION.style.display = "flex";
		}
	};

	const showLoadingIndicator = () => {
		const PAGINATION_ANIMATION_ITEMS = document.getElementsByClassName(
			"pagination-item",
		);
		Object.keys(PAGINATION_ANIMATION_ITEMS).forEach((item) => {
			PAGINATION_ANIMATION_ITEMS[item].style.transform = "scale(0)";
		});
		TABLE.style.opacity = "0";
		document.getElementById("lds-spinner").style.transform = "scaleY(1)";
	};

	function hideLoadingIndicator() {
		const PAGINATION_ANIMATION_ITEMS = document.getElementsByClassName(
			"pagination-item",
		);
		Object.keys(PAGINATION_ANIMATION_ITEMS).forEach((item) => {
			PAGINATION_ANIMATION_ITEMS[item].style.transform = "scale(1)";
		});
		TABLE.style.opacity = "1";
		PAGINATION.style.display = "flex";
		document.getElementById("lds-spinner").style.transform = "scale(0)";
	}

	document.onclick = function () {
		searchList.style.transform = "scaleY(0)";
	};
	/***
	 * cusotm search
	 */
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

	getMapPercentData().then((response) => {
		drowSearchsItems(response);
	});

	function setActionsForListItem() {
		const listForAction = document.getElementsByClassName("list-group-item");
		const branchesLists = document.querySelectorAll(".link-item");
		Object.keys(branchesLists).forEach((item) => {
			branchesLists[item].onclick = function (e) {
				COUNTER_INPUT.value = "";
				DEPARTMENT_INPUT.value = "";
			};
		});
		Object.keys(listForAction).forEach((item) => {
			listForAction[item].onclick = function () {
				inputValue = this.getAttribute("data-name");
				inputElementTable.value = inputValue;
				document.getElementsByClassName("ion-android-search")[0].style.display =
					"none";
				document.getElementsByClassName("icon-close")[0].style.display =
					"block";
				isSearch = true;
				$(".dataTables_info").hide();
				document.getElementById("table").style.display = "none";
				PAGINATION.style.display = "none";
				document.getElementById("lds-spinner").style.transform = "scaleY(1)";
				fetchSearchData().then((response) => {
					isSearch = true;
					drowSearchTable(response);
				});
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

		const listBool = Object.values(list).some(
			(item) => regExp.test(item.getAttribute("data-name")) === true,
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
						.getElementById("search-list")
						.querySelector(".no-data").style.display = "block")
				: null;
		}
	};

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
		showHideSearchListElements(listItems, reg);
		setNoData(listItems, reg, searchType);
	}

	/***
	 * cusotm search
	 */

	document.onclick = function () {
		searchList.style.transform = "scaleY(0)";
	};

	$(".icon-close").click(function () {
		$(this).hide();
		$(".dataTables_info").show();
		$(".ion-android-search").show();
		inputElement.value = "";
		isSearch = false;
		searchList.style.transform = "scaleY(0)";
		document.getElementById("table").style.display = "table";
		document.getElementById("table-search").style.display = "none";
		PAGINATION.style.display = "flex";
	});

	$("#search").on("input", function (e) {
		const VAL = this.value;
		document.getElementsByClassName("ion-android-search")[0].style.display =
			"block";
		document.getElementsByClassName("icon-close")[0].style.display = "none";
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
});
