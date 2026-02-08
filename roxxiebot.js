
// start of  discord npm stuff 
// install node-fetch@1.7.3  otherwise will get a fetch error
/*


*/
var express =  require('express'); 
var app = express(); 
const bodyParser= require('body-parser');
const fetch = require("node-fetch");
var jsonsave
var found=false;
const path2 = require('path');
const date = new Date();
const yad=date.getDate();



console.log("Running");
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var checkname= months[date.getMonth()]+"_"+"RoxxieToxxic_vipboard2.json";
var hist="history_"+checkname;


async function ensureFile(filePath, content){ 
const fs2 = require('fs').promises;
const path2 = require('path');
content=JSON.stringify(content);

  try {
    // 1. Ensure the parent directory exists first
    const dir = path2.dirname(filePath);
    await fs2.mkdir(dir, { recursive: true });

    // 2. Create the file ONLY if it doesn't exist
    // 'wx' flag: open for writing, fails if path exists
    await fs2.writeFile(filePath, content, { flag: 'wx' });
    console.log('File created successfully.');
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log('File already exists. No action taken.');
    } else {
      console.error('An error occurred:', err);
    }
  }
}
{}
// Usage
 const fdate2=months[date.getMonth()]+"-"+ date.getDate 
const defaultName=[{
username:"test",
  stars:0,
  stickers:0,
  etad:0
}]
ensureFile(checkname,defaultName );
ensureFile(hist,defaultName);

