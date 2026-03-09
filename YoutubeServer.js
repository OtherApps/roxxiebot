const date = new Date();
const fs = require("fs").promises;
const path = require("path");

const { LiveChat } = require("youtube-chat");
const io = require("socket.io")(3000, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});
const ids="";

let liveChat;
let msgCount = 0;


function startChat(channelId) {
    if (liveChat) {
        liveChat.stop();
        msgCount = 0; 
        console.log(`Stopped previous stream. Resetting counter.`);
    }

    liveChat = new LiveChat({ channelId });

    liveChat.on("chat", (chatItem) => {
		console.log(chatItem);
		
        msgCount++;
        io.emit("message", { type: 'chat', data: chatItem, count: msgCount });
		savemsg(channelId,chatItem);
		
    });

    liveChat.on("superChat", (superChat) => {
        msgCount++;
        io.emit("message", { type: 'superChat', data: superChat, count: msgCount });
    });

    liveChat.start()
        .then(() => console.log(`Connected to YouTube Channel: ${channelId}`))
        .catch(err => console.error("Connection Error:", err));
}

io.on("connection", (socket) => {
    console.log("Overlay/Admin Connected");
  
  
    socket.on("change-channel-yt", (newId) => {
        console.log(`Switching to Channel ID: ${newId}`);
        startChat(newId);
    });
	
	    socket.on("change-channel-witch", (newId) => {
        console.log(`Switching to Channel ID: ${newId}`);
        startTwitch(newId);
    });
	
});

async function savemsg(id,data){
	
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var checkname= months[date.getMonth()]+"_"+date.getDate()+"_"+id+"_YoutubeChat.log";
	
	const content = data.message.map(run => {
                if (run.text) return `<span>${run.text}</span>`;
                if (run.emoji) return `<img src="${run.emoji.thumbnails.url}" class="emote">`;
            }).join("");
			var output= "<strong>"+data.author.name+"</strong>:"+content+"\r";
			
var filenames=checkname
console.log(filenames);



fs.appendFile(checkname, output, err => {
  if (err) {
    console.error(err);
  } else {
    console.log('Content appended to file successfully!');
  }
});



}
function StartTwitch(ids){
	
	
	
	
}
// Start with a placeholder or your ID
//startChat(ids); 
