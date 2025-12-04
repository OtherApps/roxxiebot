	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString); 
	var YouNowUserName = urlParams.get("YouNowUserName"); 
	var twitchUserName=urlParams.get("TwitchId");
	
//const serverURL= "https://swan-tight-porpoise.ngrok-free.app/"; 	
var fixurl = "https://swan-tight-porpoise.ngrok-free.app/raw?url=";

window.setInterval(function() {
			getUserID();
			}, 10000);

		
function getUserID(){


	if(YouNowUserName!=null){
		getUserID2(YouNowUserName)
	
	}
	else{
		getUserID2("RoxxieToxxic"); 
		
	}

	
}

async function getUserID2(username){

	var urls = fixurl+"https://api.younow.com/php/api/broadcast/info/curId=0/user=" + username; 


	const response3 = await fetch(urls);
	const data3 = await response3.json();


	

	if((data3.errorCode!=0)){
	
		//console.log(data3);
	
		
		}
		
		else{
displayComment(data3.comments);
//console.log(data3.comments);


			
		}
			
}
var lastposted = null;
function displayComment(MSG){

		var outstuff="";
		var temp;
		var i =0
		while(i < Object.keys(MSG).length){
		if(lastposted !='')
		{
			if(MSG[i]['timestamp'] > lastposted){
				if((MSG[i]['comment'] !=null)){
				
				if(MSG[i]['comment'].includes("!add")){
				
					var temp=MSG[i]['comment'].split("!add");
					var getstuff=temp[1].split(" ");
					var usr= getstuff[1]; 
					var amt=getstuff[2];
					const viewer = ensureViewer("younow", usr);
					
					//console.log(viewer);
					//150 pound
						addStars2 (viewer, amt,"YouNow",4)
						outstuff = temp[1];
					
				}
				
				else{
			
				}
			
		if(MSG[i]['comment'].includes("Gave the Pearl Tip gift")!=false){
		}
		else{
	//	SubIt("<div>"+MSG[i]['comment']+"</div>");
			}	 
				}
				temp = MSG[i]['timestamp'] ;
	
					}
			else{
				
			}
			
		}

		else{
			lastposted = MSG[i]['timestamp'];
		}

		i++;
		}

		if((temp > lastposted)){
			
			lastposted= temp 
			
			
		
		}
	if (outstuff >  " ")
{
SubIt(outstuff) 
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

function SubIt(str){

console.log(str);


}