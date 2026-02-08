const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const date = new Date();

var checkname= months[date.getMonth()]+"_"+"RoxxieToxxic_vipboard2.json";


async function loadJson(){
		//console.log(serverURL+'vipboard2.json');
	const testname=serverURL+months[date.getMonth()]+"_"+tsoh+'_vipboard2.json';
	
	  try {
        const response = await fetch(testname);
		console.log(testname);
        const data = await response.text();
		//console.log(data);
		loadViewers(data);
	  
    } catch (error) {
	   console.error('Error fetching data:', error);
    }
}
async function AddNew(id,name,stars,stick)
{
const data = {di:id,name:name,stars:stars,stickers:stick,streamer:tsoh};
	
	
	  try {
        const response = await fetch(serverURL+"vip",
		{
		method: 'POST', // Specify the method
		headers: {
        'Content-Type': 'application/json',
					},
		body: JSON.stringify(data),});
		
        const data2 = await response.text();
		
		console.log(data2);
		
	  
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function AddNew2(id,name,stars,stickers){
	//request.query.name,request.query.stars,request.query.stickers
	  try {
        const response = await fetch(serverURL+"vip?di="+id+"&name="+name+"&stars="+stars+"&stickers="+stickers+"&streamer="+tsoh);
		
		
		console.log(serverURL+"vip?di="+id+"&name="+name+"&stars="+stars+"&stickers="+stickers+"&steamer="+tsoh);
		
        const data = await response.text();
		
		console.log(data);
		
	  
    } catch (error) {
        console.error('Error fetching data:', error);
    }
	
}
