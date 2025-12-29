 async function connectOBS() {
            const password = document.getElementById('obsPassword').value;
            try {
                // OBS v28+ uses port 4455 by default
                await obs.connect('ws://127.0.0.1:4455', password);
                statusDiv.innerText = "Status: Connected";
                statusDiv.className = "status connected";
                console.log('Connected to OBS');
            } catch (error) {
                alert('Connection Failed: ' + error.message);
                console.error(error);
            }
        }

        async function startRecording() {
            try { await obs.call('StartRecord'); } catch (e) { console.error(e); }
        }

        async function stopRecording() {
            try { await obs.call('StopRecord'); } catch (e) { console.error(e); }
        }

        async function toggleMute() {
            try {
                // Change 'Mic/Aux' to the exact name of your audio source in OBS
                await obs.call('ToggleInputMute', { inputName: 'Mic/Aux' });
            } catch (e) { console.error(e); }
        }

        // Listen for OBS events
        obs.on('ExitStarted', () => {
            statusDiv.innerText = "Status: Disconnected (OBS Closed)";
            statusDiv.className = "status disconnected";
        });

async function getgifts(){
			
			var url="https://ynassets.younow.com/giftsData/live/en/data.json"
		
getData(url)
.then( data=> {
gifts=data;

});
	
		}
		
		// fetch chat 
		
		function fetchChat(username){
		
			var url=server+"chat/"+ username; 
	//console.log(gifts);
	
		
	getData(url)
	.then( data=> {

		dealwithchat(data);

	});
		
		}
		function dealwithchat(data){
		
		var special_prices=data.dynamicPricedGoodies;
		var outstuff="";
		var temp; 
		var i=0;
		var MSG=data.comments;
		
		while(i<Object.keys(MSG).length){
		
			if(lastposted!=''){
					
					if(MSG[i]['timestamp'] > lastposted){
						
						if((MSG[i]['comment'] !=null))
						{
						if((MSG[i]['textStyle']===1)){
						
							console.log("Is a gift " + MSG[i]['comment'] + " gifted at " +timeConverter(MSG[i]['timestamp'])+ " " +MSG[i]['name']);
					
					
						
						}
						
					else{
						
					
					
					}
						
						}
					
					}
						temp = MSG[i]['timestamp'] ;
			
			}
			else{
			
			
				lastposted = MSG[i]['timestamp'];
			}
		
		i++;
		
		}
		if((temp > lastposted)){
			
			lastposted= temp 
			
			
		
		}
		
		
		}
		async function getData(urls) {

  const url = urls;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

return result;

	
  
  } catch (error) {
    console.error(error.message);
  }
  
//return(gifts);

  
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

	
