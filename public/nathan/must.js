

function addStars2(v, base, sourceLabel,stick) {
	console.log("here");

	

  let amount = doubleStars ? base * 2 : base;
  v.stars = parseInt(v.stars)+parseInt(amount);
 
	
	 
  if((isNaN(v.stickers)!=true)||(v.stickers!=null)){
  v.stickers=parseInt(v.stickers)+parseInt(stick);
  }
  else
  {
  v.stickers= parseInt(stick); 
  
  }
console.log(v); 
v.platform = sourceLabel;
AddNew(v.platform,v.username,v.stars,v.stickers);
/*
  //console.log();
  
  if (v.stars < 0) v.stars = 0;
  //console.log(stick);
	

*/
	
}
function ensureViewer(platform, username) {
  const id = getId(platform, username);
  let vi = viewers.findIndex(x => x.username === username);
  let v= viewers[vi];
  
  if (!v) { v = { id, platform, username: username.trim(), stars: 0 }; viewers.push(v); }
  return v;
}
function getId(platform, username) { return platform + ":" + username.toLowerCase().trim(); }


async function AddNew(id,name,stars,stickers){
	//request.query.name,request.query.stars,request.query.stickers
	
			console.log(serverURL+"vip?di="+id+"&name="+name+"&stars="+stars+"&stickers="+stickers+"&streamer="+tsoh);

	  try {
        const response = await fetch(serverURL+"vip?di="+id+"&name="+name+"&stars="+stars+"&stickers="+stickers+"&streamer="+tsoh);
		
		
		console.log(serverURL+"vip?di="+id+"&name="+name+"&stars="+stars+"&stickers="+stickers+"&streamer="+tsoh);
		
        const data = await response.text();
		
	//	console.log(data);
		
	  
    } catch (error) {
        console.error('Error fetching data:', error);
    }
/**/
	
}
