window.onload = init;

function init() {
    var addItemAlertBtn = document.getElementById("addItemAlertBtn");
    if(addItemAlertBtn)
        addItemAlertBtn.onclick = alertUser;
}

function alertUser() {
    alert("Please log in first before adding an item. ");
}
