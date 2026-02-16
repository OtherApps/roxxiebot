

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


async function postPHP(di,name,stars,stick){
	
	const params = new URLSearchParams();
	
	params.append('id',0);
	params.append('username',name);
	params.append('points',stars);
	params.append('stickers',stick);
	params.append('db',tsoh);
	params.append('streamer',tsoh)
	params.append('note',di)
	const response = await fetch('http://192.168.1.172/SavePoints.php', {
					
					method: 'POST',
					body: params // Automatically sets Content-Type to application/x-www-form-urlencoded
  });
	
	const data2 = await response.text();
		
		console.log("done");
	
}

async function AddNew3(di,name,stars,stick){
const data = {id:di,username:name,points:stars,stickers:stick,db:tsoh};
	//SavePoints($conn,$_POST['db'],$_POST['id'],$_POST['username'],$_POST['points'],$_POST['note'],$_POST['stickers'],$formmatedDate);
	var url2 ="http://192.168.1.172/SavePoints.php"
	  try {
        const response = await fetch(url2,{
			method: 'POST', // Specify the method
		
		headers: {
        'Content-Type': 'application/json', // Required for JSON
					},
		body: JSON.stringify(data)});
		
        const data2 = await response.text();
		
		console.log(data2);
		
	  
    } catch (error) {
		console.log("PHP post error");
		
        console.error('Error fetching data:', error);
    }
	//AddNew3(di,name,stars,stick);
}

async function AddNew(id,name,stars,stick){
const data = {di:id,name:name,stars:stars,stickers:stick,streamer:tsoh};
	//SavePoints($conn,$_POST['db'],$_POST['id'],$_POST['username'],$_POST['points'],$_POST['note'],$_POST['stickers'],$formmatedDate);
	
	  try {
        const response = await fetch(serverURL+"vip",{
			method: 'POST', // Specify the method
		
		headers: {
        'Content-Type': 'application/json', // Required for JSON
					},
		body: JSON.stringify(data)});
		
        const data2 = await response.text();
		
		console.log(data2);
		
	  
    } catch (error) {
        console.error('Error fetching data:', error);
    }
	
	postPHP(id,name,stars,stick);
	
}
async function AddNew2(id,name,stars,stickers){
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
