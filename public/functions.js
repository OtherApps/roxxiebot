//const serverURL= "http://localhost:8080/"; 
const serverURL= "./"; 
async function loadJson(){
	  try {
        const response = await fetch('./vipboard.json');
        const data = await response.text();
		loadViewers(data);
	  
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}
async function AddNew(id,name,stars,stickers){
	//request.query.name,request.query.stars,request.query.stickers
	  try {
        const response = await fetch(serverURL+"vip?id="+id+"&name="+name+"&stars="+stars+"&strickers="+stickers);
        const data = await response.text();
		
		console.log(data);
		
	  
    } catch (error) {
        console.error('Error fetching data:', error);
    }
	
}
