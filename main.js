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
    url             += "/community/all";
    url             += `?start=${data.startTime}&end=${data.endTime}&beautify=${data.beautify}&csv=${data.csv}`;

    if(data.sortParam   !== ""){
        url         += `&sortParam=${data.sortParam}`;
    }

    let res         = await axios({ 
        method: 'get', 
        url: url, 
        headers: { 'master-pass': data.pass } })
    
    let resData     = res.data;
    if(!data.csv){
        resData     = JSON.stringify(res.data);
    }
    Load(resData, data.csv ? ".csv" : ".json");
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


function Load(Data, format) {
    var CSV = Data;

    //Initialize file format you want csv or xls
    //var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + escape(CSV);
    var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(CSV);
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = "analytics" + format;

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}