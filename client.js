	//Lall
	const server = "http://10.1.3.151";
	const port = 8080;
        const xhttp = new XMLHttpRequest();
	var name = prompt("Enter name:");
	var curChannel;
	var avalibleChannels = [];
	var members = [];
	function channelButton(id) {
		curChannel = id;
		get("load");
		document.getElementById("curchannel").innerHTML = "Current channel: " + curChannel;

	}
	var channelUpdate = window.setInterval(function() {
		get("channels");
		document.getElementById("sidebar").innerHTML = "";
		for (i = 0; i < avalibleChannels.channel.length; i++) {
			ChlId = avalibleChannels.channel[i].text;
			document.getElementById("sidebar").innerHTML += "<button id='" + ChlId + "' onclick='channelButton(" + ChlId + ");'>" + ChlId + "</button><br>";
		}
		get("load");
	},1000);
        function get(method) {
            xhttp.open("GET", server + ":" + port + "?" + method + "&" + curChannel + "&" + name, false)
            xhttp.onload = () => {
                resp = JSON.parse(xhttp.response);
                can = "";
		if (method == "channels") {
			avalibleChannels = resp;
			return;
		}
                for(i = 0; i < resp.channel.length; i++) {
                    can += resp.channel[i].user + ": " + resp.channel[i].text + "<br>";
                }
                document.getElementById('value').innerHTML = can;
		members = resp.members;
	    }
            xhttp.send("hallo")
            //setTimeout(get, 1000)
        }
        function send() {
            xhttp.open("POST", server + ":" + port, true)
            msg = {method: "sendMsg", data: {user: name, text: document.getElementById("input").value, channel: curChannel}}
            xhttp.send(JSON.stringify(msg))
            get("load");
        }
	function make() {
	    xhttp.open("POST", server + ":" + port, true)
            msg = {method: "makeCnl", data: {user: name}}
            console.log(xhttp.send(JSON.stringify(msg)));
	    get("channels");
	}
	function add() {
	    xhttp.open("POST", server + ":" + port, true)
            msg = {method: "addUsr", data: {user: name, channel: curChannel, addUser: document.getElementById("adusr").value}}
            console.log(xhttp.send(JSON.stringify(msg)));
	
	}
