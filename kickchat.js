const WebSocket = require('ws'); 

const date = new Date();
var username;
var lastposted='';


if(process.argv[2] !=null ){
	username = process.argv[2];
	
}
else{
	
	username = '460187';    //roxxies
}



var fulldate= "./logs/kick_"+date.getHours()+"-"+ date.getMinutes()+"-"+ date.getMonth()+ "_"+date.getDate()+"_" +date.getFullYear()+"_" + username;
console.log("Logging for " + username); 

function begin(chatroomID){

    const chat = new WebSocket('wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false');
	
//getBadges();
	
    chat.onerror = (error) => {
        console.log("Error: " + error);
    };

    chat.onopen = () => {
        console.log("Connected to Pusher");
   
        setTimeout(() => {
           // document.getElementById("loading").style.display = "none";
        }, 1000);
        chat.send(
            JSON.stringify({
                event: 'pusher:subscribe',
                data: {
                    auth: "",
                    channel: `chatrooms.${chatroomID}.v2`
                },
            })
        );
        chat.send(
            JSON.stringify({
                event: 'pusher:subscribe',
                data: {
                    auth: "",
                    channel: `channel.${chatroomID + 2}`
                },
            })
        )
    };
	
    chat.onmessage = (event) => {
		//console.log(event);
		//console.log(event.data);
dealwithmsg(event.data);		
// parseMessage(event.data);
 
    };

    // Ping every 1 minute to keep the connection alive
    setInterval(() => {
        chat.send(JSON.stringify({
            event: 'pusher:ping',
            data: {}
        }));
    }, 6000);

	
}

function dealwithmsg(rawdata){
	msg=JSON.parse(rawdata);
	
	const data = JSON.parse(
        msg.data.replace(/\\u00a0/g, " ")
            .replace(/\\n/g, " ")
            .replace(/\\t/g, " ")
            .replace(/\\r/g, " ")
            .replace(/\\f/g, " ")
            .replace(/\\b/g, " ")
            .replace(/\\v/g, " ")
            .replace(/\\\\/g, "\\")
    );
	//console.log(data.sender);
	

	if (msg.event === "App\\Events\\ChatMessageEvent") {
      //  handleMessage(data);
	
	 	let msgID = data.id;
    let msgContent = data.content;
    let msgSender = data.sender.username;
    let msgTimestamp = data.created_at;
		if(msgSender!='BotRix'){
			console.log(msgSender+ " " +data.content);
			
			writeLog( msgSender+ " " +data.content+"\n\r");	
		}
	  //
	 // break;
    }
	else if(msg.event === "App\\Events\\GiftedSubscriptionsEvent" ){
	
	
		console.log(msg);
		
	
	//	break; 
	}
}

function checksubs(data){
	var x=0;
	   var isSub=false;
	while(x !=data.length){
		//console.log(data[x].type);
		if(data[x].type !="subscriber"){}
		else{
			
		isSub=true;
			break;
			
		}
		x++;
		
	}
	return isSub;
	
}


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  if(sec <10 ){
	sec ="0"+sec

  }
  if(hour <10) {
	hour = "0" + hour;

  }
  if(min <10){
	min = "0" + min

  }
  var time =   hour + ':' + min ;
  return time;
}

function writeLog(data){
		const fs = require("fs");
	  fs.appendFile(fulldate+'.txt',
	  `${data}`
	,()=>{
	 //console.log('Successfully saved');
	})

	}
	
	
begin(460187)
