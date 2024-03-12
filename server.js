const http = require("http");
const fs = require("fs");
const host = '10.1.3.151';
const port = 8080;

try {
	resp = JSON.parse(fs.readFileSync("messages.json", "utf-8"));
} catch {
	var resp = [[]];
}

try {
	channels = JSON.parse(fs.readFileSync("channels.json", "utf-8"));
} catch {
	var channels = [
    	{owner: "Vilgot", id: 10, index: 0, members: ["Vilgot", "Bertil", "Evert"]}
	]
}

const server = http.createServer((function(req, res){
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000,
      };
    if (req.method === "GET") {
        chanel = null;
        target = req.url.replace("/?", "").split("&");
	if ((target[0]) == "load") {
	        for (i = 0; i < channels.length; i++) {
        	    if (channels[i].id == parseInt(target[1])) {
                	for (j = 0; j < channels[i].members.length; j++) {
	                    if (channels[i].members[j] == target[2]) {
        	                chanel = i;
                	        j = channels[i].members.length;
	                    }
        	        }
	                i = channels.length;
        	    }
        	}
        	res.writeHead(200, headers);
        	if(chanel != null) {
        	    res.end(JSON.stringify({channel: resp[chanel], members: channels[chanel].members}).toString());
        	} 
        	else {
        	    res.end(JSON.stringify({channel: [{user: "Error", text: "Channel not found"}], members: [""]}));
        	}
	}
	else if ((target[0]) == "channels") {
		res.writeHead(200, headers);
		channls = [];
		count = 0;
		for (i = 0; i < channels.length; i++) {
			for (j = 0; j < channels[i].members.length; j++) {
				if (target[2] == channels[i].members[j]) {
					count++;
					channls.push({user: count, text: channels[i].id});
				}
			}
		}
		res.end(JSON.stringify({channel: channls, members: [""]}));
	}
        console.log(req.url)
    }
    else if (req.method === "POST") {
        req.on("data", function(data) {
            ans = JSON.parse(data);
            if(ans.method == "sendMsg") {
                for(i = 0; i < channels.length; i++) {
                    if(channels[i].id == ans.data.channel) {
                        for(j = 0; j < channels[i].members.length; j++){
                            if (channels[i].members[j] == ans.data.user){
                                resp[channels[i].index].push({user: ans.data.user, text: ans.data.text});
                            }
                        }
                    }
                }
            }
	    else if (ans.method == "makeCnl") {
		found = false;
		while (!found) {
			id = Math.round(Math.random()*1000);
			found = true;
			for (i = 0; i < channels.length; i++) {
				if (channels[i].index == id) {
					found = false;
				}
			}
		}
		channels.push({owner: ans.data.user, id: id, index: channels.length, members: [ans.data.user]});
	    	resp.push([]);
		console.log("made channel: " + id);
	    }
	    else if (ans.method == "addUsr") {
		for (i = 0; i < channels.length; i++) {
			if (channels[i].id == ans.data.channel && channels[i].owner == ans.data.user) {
				channels[i].members.push(ans.data.addUser);
				console.log("Added user: " + ans.data.addUser);
			}
		}
	    }
	    fs.writeFileSync("channels.json", JSON.stringify(channels));
	    fs.writeFileSync("messages.json", JSON.stringify(resp));
        })
        res.writeHead(150, headers);
        res.end("hello")
        console.log("recived POST request");
    }
    
})).listen(port, "0.0.0.0");
