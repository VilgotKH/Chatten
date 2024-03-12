	const server = "http://10.1.3.151";
	const port = 8080;
        const xhttp = new XMLHttpRequest();
        function get(method) {
            xhttp.open("GET", server + ":" + port + "?" + method + "&" + document.getElementById("chan").value + "&" + document.getElementById("name").value, false)
            xhttp.onload = () => {
                resp = JSON.parse(xhttp.response);
                can = "";
                for(i = 0; i < resp.channel.length; i++) {
                    can += resp.channel[i].user + ": " + resp.channel[i].text + "<br>";
                }
                document.getElementById('value').innerHTML = can + resp.members;
            }
            xhttp.send("hallo")
            //setTimeout(get, 1000)
        }
        function send() {
            xhttp.open("POST", server + ":" + port, true)
            msg = {method: "sendMsg", data: {user: document.getElementById("name").value, text: document.getElementById("input").value, channel: document.getElementById("chan").value}}
            xhttp.send(JSON.stringify(msg))
            get("load");
        }
	function make() {
	    xhttp.open("POST", server + ":" + port, true)
            msg = {method: "makeCnl", data: {user: document.getElementById("name").value}}
            console.log(xhttp.send(JSON.stringify(msg)));
	    get("channels");
	}
	function add() {
	    xhttp.open("POST", server + ":" + port, true)
            msg = {method: "addUsr", data: {user: document.getElementById("name").value, channel: document.getElementById("chan").value, addUser: document.getElementById("adusr").value}}
            console.log(xhttp.send(JSON.stringify(msg)));
	
	}
