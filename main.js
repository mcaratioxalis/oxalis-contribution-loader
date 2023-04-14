let sendBtn         = {};

window.onload     = () => {
    sendBtn         = document.getElementById("sendbutton");
    sendBtn.addEventListener('click', OnSendClick, false);
}

let OnSendClick     = async () => {
    console.log(GetData());
}

let GetData         = () => {
    let params      = {
        pass        : "",
        startTime   : null,
        endTime     : null,
        beautify    : false,
        csv         : false,
        dev         : false,
        sortParam   : ""
    }

    params.pass         = document.getElementById("pass-input").value.trim();
    params.startTime    = document.getElementById("start-time").value;
    params.endTime      = document.getElementById("end-time").value;
    params.beautify     = document.getElementById("beautify-checkbox").checked;
    params.csv          = document.getElementById("csv-checkbox").checked;
    params.dev          = document.getElementById("dev-checkbox").checked;
    params.sortParam    = document.getElementById("sortparam").value.trim();

    return params;
}