var triggers_pulled="";
var obstriggers ="";
	const obs = new OBSWebSocket();

var recordOnlyOnces= false;
var stopOnlyOnce =false;
var withOutOBS = false; 
loadTriggers();



async function updateMediaSource() {
  try {
    // 1. Connect to OBS (default port 4455)
   	await obs.connect('ws://localhost:4455');
	
    console.log('Connected to OBS Studio');

    // 2. Change the media file
    await obs.call('SetInputSettings', {
      inputName: 'default', // Name of the source in OBS
      inputSettings: {
        local_file: 'D:/tools/katie.mp4' // Full system path
		
      }
    });
 await obs.call('TriggerMediaInputAction', {
      inputName: 'default', // Name of your media source
      mediaAction: 'OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PLAY'
    });
    console.log('Media source updated successfully.');

  } catch (error) {
    console.error('Connection or update failed:', error.message);
  } finally {
    await obs.disconnect();
  }
}

//updateMediaSource();


async function StartOBSRecording(){
console.log("here");
	
	try{
		await obs.connect('ws://localhost:4455');
		//console.log("All good here");
		 
	await obs.call('ToggleRecord');
	//	await obs.call('StartRecord');
	}
	catch(error){
		console.log("Something went wrong." + error);
	}	
}
async function StartOBSRecording2(){
		
		await obs.connect('ws://192.168.1.147:4455');
	//await obs.connect('ws://192.168.1.172:4457');
		//const obs2 = new OBSWebSocket();
	try{
	
		await obs.call('StartRecord');
		console.log("recording has started"); 
	}
	catch(error){
		console.log("Something went wrong." + error);
	}
}	

async function StopOBSRecording(){
	console.log("here");
	
	 try{
			
			 obs.call('ToggleRecord');
			//await obs.call('StopRecord');
			console.log("recording has stopped"); 
	 }
	 catch(error){
		 console.log("Something went wrong");
		 
		 
	 }
}	

async function begin(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString); 
	
	var first = urlParams.get("YouNowID"); 
		withOutOBS= urlParams.get("obs");

	
if(withOutOBS!=false)
{
	await obs.connect('ws://localhost:4455');
}

	var OfflineOrOnline =urlParams.get("online");
		if(OfflineOrOnline !=null){ 
				
				


}
else{
	
	
}
	 	var urls2 = "http://192.168.1.172:8080/chat/"+first;
//console.log(urls2)
	
	const response = await fetch(urls2);
	const data2 = await response.json();
	singleLine(data2.comments);

}

async function loadTriggers(){
	
	/*var urls2 = "http://localhost:8080/public/triggers/james_triggers.txt";
	
	const response = await fetch(urls2);
	const data2 = await response.text();
	obstriggers= data2.split("\r");
	console.log("Got Triggers");
	*/
	const data2="!brb,BRB\r!katie,katie\r!roxxie,roxxie\r!shana,shana\r!nathan,nathan"
	obstriggers=data2.split("\r");
	console.log("Loaded triggers");
	
	}
	
	function checkForTrigger(txt){
		var lens=obstriggers.length
		var x =0;
		
		while(x < lens)
		{
			var states= obstriggers[x].split(",");
				if(states[0].includes(txt)){
					return(states[1]);
					break;
		}
			
			x++;
			
		}
	
		
		return null;
		
	}
	function singleLine(sub){
	
		
		var x=0; 
		var out = "<div style='chat'>"; 
		var temp ='';
		if(sub !=null){
		while(x < sub.length){
			//console.log(sub[x]);
			
		if(lastupdate !="" ){
	
				var tims=timeConverter(sub[x]['timestamp']);
				var timeParts = tims.split(":"); 
					var userName= sub[x].name	
					
			if((sub[x]['timestamp'] > lastupdate )){
				
				
			if(SMin<timeParts[1])
			{
			if(timeParts[0]===SHour){
				console.log(timeParts[0]);
			}
			else{
				
			console.log(tims+" "+userName+" "+sub[x].comment);		
		out=out+ "<div class=msg><font color='red'>"+userName+"</font> "+sub[x].comment +"</div><br>";

if(sub[x]['broadcasterMod']!=true)
{
	
}
else{
		// out=out+ "<div class=msg><font color='red'>"+userName+"</font> "+sub[x].comment +"</div><br>";
	
	
}


			}
			}
			
			else if ((timeParts[0]!=SHour)){
				 console.log("Is mod "+sub[x]['broadcasterMod'] + " " )
				}
				else{
				
					
				}

		
		
			if(!(userName.includes("Chat_bot"))){
				//out = out +"\n" + "<div> <b>"+sub[x].name +"</b> " +sub[x].comment +"</div> "
				}
			 if((sub[x].comment.includes("!"))&&(!(sub[x].comment.includes("!record")))&&(!(sub[x].comment.includes("!stop")))){
			var callfor = checkForTrigger(sub[x].comment);
				if(callfor !=null)
				{
					obsTest(callfor);
				}
				
		}
			
			var temp = sub[x].comment
			var temp=temp.toUpperCase();
			
			if((temp.includes("!ROXXIE"))){
				obsTest("roxxie");
			}
		
			else{
				
				
			}
			}
			
			else{
				
				
			
			}
	
			temp=sub[x]['timestamp'];
			//console.log(temp);
		}
		else{
			lastupdate = sub[x]['timestamp'];
		console.log(lastupdate);
		}
	
	
	

		x++;
		
		}
		}
		else{
			out= "<div>" + "Offline" + "</div>";
		} 
		
		
		if((temp >lastupdate) ||(sub ===null)){
		
		lastupdate = temp; 
		var lastc= document.getElementById("results").innerHTML
		document.getElementById("results").innerHTML = lastc+out+ "</div>"		
		}
	


	}
	
async function obsTest(sceneName){
	if(!(triggers_pulled.includes(sceneName)))
	{

	const {currentProgramSceneName} = await obs.call('GetCurrentProgramScene');
	// connect to obs-websocket running on localhost with same port
	
	console.log(currentProgramSceneName)
	if(currentProgramSceneName!=sceneName){
	
	await obs.call('SetCurrentProgramScene', {sceneName: sceneName});	
	setTimeout(function() {
	
	obs.call('SetCurrentProgramScene', {sceneName: 'test'});	
  
}	, 19100);


	}
	else{
	//console.log(currentProgramSceneName)
		await obs.call('SetCurrentProgramScene', {sceneName: 'test'});		
	}
	
	
	await obs.call('SetCurrentProgramScene', {sceneName: sceneName});
	triggers_pulled = triggers_pulled+ " " + sceneName;
	

	}
	else{
			
	}
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

