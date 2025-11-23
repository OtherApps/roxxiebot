
// server.js – RoxxieBot Twitch Event Relay for Railway
//
// - Connects to Twitch as a bot using tmi.js
// - Listens for: subs, resubs, gifted subs, cheers (bits), chat
// - Broadcasts JSON events via WebSocket at /ws
// - Your Stars dashboard connects to this and updates points.

require("dotenv").config();

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const tmi = require("tmi.js");
const fs = require("fs");

// ----- ENVIRONMENT -----
const PORT = process.env.PORT || 8080;
const TWITCH_CHANNEL = (process.env.TWITCH_CHANNEL || "sircherrythesmuttysheep").toLowerCase();
//const BOT_USERNAME = process.env.TWITCH_BOT_USERNAME;
//const BOT_OAUTH = process.env.TWITCH_OAUTH_TOKEN;

/*if (!BOT_USERNAME || !BOT_OAUTH) {
  console.error("ERROR: Missing TWITCH_BOT_USERNAME or TWITCH_OAUTH_TOKEN in env.");
  process.exit(1);
}*/

// ----- EXPRESS + HTTP -----
const app = express();
app.use(express.static('./'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
    res.redirect('./public/index.html');
});

const server = http.createServer(app);

// ----- WEBSOCKET SERVER -----
//const wss = new WebSocket.Server({ server, path: "/ws" });
const wss= new WebSocket.Server({port:443})
function broadcast(obj) {
  const data = JSON.stringify(obj);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}
app.get('/raw',(req,res)=>{
// needed for younow chat 

 getJsonStuff(req.query.url,req,res); 
	
})

app.get('/GiveVip',function (request,response){
//http://192.168.1.172:8080/GiveVip?usr=test&to=Hamez&sar=100&stick=1
GiveVip(request,response,request.query.usr,request.query.to,request.query.sar,request.query.stick)
	
}
	)
app.get('/vip',function (request,response){
	
	VipSave(request,response,request.query.di,request.query.name,request.query.stars,request.query.stickers);
	
})

wss.on("connection", (ws) => {
  ws.send(
    JSON.stringify({
      type: "info",
      message: "Connected to RoxxieBot Twitch event relay.",
    })
  );
});

// ----- TWITCH CLIENT -----
const client = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true, secure: true },
  channels: [TWITCH_CHANNEL],
});

client
  .connect()
  .then(() => {
    console.log("✅ Connected to Twitch channel:", TWITCH_CHANNEL);
    broadcast({
      type: "info",
      message: `Connected to Twitch channel: ${TWITCH_CHANNEL}`,
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to Twitch:", err);
  });

// ----- EVENT HANDLERS -----

// Chat (for logging / future commands)
client.on("message", (channel, tags, message, self) => {
  if (self) return;
  const username = tags["display-name"] || tags["username"] || "unknown";
  broadcast({
    type: "chat",
    platform: "twitch",
    username,
    message,
	self,
	tags
  });
});

// New sub
client.on("subscription", (channel, username, method, message, userstate) => {
  const plan = userstate["msg-param-sub-plan"] || "1000";
  broadcast({
    type: "subscription",
    platform: "twitch",
    username,
    tier: plan,
  });
});

// Resub
client.on("resub", (channel, username, months, message, userstate) => {
  const plan = userstate["msg-param-sub-plan"] || "1000";
  broadcast({
    type: "resub",
    platform: "twitch",
    username,
    tier: plan,
    months,
  });
});

// Gifted sub (single)
client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
  const plan = userstate["msg-param-sub-plan"] || "1000";
  broadcast({
    type: "subgift",
    platform: "twitch",
    gifter: username,
    recipient,
    tier: plan,
  });
});

// Bits / cheers
client.on("cheer", (channel, userstate, message) => {
  const username = userstate["display-name"] || userstate["username"] || "unknown";
  const bits = parseInt(userstate["bits"] || "0", 10);
  broadcast({
    type: "cheer",
    platform: "twitch",
    username,
    bits,
  });
});

