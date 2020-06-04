
function formatIntoHHMMSS(secsIn){
    if(secsIn == -1) {
        return "";
    }
    hours = parseInt(secsIn / 3600);
    remainder = secsIn % 3600;
    minutes = parseInt(remainder / 60);
    seconds = remainder % 60;
    formatted =  (hours < 10 ? "0" : "") + hours
            + ":" + (minutes < 10 ? "0" : "") + minutes
            + ":" + (seconds< 10 ? "0" : "") + seconds;
    return formatted;
}

function formatIntoHHMM(secsIn) {
    if(secsIn == -1) {
        return "";
    }
    hours = parseInt(secsIn / 3600);
    remainder = secsIn % 3600;
    minutes = parseInt(remainder / 60);
    formatted =  (hours < 10 ? "0" : "") + hours
            + ":" + (minutes < 10 ? "0" : "") + minutes;
    return formatted;
}

function showMessage(text) {
    var msg = document.getElementById("message");
    msg.innerHTML = "<span id='text'>" + text +"</span>";
    msg.style.visibility = "visible";
    window.setTimeout("hideMessage()", 5000);
}

function hideMessage() {
    document.getElementById("message").style.visibility = "hidden";
}

function showError(text) {
    var err = document.getElementById("error");
    err.innerHTML = "<span id='text'>" + text +"</span>";
    err.style.visibility = "visible";
    window.setTimeout("hideError()", 5000);
}

function hideError() {
    document.getElementById("error").style.visibility = "hidden";
}

function showModal(divId) {
    window.onscroll = function () { document.getElementById(divId).style.top = document.body.scrollTop; };
    document.getElementById(divId).style.display = "block";
    document.getElementById(divId).style.top = document.body.scrollTop;
}

function hideModal(divId) {
    document.getElementById(divId).style.display = "none";
	//document.getElementById(divId).style.visibility = "hidden";
}