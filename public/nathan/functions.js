const serverURL= "http://192.168.1.147:8080/"; 

async function loadJson(){
	  try {
        const response = await fetch(serverURL+'vipboard.json');
        const data = await response.text();
		loadViewers(data);
	  
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}
async function AddNew(id,name,stars,stickers){
	//request.query.name,request.query.stars,request.query.stickers
	  try {
        const response = await fetch(serverURL+"vip?di="+id+"&name="+name+"&stars="+stars+"&stickers="+stickers);
		console.log(serverURL+"vip?di="+id+"&name="+name+"&stars="+stars+"&stickers="+stickers);
		
        const data = await response.text();
		
		console.log(data);
		
	  
    } catch (error) {
        console.error('Error fetching data:', error);
    }
	
}
