function init() {
    document.getElementById("addItemAlertBtn").onclick = alertUser;
}

function alertUser() {
    alert("Please log in first before adding an item. ");
}

window.onload = init;