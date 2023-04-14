let sendBtn         = {};
const liveUrl       = "https://dev.moonfrost.io";
const devUrl        = "http://35.189.103.235:4002";

let starttimelabel      = {};
let endtimelabel        = {};

window.onload     = () => {
    sendBtn         = document.getElementById("sendbutton");
    starttimelabel  = document.getElementById("starttimelabel");
    endtimelabel    = document.getElementById("endtimelabel");
    sendBtn.addEventListener('click', OnSendClick, false);
}

let OnSendClick     = async () => {
    let data        = ProcessData();
    if(!data) return;

    let url         = data.dev ? devUrl : liveUrl;
    url             = "http://localhost:4000";
    url             += "/community/all";
    url             += `?start=${data.startTime}&end=${data.endTime}&beautify=${data.beautify}&csv=${data.csv}`;

    if(data.sortParam   !== ""){
        url         += `&sortParam=${data.sortParam}`;
    }

    let res         = await axios({ 
        method: 'get', 
        url: url, 
        headers: { 'master-pass': data.pass } })
    
    let resData     = undefined;
    try{
        resData     = JSON.stringify(res.data);
    } catch {
        resData     = res.data;
    }

    document.getElementById("responcediv").innerHTML = resData;
}

let ProcessData             = () => {
    let data        = GetData();
    if(!data.startTime) {
        starttimelabel.style.color  = "red";
        return null;
    } else {
        starttimelabel.style.color  = "black";
    }

    if(!data.endTime) {
        endtimelabel.style.color    = "red";
        return null;
    } else {
        endtimelabel.style.color    = "black";
    }

    let starttime   = new Date(data.startTime);
    let endtime     = new Date(data.endTime);

    data.startTime  = ConvertDateToString(starttime);
    data.endTime    = ConvertDateToString(endtime);



    return data;
}

let ConvertDateToString     = (datetime) => {
    let part1 = `${datetime.getFullYear()}-${datetime.getMonth()+1 < 10 ? `0${datetime.getMonth()+1}` : datetime.getMonth()+1}-${datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate()}`;
    let part2 = `${datetime.getHours() < 10 ? `0${datetime.getHours()}` : datetime.getHours()}:${datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes()}:00.000Z`;
    return `${part1}T${part2}`;
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
    params.pass         = sha256(params.pass);
    params.startTime    = document.getElementById("start-time").value;
    params.endTime      = document.getElementById("end-time").value;
    params.beautify     = document.getElementById("beautify-checkbox").checked;
    params.csv          = document.getElementById("csv-checkbox").checked;
    params.dev          = document.getElementById("dev-checkbox").checked;
    params.sortParam    = document.getElementById("sortparam").value.trim();

    return params;
}