const fs = require("fs");
app.use(express.static('./'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.listen(8080);

app.get('/', (req, res) => {
    res.redirect('./public/nathan/?offline=true');
});
app.get("/getSubscribers/:ids",function(req,res){
	
	var url = "https://api.younow.com/php/api/channel/getSubscribers/channelId="+req.params.ids+"/"+"userId="+req.params.ids;
	 getJsonStuffWithoutCookies(url,req,res); 
	
	
})
app.get('/raw',(req,res)=>{
	
//console.log( req.query.url);
 getJsonStuff(req.query.url,req,res); 
//res.end();	//  getJsonStuff(getsub,req,res); 
	
})
app.get('/raw2',(req,res)=>{
	
//console.log( req.query.url);
 getJsonStuffWithoutCookies(req.query.url,req,res); 
//res.end();	//  getJsonStuff(getsub,req,res); 
	
})

app.get('/sub/:ids',function (req,res){
	//https://cdn.younow.com/php/api/channel/getTopSubGifters/channelId=51919855/locale=en/lang=en/numberOfRecords=12
var getsub ="https://cdn.younow.com/php/api/channel/getTopSubGifters/channelId="+req.params.ids+"/locale=en/lang=en/numberOfRecords=12";

	  getJsonStuff(getsub,req,res); 
	
})
app.get('/SubSave/data=:info',function (req,res){

var getsub =req.params.info;
console.log(getsub);

saveSubData(getsub,req,res); 
	
})

app.get('/chat/:path',function(req,res){
	
var url3= "https://api.younow.com/php/api/broadcast/info/curId=0/user="+req.params.path;
	
	  getJsonStuff(url3,req,res); 
});

app.get('/Guess',(req,res)=>{
	const UserName = req.query.username; // Accesses username
	const Guess = req.query.guess; // Accesses  guess
	//saveGuess(req,res,UserName,Guess)
	checkGuess(req,res,UserName,Guess);
	
	
	
});
app.get('/Song',(req,res)=>{
	
	const UserName = req.query.username; // Accesses username
	const Guess = req.query.song; // Accesses  guess
	//saveGuess(req,res,UserName,Guess)
	SongRequest(req,res,UserName,Guess);
	
	
});
function checkGuess(req,res,usr,smun){
	try {
		const data = fs.readFileSync('./public/Guess2.txt', 'utf8');
		//console.log('File content:', data);
			
			//var temp = data.split(","); 
			checkGuess2(req,res,usr,smun,data);
  
	} catch (err) {
		console.error('Error reading file synchronously:', err);
		res.send("Error");
		
	}
	
}


function checkGuess2(req,res,usr,smun,stuff){
	var output=1; 
	var temp = 	stuff.split(","); 
	
	temp.forEach((element)=>{
		var temp2= element.split(" "); 
		
		if((temp2[1]!=undefined)&&(temp2[0]!=undefined)){
			
			if((temp2[0].includes(usr)!=false)||(temp2[1].includes(smun)!=false)){
				output ="Found"; 
				
			}
		}

	});
if(output!=1)
{
res.send(output); 	
	
}
else{
	saveGuess(req,res,usr,smun);
	
}

}



function TopSubs(req,res,usr,nums){
	const fs = require('fs');
	
	const filePath = './public/'+date.getMonth()+'_TopSubs.txt';
	const dataToAppend = usr+" "+nums +",";

	fs.appendFile(filePath, dataToAppend, (err) => {
	  if (err) {
		console.error('Error appending to file:', err);
		return;
	  }
	  console.log('Top sub list has been saved!');
	});	
		res.send("Saved");

}
function SongRequest(req,res,usr,song){

	const fs = require('fs');
	const filePath = './public/Song.txt';
	const dataToAppend = usr+" "+song +",";

	fs.appendFile(filePath, dataToAppend, (err) => {
	  if (err) {
		console.error('Error appending to file:', err);
		return;
	  }
	  console.log('Song has been added');
	});	
		res.send("Saved");

}
function saveGuess(req,res,usr,smun){
	
const fs = require('fs');
const filePath = './public/Guess2.txt';
const dataToAppend = usr+" "+smun +",";

fs.appendFile(filePath, dataToAppend, (err) => {
  if (err) {
    console.error('Error appending to file:', err);
    return;
  }
  console.log('Data appended to file successfully.');
});	
	res.send("Saved");
}

function SaveCount(req,res,smun){
	
const fs = require('fs');
const filePath = './public/count.txt';
const dataToAppend = smun+",";

fs.appendFile(filePath, dataToAppend, (err) => {
  if (err) {
    console.error('Error appending to file:', err);
    return;
  }
  console.log('Data appended to file successfully.');
});	
	res.send("Saved");
}

app.get('/audience/:path/:nums', function(req, res) {
  // console.log('path:'+req.params.path);

var url2= "https://cdn.younow.com/php/api/broadcast/audience/broadcaster=0/channelId=" + req.params.path+"/start="+ req.params.nums; 

   
  getJsonStuff(url2,req,res); 
   
   
});
function  convertToJson(UserName,userId,values){

		var newobj = {UserName,userId,values}
		jsonsave = jsonsave+ newobj;
			
		console.log(JSON.stringify(newobj)); 
	
}



function saveSubData(data,req,res){
	const fileName =  "./sub.txt";
	var data2 =data +"\r";
	
	
	 fs.exists(fileName, function (exists) {
        if(exists){}else
        {
            fs.writeFile(fileName, {flag: 'w+'}, function (err, data2) 
            { 
              
            })
        }
    }
	
	
	);
	
	
	fs.appendFile(fileName, data2, (err)=>{
		
		if(err){
			console.log(err);
			
		}
		else{
			fs.readFileSync(fileName);
		
	}
		res.send("has been saved"); 
}
);	
	
}

app.get('/GiveVip',function (request,response){
//http://192.168.1.172:8080/GiveVip?usr=test&to=Hamez&sar=100&stick=1
GiveVip(request,response,request.query.usr,request.query.to,request.query.sar,request.query.stick)
	
}
	)
app.get('/vip',function (request,response){
	var  streamers=request.query.streamer ?? "RoxxieToxxic";
	var platform = request.query.di?? "twitch";
	
	VipSave(request,response,request.query.name,request.query.stars,request.query.stickers,streamers,platform);
	
})

async function GiveVip(request,response,usr,to,sar,stick){
	// update name part
	
	var data = fs.readFileSync("vipboard.json");
	var myObject=[];
	var myObject = JSON.parse(data)
	const foundFromName = myObject.findIndex(p => p.name === usr);
	const foundToName = myObject.findIndex(p => p.name === to);
console.log("Old version");

console.log(myObject);


	// check if  user exist , check if to exist (if not) add , check if  from has amount of stickers otherwise throw error 
	if(foundFromName >=0){
		if((myObject[foundFromName].score >=sar)&&(myObject[foundFromName].stickers>=stick))
		{
			
			if(foundToName >-1){
			
				myObject[foundFromName].stickers =parseInt(foundFromName) - parseInt(stick);
				myObject[foundToName].stickers = parseInt(foundToName) + parseInt(stick);
				
				myObject[foundFromName].score = parseInt(myObject[foundFromName].score) - parseInt(sar) 	
				myObject[foundToName].score = parseInt(myObject[foundToName].score) + parseInt(sar) ;
				//console.log(myObject);
				//response.send("Updated");
			
			saveVipBoard(request,response,myObject,"Updated",checkname2);

							}
			else{
				myObject[foundFromName].stickers =parseInt(foundFromName) - parseInt(stick);
				myObject[foundFromName].score = parseInt(myObject[foundFromName].score) - parseInt(sar) 	
				let newData = {
								name:to,
								score:sar,
								stickers:stick
							};
				myObject.push(newData);
				
				//console.log(myObject);
				//response.send("Added new ");
				
			saveVipBoard(request,response,myObject,"Added New",checkname2);
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
async function saveHistory(data){
	//console.log(data);
	
	var data2 = fs.readFileSync(hist);
	var myObject = JSON.parse(data2)||[{}];
	
	myObject.push(data);	
	var newData2 =JSON.stringify(myObject)
	fs.writeFile(hist, newData2, (err) => {
  // Error checking
  if (err) throw err;
  console.log("Logged added");
  
//response.send("New data added");
});


}
async function VipSave(request,response,usr,sar,stick,streamer,plat){

var checkname2= months[date.getMonth()]+"_"+streamer+"_vipboard2.json";
var hist2="history_"+checkname2;
ensureFile(checkname2,defaultName );
ensureFile(hist2,defaultName);
console.log("Saving to:" +checkname2);
try{
	var data = fs.readFileSync(checkname2);
	VipSave2(request,response,usr,sar,stick,streamer,plat)

}
catch (err) {
    // Handles errors like file not found or permission issues
    console.error('Error reading file:', err)
	response.send(err);
	
  }


}
async function VipSave2(request,response,usr,sar,stick,streamer,plat){


var checkname2= months[date.getMonth()]+"_"+streamer+"_vipboard2.json";
var hist2="history_"+checkname2;
ensureFile(checkname2,defaultName );
ensureFile(hist2,defaultName);

console.log("Saving to:" +checkname2);
var data = fs.readFileSync(checkname2);
var fdate=months[date.getMonth()] + "-" + date.getDate();

var myObject=[];
var name=usr;
myObject = JSON.parse(data)
var foundName;
if((typeof myObject==='object') && (myObject !==null))
{
 foundName= myObject.findIndex(p => p.username === usr);
}
else{
	foundName =-1
	
}
 if(foundName>-1){
	 // update 
myObject[foundName].stars =sar;	 
myObject[foundName].stickers =stick;	 
myObject[foundName].etad= fdate; 
myObject[foundName].id=plat;
 let newData2 = {
  username:usr,
  stars:sar,
  stickers:stick,
  etad:fdate,
  id:plat
};
let newData= myObject;
 //saveHistory(newData2);
 }
 else{
// add a new name
// Defining new data to be added
 let newData = {
  username:usr,
  stars:sar,
  stickers:stick,
  etad:fdate,
  id:plat
};
console.log(newData);
 //saveHistory(newData);
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

 
fs.writeFile(checkname2, newData2, (err) => {
  // Error checking
  if (err) throw err;
response.send("New data added");
});

}
function saveVipBoard(request,response,myObject,msg,streamdb){
	
	var newData2 = JSON.stringify(myObject);

fs.writeFile(streamdb, newData2, (err) => {
  // Error checking
  if (err) throw err;
response.send("Status :"+msg );
});

	
}

