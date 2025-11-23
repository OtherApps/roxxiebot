// ========== WEBSOCKET CLIENT (CONNECT TO NODE SERVER) ==========
(function initWebSocket() {
  let ws;
  function connect() {
    try {
      ws = new WebSocket("ws://localhost:443");
      ws.onopen = () => {
        logLive("Connected to local Twitch event server (ws://localhost:443).");
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleServerEvent(data);
        } catch (e) {
          console.error("Failed to parse WS message", e);
        }
      };
      ws.onclose = () => {
        logLive("Disconnected from Twitch event server. Reconnecting in 5s...");
        setTimeout(connect, 5000);
      };
      ws.onerror = (err) => {
        console.error("WS error", err);
      };
    } catch (e) {
      console.error("Error opening WebSocket:", e);
    }
  }
  connect();
})();

// ========== HANDLE EVENTS FROM SERVER ==========
function handleServerEvent(evt) {
  if (!evt || !evt.type) return;
  switch (evt.type) {
    case "info":
      logLive(evt.message || "Info");
      break;
    case "chat":
	handlechat(evt);
	
    //  logLive(`[Twitch] ${evt.username}: ${evt.message}`);
      break;
    case "subscription":
      handleSubEvent(evt);
      break;
    case "resub":
      handleSubEvent(evt);
      break;
    case "subgift":
      handleGiftSubEvent(evt);
      break;
    case "cheer":
      handleCheerEvent(evt);
      break;
    default:
      console.log("Unhandled event from server:", evt);
  }
}

function handleSubEvent(evt) {
  const username = (evt.username || "").trim();
  const plan = evt.tier || "1000";
  if (!username) return;
  const viewer = ensureViewer("twitch", username);
  let stars = 10;
  if (plan === "2000") stars = 20;
  else if (plan === "3000") stars = 35;
  addStars(viewer, stars);
  logLive(`[AUTO] Sub from ${username} (tier ${plan}) -> +${stars}⭐`);
}

function handleGiftSubEvent(evt) {
  const recipient = (evt.recipient || "").trim();
  if (!recipient) return;
  const viewer = ensureViewer("twitch", recipient);
  const stars = 10; // Gifted sub -> 10 Stars to recipient
  addStars(viewer, stars);
  logLive(`[AUTO] Gifted sub to ${recipient} -> +${stars}⭐`);
}
function handlechat(evt){
	
	const msg=evt.message;	
	const usr=evt.username; 
	//const id=evt.tags.user-id; 
	//const mod=evt.tags.mod; 
	
	if(msg.includes("!add")!=false){
		var temp=msg.split("!add");
		var command=temp[1].split(" "); 
		
			if((command[1]!=null)&&(command[2]!=null)){
		
				const viewer = ensureViewer("twitch", command[1]);	
				addStars(viewer, command[2]);	
				//console.log(command);
				
			
		}
		else{
			
			console.log("Something went wrong");
			
			
		}
		//console.log(command)
	}
		else{
			
			
			
		}
		
		
//	console.log(evt);
	
	
}
function handleCheerEvent(evt) {
  const username = (evt.username || "").trim();
  const bits = parseInt(evt.bits || "0", 10);
  if (!username || !bits || bits <= 0) return;
  const viewer = ensureViewer("twitch", username);
  const stars = Math.floor(bits / 1000) * 10;
  if (stars <= 0) return;
  addStars(viewer, stars);
  logLive(`[AUTO] Cheer from ${username} (${bits} bits) -> +${stars}⭐`);
}