// Disconnect info
client.on("disconnected", (reason) => {
  console.log("Disconnected from Twitch:", reason);
  broadcast({ type: "info", message: "Disconnected from Twitch: " + reason });
});

// ----- START SERVER -----
server.listen(PORT, () => {
  console.log("🌐 RoxxieBot-Backend listening on port", PORT);
});


//below it  the json and  YouNow connect stuff 

async function GiveVip(request,response,usr,to,sar,stick){
	
	var data = fs.readFileSync("vipboard.json");
	var myObject=[];
	var myObject = JSON.parse(data)
	const foundFromName = myObject.findIndex(p => p.username === usr);
	const foundToName = myObject.findIndex(p => p.username === to);
	
	console.log("Old version");
	console.log(myObject);


	// check if  user exist , check if to exist (if not) add , check if  from has amount of stickers otherwise throw error 
	if(foundFromName >=0){
		if((myObject[foundFromName].stars >=sar)&&(myObject[foundFromName].stickers>=stick))
		{
			
			if(foundToName >-1){
			
				myObject[foundFromName].stickers =parseInt(foundFromName) - parseInt(stick);
				myObject[foundToName].stickers = parseInt(foundToName) + parseInt(stick);
				
				myObject[foundFromName].stars = parseInt(myObject[foundFromName].stars) - parseInt(sar) 	
				myObject[foundToName].stars = parseInt(myObject[foundToName].stars) + parseInt(sar) ;
				//console.log(myObject);
				//response.send("Updated");
			
			saveVipBoard(request,response,myObject,"Updated");

							}
			else{
				myObject[foundFromName].stickers =parseInt(foundFromName) - parseInt(stick);
				myObject[foundFromName].stars = parseInt(myObject[foundFromName].stars) - parseInt(sar) 	
				let newData = {
								username:to,
								stars:sar,
								stickers:stick
							};
				myObject.push(newData);
				
				//console.log(myObject);
				//response.send("Added new ");
				
			saveVipBoard(request,response,myObject,"Added New");
			}
			
		}
		else{
			
			//throw error
			response.send("Sender does not have enough stars!");
			
		}
	}
	else{
		
		//throw error user does not exist 
		response.send("User does not exist."); 
	}
	
}
async function VipSave(request,response,plat,usr,sar,stick){
		
var data = fs.readFileSync("vipboard.json");
var myObject=[];
var name=usr;
var myObject = JSON.parse(data)	
const foundName = myObject.findIndex(p => p.username === name);
 if(foundName>-1){
	 // update 
myObject[foundName].id=plat;
myObject[foundName].stars =sar;	 
myObject[foundName].stickers =stick;	 
let newData= myObject;
 }
 else{
// add a new name
// Defining new data to be added
 let newData = {
  id:plat,
  username:usr,
  stars:sar,
  stickers:stick
};
console.log(newData);
if(Array.isArray(myObject)){

		console.log("Is an array"); 
		
}
else{
	console.log("Is not an array");
	
	
}
// Adding the new data to our object
myObject.push(newData);	 
	 
 }
var newData2 = JSON.stringify(myObject);

fs.writeFile("vipboard.json", newData2, (err) => {
  // Error checking
  if (err) throw err;
response.send("New data added");
});

}
function saveVipBoard(request,response,myObject,msg){
	
	var newData2 = JSON.stringify(myObject);

fs.writeFile("vipboard.json", newData2, (err) => {
  // Error checking
  if (err) throw err;
response.send("Status :"+msg );
});

	
}


async function getJsonStuff(targetUrl,req,res){
var cookies2='slt=bd11a427-2fd0-4722-b44f-aeb1b7be2fc0;PHPSESSID=41c1ae87b70725fd1e45ca14a590e07b';

let headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9","Accept-Language": "en,en-US;q=0.9","Cookie":cookies2}; 
			
	
	
	 var json = fetch ( targetUrl,{headers})
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            let done = JSON.parse (json);
         var test =Object.keys(done);
		 var i =0; 
	
		res.send(done);
			
			
        })
        .catch (e =>
        {
			console.log(e); 
        });
	
	
}
