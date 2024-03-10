const http = require("http");
const host = 'localhost';
const port = 8080;
var channels = [
    {owner: "Vilgot", id: 10, index: 0, members: ["Vilgot", "Bertil", "Evert"]}
]
var resp = [[],[{user: "Admin", text: "Den du"}]];
const server = http.createServer((function(req, res){
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000,
      };
    if (req.method === "GET") {
        chanel = null;
        target = req.url.replace("/?", "").split("&");
        for (i = 0; i < channels.length; i++) {
            if (channels[i].id == parseInt(target[0])) {
                for (j = 0; j < channels[i].members.length; j++) {
                    if (channels[i].members[j] == target[1]) {
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
        })
        res.writeHead(150, headers);
        res.end("Hello")
        console.log("recived POST request");
    }
    
})).listen(port, "0.0.0.0");