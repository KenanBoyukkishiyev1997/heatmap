$(function () {
    /**
     * Global vars
     */
    let timeoutId;
    $.ajax({
        type: "get",
        url: "/rest/servicepoint/user/",
        success: function (response) {
            $("#username").text(response["fullName"]);
        },
        error: function (err) {
            // window.location.href = "/login.jsp";
        },
        complete: function (response) {
            // console.log("response", response)
        }
    });

    let dynamicElementsId = {},
        allFilials = {
            "1": {
                filialX: 312,
                filialY: 211,
                filialName: "Atabank",
                id: "1"
            },
            "3": {
                filialX: 309,
                filialY: 318,
                filialName: "Ağdam filialı",
                id: "3"
            },
            "5": {
                filialX: 98,
                filialY: 111,
                filialName: "Aqstafa filialı",
                id: "5"
            },
            "6": {
                filialX: 548,
                filialY: 600,
                filialName: "Astara filialı",
                id: "6"
            },
            "7": {
                filialX: 227,
                filialY: 31,
                filialName: "Balakən filialı",
                id: "7"
            },
            "8": {
                filialX: 328,
                filialY: 277,
                filialName: "Bərdə filialı",
                id: "8"
            },
            "9": {
                filialX: 495,
                filialY: 425,
                filialName: "Biləsuvar filialı",
                id: "9"
            },
            "11": {
                filialX: 502,
                filialY: 427,
                filialName: "Cəbrayıl filialı",
                id: "11"
            },
            "12": {
                filialX: 336,
                filialY: 278,
                filialName: "Bərdə kart mərkəzi",
                id: "12"
            },
            "13": {
                filialX: 212,
                filialY: 291,
                filialName: "Shamaxi filialı",
                id: "13"
            },
            "14": {
                filialX: 496,
                filialY: 473,
                filialName: "Cəlilabad filialı",
                id: "14"
            },
            "15": {
                filialX: 212,
                filialY: 211,
                filialName: "Gəncə filialı",
                id: "15"
            },
            "18": {
                filialX: 252,
                filialY: 215,
                filialName: "Goranboy filialı",
                id: "18"
            },
            "19": {
                filialX: 211,
                filialY: 238,
                filialName: "Göygöl filialı",
                id: "19"
            },
            "20": {
                filialX: 567,
                filialY: 315,
                filialName: "Hacıqabul filialı",
                id: "20"
            },
            "22": {
                filialX: 442,
                filialY: 361,
                filialName: "İmişli filialı",
                id: "22"
            },
            "23": {
                filialX: 459,
                filialY: 191,
                filialName: "İsmayıllı filialı",
                id: "23"
            },
            "24": {
                filialX: 212,
                filialY: 221,
                filialName: "Kəpəz filialı",
                id: "24"
            },
            "25": {
                filialX: 489,
                filialY: 550,
                filialName: "Lerik filialı",
                id: "25"
            },
            "26": {
                filialX: 528,
                filialY: 505,
                filialName: "Masallı filialı",
                id: "26"
            },
            "27": {
                filialX: 532,
                filialY: 512,
                filialName: "Masallı kart mərkəzi",
                id: "27"
            },
            "31": {
                filialX: 362,
                filialY: 148,
                filialName: "Oğuz filialı",
                id: "31"
            },
            "34": {
                filialX: 295,
                filialY: 87,
                filialName: "Qax filialı",
                id: "34"
            },
            "35": {
                filialX: 75,
                filialY: 126,
                filialName: "Qazax filialı",
                id: "35"
            },
            "36": {
                filialX: 494,
                filialY: 114,
                filialName: "Quba filialı",
                id: "36"
            },
            "37": {
                filialX: 478,
                filialY: 79,
                filialName: "Qusar filialı",
                id: "37"
            },
            "38": {
                filialX: 490,
                filialY: 355,
                filialName: "Saatlı filialı",
                id: "38"
            },
            "39": {
                filialX: 515,
                filialY: 333,
                filialName: "Sabirabad filialı",
                id: "39"
            },
            "41": {
                filialX: 582,
                filialY: 390,
                filialName: "Salyan kart mərkəzi",
                id: "41"
            },
            "42": {
                filialX: 225,
                filialY: 177,
                filialName: "Samux filialı",
                id: "42"
            },
            "44": {
                filialX: 560,
                filialY: 116,
                filialName: "Şabran filialı",
                id: "44"
            },
            "45": {
                filialX: 519,
                filialY: 200,
                filialName: "Şamaxı filialı",
                id: "45"
            },
            "46": {
                filialX: 326,
                filialY: 130,
                filialName: "Şəki kart mərkəzi",
                id: "46"
            },
            "48": {
                filialX: 558,
                filialY: 342,
                filialName: "Şirvan filialı",
                id: "48"
            },
            "50": {
                filialX: 581,
                filialY: 149,
                filialName: "Siyəzən filialı",
                id: "50"
            },
            "51": {
                filialX: 656,
                filialY: 230,
                filialName: "Sumqayıt filialı",
                id: "51"
            },
            "52": {
                filialX: 654,
                filialY: 234,
                filialName: "Sumqayıt kart mərkəzi",
                id: "52"
            },
            "54": {
                filialX: 126,
                filialY: 154,
                filialName: "Tovuz filialı",
                id: "54"
            },
            "55": {
                filialX: 542,
                filialY: 77,
                filialName: "Xaçmaz filialı",
                id: "55"
            },
            "58": {
                filialX: 600,
                filialY: 202,
                filialName: "Xızı filialı",
                id: "58"
            },
            "59": {
                filialX: 465,
                filialY: 518,
                filialName: "Yardımlı filialı",
                id: "59"
            },
            "61": {
                filialX: 260,
                filialY: 58,
                filialName: "Zaqatala filialı",
                id: "61"
            },
            "62": {
                filialX: 550,
                filialY: 550,
                filialName: "Lənkəran filialı",
                id: "62"
            },
            "63": {
                filialX: 272,
                filialY: 254,
                filialName: "Naftalan filialı",
                id: "63"
            },
            "64": {
                filialX: 600,
                filialY: 444,
                filialName: "Neftçala filialı",
                id: "64"
            },
            "67": {
                filialX: 411,
                filialY: 160,
                filialName: "Qəbələ filialı",
                id: "67"
            },
            "68": {
                filialX: 170,
                filialY: 247,
                filialName: "Daşkəsən filialı",
                id: "68"
            },
            "69": {
                filialX: 320,
                filialY: 229,
                filialName: "Yevlax filialı",
                id: "69"
            },
            "70": {
                filialX: 360,
                filialY: 327,
                filialName: "Laçın filialı",
                id: "70"
            },
            "71": {
                filialX: 644,
                filialY: 228,
                filialName: "Qubadlı filialı",
                id: "71"
            },
            "73": {
                filialX: 410,
                filialY: 232,
                filialName: "Göyçay filialı",
                id: "73"
            },
            "75": {
                filialX: 183,
                filialY: 183,
                filialName: "Şəmkir filialı",
                id: "75"
            },
            "77": {
                filialX: 305,
                filialY: 205,
                filialName: "Mingəçevir filialı",
                id: "77"
            },
            "78": {
                filialX: 413,
                filialY: 302,
                filialName: "Zərdab filialı",
                id: "78"
            },
            "80": {
                filialX: 131,
                filialY: 245,
                filialName: "Gədəbəy filialı",
                id: "80"
            },
            "81": {
                filialX: 364,
                filialY: 407,
                filialName: "Füzuli filialı",
                id: "81"
            },
            "82": {
                filialX: 406,
                filialY: 262,
                filialName: "Ucar filialı",
                id: "82"
            },
            "83": {
                filialX: 391,
                filialY: 377,
                filialName: "Beyləqan filialı",
                id: "83"
            },
            "84": {
                filialX: 360,
                filialY: 230,
                filialName: "Ağdaş filialı",
                id: "84"
            },
            "85": {
                filialX: 456,
                filialY: 282,
                filialName: "Kürdəmir filialı",
                id: "85"
            },
            "86": {
                filialX: 485,
                filialY: 227,
                filialName: "Ağsu filialı",
                id: "86"
            },
            "88": {
                filialX: 349,
                filialY: 333,
                filialName: "Ağcəbədi filialı",
                id: "88"
            },
            "89": {
                filialX: 296,
                filialY: 278,
                filialName: "Tərtər filialı",
                id: "89"
            },
            "97": {
                filialX: 560,
                filialY: 229,
                filialName: "Qobustan filialı",
                id: "97"
            },
            "98": {
                filialX: 508,
                filialY: 108,
                filialName: "Şimal filialı",
                id: "98"
            },
            "102": {
                filialX: 206,
                filialY: 215,
                filialName: "Gəncə kart mərkəzi",
                id: "102"
            },
            "107": {
                filialX: 92,
                filialY: 478,
                filialName: "Babək filialı",
                id: "107"
            },
            "108": {
                filialX: 120,
                filialY: 503,
                filialName: "Culfa filialı",
                id: "108"
            },
            "109": {
                filialX: 32,
                filialY: 415,
                filialName: "Şərur filialı",
                id: "109"
            },
            "110": {
                filialX: 56,
                filialY: 442,
                filialName: "Kəngərli filialı",
                id: "110"
            },
            "111": {
                filialX: 13,
                filialY: 384,
                filialName: "Sədərək filialı",
                id: "111"
            },
            "112": {
                filialX: 112,
                filialY: 431,
                filialName: "Şahbuz filialı",
                id: "112"
            },
            "113": {
                filialX: 87,
                filialY: 466,
                filialName: "Naxçıvan filialı",
                id: "113"
            },
            "114": {
                filialX: 536,
                filialY: 505,
                filialName: "Cənub filialı",
                id: "114"
            },
            "115": {
                filialX: 167,
                filialY: 519,
                filialName: "Ordubad filialı",
                id: "115"
            }
        },
        whichShown = "time",
        circleHovered = false;
    //SVG start
    var svgTime = document.getElementById("sgs-time"),
        svgPercent = document.getElementById("sgs-percent");
    NS = svgTime.getAttribute("xmlns");

    for (let [key, value] of Object.entries(allFilials)) {
        var circleTime = document.createElementNS(NS, "circle"),
            circlePercent = document.createElementNS(NS, "circle");
        circleTime.setAttribute("data-filialname", value.filialName);
        circleTime.setAttribute("id", "time-" + key);
        circleTime.setAttribute("data-id", key);
        circleTime.setAttributeNS(null, "cx", value.filialX);
        circleTime.setAttributeNS(null, "cy", value.filialY);
        circleTime.setAttributeNS(null, "r", 2);
        circleTime.classList.add("circle");
        svgTime.appendChild(circleTime);

        circlePercent.setAttribute("data-filialname", value.filialName);
        circlePercent.setAttribute("id", "percent-" + key);
        circlePercent.setAttribute("data-id", key);
        circlePercent.setAttributeNS(null, "cx", value.filialX);
        circlePercent.setAttributeNS(null, "cy", value.filialY);
        circlePercent.setAttributeNS(null, "r", 2);
        circlePercent.classList.add("circle");
        svgPercent.appendChild(circlePercent);
    }

    var url = "ws://192.168.1.194:8000/map/";
    var service = new WebSocket(url);

    service.onopen = function () {
        service.send(
            JSON.stringify({
                action: "start"
            })
        );
    };

    service.onmessage = function (event) {
        let data = JSON.parse(event.data),
            id = data.payload.id;
        if (data.action == "update_alert") {
            let alertD;
            if (data) {
                alertD = data.payload.alert.avg_waiting_time.text;
            }

            let colorTime = data.payload.alert.avg_waiting_time.color,
                value = data.payload.alert.percent.value,
                colorPercnet = data.payload.alert.percent.color,
                dynamicBool = data.payload.alert.avg_waiting_time.dinamic,
                calcTime = data.payload.alert.avg_waiting_time.calculation_time,
                coefficient = data.payload.alert.avg_waiting_time.coefficient,
                valueAwg = data.payload.alert.avg_waiting_time.value,
                text = data.payload.alert.avg_waiting_time.text;
            setBranchData(id, alertD, colorTime, value, colorPercnet);
            setUpdateDate(id, dynamicBool, calcTime, coefficient, valueAwg);
        } else if (data.action == "update_data") {
            const payLoad = data.payload;
            setCardData(payLoad);
        } else if (data.action == "init") {
            // console.log("data for init", data);
            const branches = data.payload.branches;
            const payLoad = data.payload;
            const avg_serving_time = data.avg_serving_time;
            const waiting_customer_count = data.waiting_customer_count;
            const avg_waiting_time = data.avg_waiting_time;
            const max_waiting_time = data.max_waiting_time;
            const noshow_count = data.noshow_count;
            const served_customer_count = data.served_customer_count;
            const removed_customer_count = data.removed_customer_count;
            const open_counter_count = data.open_counter_count;
            const closed_counter_count = data.closed_counter_count;
            setCardData(payLoad);
            setTimeout(() => {
                branches.forEach(item => {
                    let alertD = item.alert.avg_waiting_time.text,
                        id = item.id,
                        colorTime = item.alert.avg_waiting_time.color,
                        value = item.alert.percent.value,
                        colorPercnet = item.alert.percent.color,
                        dynamicBool = item.alert.avg_waiting_time.dinamic,
                        calcTime = item.alert.avg_waiting_time.calculation_time,
                        coefficient = item.alert.avg_waiting_time.coefficient,
                        valueAwg = item.alert.avg_waiting_time.value,
                        text = item.alert.avg_waiting_time.text;
                    setBranchData(id, alertD, colorTime, value, colorPercnet);
                });
                service.send(
                    JSON.stringify({
                        action: "start"
                    })
                );
            }, 1000);
        }
    };

    function setCardData(payLoad) {
        if (payLoad) {
            if (payLoad.hasOwnProperty("avg_serving_time")) {
                $("#ave-serv-time").text(payLoad.avg_serving_time.text);
                $("#ave-serv-time")
                    .parent()
                    .show("slow");
            }
            if (payLoad.hasOwnProperty("avg_waiting_time")) {
                $("#ave-waiting-time").text(payLoad.avg_waiting_time.text);
                $("#ave-waiting-time")
                    .parent()
                    .show("slow");
            }
            if (payLoad.hasOwnProperty("max_waiting_time")) {
                $("#max-waiting-time").text(payLoad.max_waiting_time.text);
                $("#max-waiting-time")
                    .parent()
                    .show("slow");
            }
            if (payLoad.hasOwnProperty("noshow_count")) {
                $("#no-show").text(payLoad.noshow_count);
                $("#no-show")
                    .parent()
                    .show("slow");
            }
            if (payLoad.hasOwnProperty("waiting_customer_count")) {
                $("#waiting-custom").text(payLoad.waiting_customer_count);
                $("#waiting-custom")
                    .parent()
                    .show("slow");
            }
            if (payLoad.hasOwnProperty("served_customer_count")) {
                $("#served-custom").text(payLoad.served_customer_count);
                $("#served-custom")
                    .parent()
                    .show("slow");
            }
            if (payLoad.hasOwnProperty("removed_customer_count")) {
                $("#removed").text(payLoad.removed_customer_count);
                $("#removed")
                    .parent()
                    .show("slow");
            }
            if (payLoad.hasOwnProperty("open_counter_count")) {
                $("#open-counters").text(payLoad.open_counter_count);
                $("#open-counters")
                    .parent()
                    .show("slow");
            }
            if (payLoad.hasOwnProperty("closed_counter_count")) {
                $("#closed-counters").text(payLoad.closed_counter_count);
                $("#closed-counters")
                    .parent()
                    .show("slow");
            }
        }
    }

    function setBranchData(id, alert, colorTime, value, colorPercnet) {
        let elemTime = $("#time-" + id),
            elemPercent = $("#percent-" + id);
        elemTime.attr("data-awg-text", alert);
        elemTime.css("stroke", colorTime);
        elemPercent.attr("data-awg-text", value);
        elemPercent.css("stroke", colorPercnet);
    }

    function setUpdateDate(
        elemId,
        dynamicBool,
        calcTime,
        coefficient,
        value,
        text
    ) {
        if (dynamicBool) {
            if (dynamicElementsId[elemId]) {
                return;
            } else {
                dynamicElementsId[elemId] = {
                    calculation_time: calcTime,
                    coefficient,
                    value
                };
            }
        } else {
            if (dynamicElementsId[elemId]) {
                delete dynamicElementsId[elemId];
                let updateElem = document.getElementById("time-" + key);

                updateElem.setAttribute("data-awg-text", text);
            }
        }
    }

    function updateData() {
        for (let [key, value] of Object.entries(dynamicElementsId)) {
            let updateElem = document.getElementById("time-" + key);
            let delta = Date.now() - new Date(value.calculation_time).getTime();
            let ms = delta * value.coefficient;
            let val = new Date(value.value + ms);
            let displayDate =
                val.getHours() +
                ":" +
                (val.getMinutes() < 10 ? "0" + val.getMinutes() : val.getMinutes()) +
                ":" +
                (val.getSeconds() < 10 ? "0" + val.getSeconds() : val.getSeconds());
            if (updateElem == null) {
                null;
            } else {
                updateElem.setAttribute("data-awg-text", displayDate);
            }
        }
        // console.log('timeoutId', timeoutId)
        clearTimeout(timeoutId);
        clearTimeout(timeoutId);
        clearTimeout(timeoutId);
        clearTimeout(timeoutId);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateData, 1000);
    }

    $(".baki-time").click(function () {
        $(this)
            .parent()
            .css({
                transform: "scale(0)"
            });
        $("#map-baki-time").addClass("map-baki-shown");
        $(".btn-back").addClass("btn-back-shown");
        $(".map-left .map-info").css({
            transform: "translateX(-90%) scale(.8)"
        });
        $(".map-right .map-info").css({
            transform: "translateX(90%) scale(.8)"
        });
    });

    $(".baki-percent").click(function () {
        $(this)
            .parent()
            .css({
                transform: "scale(0)"
            });
        $("#map-baki-percent").addClass("map-baki-shown");
        $(".btn-back").addClass("btn-back-shown");
        $(".map-left .map-info").css({
            transform: "translateX(-90%) scale(.8)"
        });
        $(".map-right .map-info").css({
            transform: "translateX(90%) scale(.8)"
        });
    });

    $(".baki").mouseover(function () {
        $(this).css("fill", "red");
    });
    $(".baki").mouseout(function () {
        $(this).css("fill", "#CBE0BA");
    });

    $description = $(".tooltip");
    $("body").on("mousemove", "#sgs-time", function (e) {
        $description.css({
            left: e.pageX,
            top: e.pageY - 60
        });
    });
    $("body").on("mousemove", "#sgs-percent", function (e) {
        $description.css({
            left: e.pageX,
            top: e.pageY - 60
        });
    });

    var newArr = [];

    $("#search").on("input", function (e) {
        newArr = [];
        const circles = $(".circle");
        const circlesLength = circles.length;
        var inputVal = $(this).val();
        var reg = new RegExp(inputVal, "i");
        for (var i = 0; i < circlesLength; i++) {
            const circleText = circles[i].getAttribute("data-filialname");
            if (!reg.test(circleText)) {
                circles[i].style.display = "none";
            } else {
                circles[i].style.display = "block";
            }
        }
    });

    let hoverTimer;
    function setHoverData(e) {
        if (circleHovered) {
            if (element == e) {
                document.getElementById("tooltip-time").innerHTML = e.getAttribute(
                    "data-awg-text"
                );
                hoverTimer = setTimeout(() => setHoverData(e), 1000);
            }
        } else {
        }
    }

    let event, element;
    $(".map").on("mouseover", ".circle", function (e) {
        $description.addClass("tooltip-shown");
        $("#tooltip-filname").text($(this).attr("data-filialname"));
        $("#tooltip-percent").text($(this).attr("data-percent-text"));
        circleHovered = true;
        (event = e.target), (element = e.target);
        document.getElementById("tooltip-time").innerHTML = event.getAttribute(
            "data-awg-text"
        );
        hoverTimer = setTimeout(() => setHoverData(event), 1000);
    });

    $(".map").on("mouseout", ".circle", function () {
        $description.removeClass("tooltip-shown");
        clearTimeout(hoverTimer);
        circleHovered = false;
    });

    $(".btn-back").click(function () {
        if (whichShown == "time") {
            $("#sgs-time").css({
                transform: "scale(1)"
            });
        } else {
            $("#sgs-percent").css({
                transform: "scale(1)"
            });
        }
        $(".map-baki").removeClass("map-baki-shown");
        $(".btn-back").removeClass("btn-back-shown");
        $(".map-left .map-info").css({
            transform: "translateX(0) scale(1)"
        });
        $(".map-right .map-info").css({
            transform: "translateX(0) scale(1)"
        });
    });
    $("#tab-time").click(function () {
        $(".tab-btn").removeClass("tab-btn__active");
        $(this)
            .find(".tab-btn")
            .addClass("tab-btn__active");
        $(".map-baki").removeClass("map-baki-shown");
        whichShown = "time";
        $("#map-percent").removeClass("d-flex");
        $("#map-percent").addClass("d-none");
        $("#map-time").addClass("d-flex");
        $("#sgs-time").css("transform", "scale(1)");
        $("#map-time").removeClass("d-none");
        $(".map-left .map-info").css({
            transform: "translateX(0) scale(1)"
        });
        $(".map-right .map-info").css({
            transform: "translateX(0) scale(1)"
        });
        $(".btn-back").removeClass("btn-back-shown");
    });
    $("#tab-percent").click(function () {
        $(".tab-btn").removeClass("tab-btn__active");
        $(this)
            .find(".tab-btn")
            .addClass("tab-btn__active");
        $(".map-baki").removeClass("map-baki-shown");
        whichShown = "percent";
        $("#map-percent").addClass("d-flex");
        $("#map-percent").removeClass("d-none");
        $("#sgs-percent").css("transform", "scale(1)");
        $("#map-time").removeClass("d-flex");
        $("#map-time").addClass("d-none");
        $(".map-left .map-info").css({
            transform: "translateX(0) scale(1)"
        });
        $(".map-right .map-info").css({
            transform: "translateX(0) scale(1)"
        });
        $(".btn-back").removeClass("btn-back-shown");
    });

    $(document).on("click", ".circle", function () {
        const ID = $(this).attr("data-id");
        window.open(`/heatmap/branch/?branch-id=${ID}`, "_blank");
    });

    updateData();
});
