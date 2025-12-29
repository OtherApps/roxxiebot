
function adjustNames(data){
var i ="";


}
function specialAdd(){

if(currentViewer!=null){

var rtss = document.getElementById("CustomStar").value||0;
var stixkers=document.getElementById("CustomStickers").value||0;


addStars2(currentViewer, rtss, "Custom stars" ,stixkers);
}

}
function loadViewers(data) {
console.log("Loading viewers");

	const raw=data;
	if (!raw) { viewers = []; return; }
		try { viewers = JSON.parse(raw) || []; } catch(e) { console.log(e);viewers = []; }
		
		viewers.forEach(v => { 
		if (typeof v.stars === "undefined")
		{v.stars = 0}else{
		v.stars=parseInt(v.stars);
		
		};
		if(isNaN(v.stickers)){
		v.stickers=0}
		});
	
	adjustNames(viewers);
	renderLeaderboard()
  
}
function saveViewers() { 

localStorage.setItem("roxStarsDB_christmas", JSON.stringify(viewers));

 }
function getId(platform, username) { return platform + ":" + username.toLowerCase().trim(); }
function ensureViewer(platform, username) {
  const id = getId(platform, username);
  let vi = viewers.findIndex(x => x.username === username);
  let v= viewers[vi];
  
  if (!v) { v = { id, platform, username: username.trim(), stars: 0 }; viewers.push(v); saveViewers(); }
  return v;
}
function addStars(v, base, sourceLabel) {
  let amount = doubleStars ? base * 2 : base;
  v.stars = parseInt(v.stars)+parseInt(amount);
  if (v.stars < 0) v.stars = 0;
  console.log(v);
  
 // AddNew(v.platform,v.username,v.stars,v.stickers);
  //add stickers to array and save
  
  
  //saveViewers();
  renderLeaderboard();
  updateCurrentViewerLabel();
  logLive("+" + amount + "⭐ to " + v.username + " (" + sourceLabel + ")");
}
function addStars2(v, base, sourceLabel,stick) {
  let amount = doubleStars ? base * 2 : base;
  v.stars = parseInt(v.stars)+parseInt(amount);
  
  if((isNaN(v.stickers)!=true)||(v.stickers!=null)){
  v.stickers=parseInt(v.stickers)+parseInt(stick);
  }
  else
  {
  v.stickers= parseInt(stick); 
  
  }
  //console.log();
  
  if (v.stars < 0) v.stars = 0;
  //console.log(stick);
	AddNew(v.platform,v.username,v.stars,v.stickers);
	//console.log(v);

  renderLeaderboard();
  updateCurrentViewerLabel();
  logLive("+" + amount + "⭐ to " + v.username + " (" + sourceLabel + ")");
}

function adjustAggregate(username, delta) {
  
  const key = username.toLowerCase();
  const id = "manual:" + key;
  let v = viewers.findIndex(x => x.username ===username);
	
	viewers[v].stars +=delta;
	console.log(viewers[v].stars)
	AddNew(viewers[v].platform,viewers[v].username,viewers[v].stars,viewers[v].stick);
	renderLeaderboard();
	updateCurrentViewerLabel();
	logLive((delta>0?"+":"") + delta + "⭐ manual adjust for " + username);
}
function aggregated() {
  const map = {};
 
  viewers.forEach(v => {
 
    const key = v.username.toLowerCase();
    if (!map[key]) map[key] = { key, username: v.username, stars: 0 };
    map[key].stars += v.stars;
  });
 //console.log(Object.values(map));
  
  
  
  return Object.values(map);
}
function renderLeaderboard() {
//loadJson(); 
 const tbody = document.getElementById("leaderboard-body");
  const oldRows = Array.from(tbody.querySelectorAll("tr[data-id]"));
  const oldPos = {};
  oldRows.forEach(r => oldPos[r.dataset.id] = r.getBoundingClientRect().top);
  const sorted = aggregated().sort((a,b)=>b.stars-a.stars);
  const rowMap = {};
  
  oldRows.forEach(r=>rowMap[r.dataset.id]=r);
  tbody.innerHTML = "";
  //console.log(viewers);
  
  sorted.forEach((u, i)=>{
    let row = rowMap[u.key];
    if (!row) { row = document.createElement("tr"); row.dataset.id = u.key; }
    else { row.innerHTML = ""; }
	
	const ix=viewers.findIndex(p => p.username === u.username);
	
    row.innerHTML = `
      <td>${i+1}</td>
      <td>${u.username}</td>
      <td>${u.stars}</td>
	  <td>${viewers[ix].stickers}</td>
      <td>
        <button class="btn btn-ghost" onclick="adjustAggregate('${u.username}',5)">+5⭐</button>
        <button class="btn btn-ghost" onclick="adjustAggregate('${u.username}',-5)">-5⭐</button>
      </td>
    `;
    tbody.appendChild(row);
  });
  const newRows = Array.from(tbody.querySelectorAll("tr[data-id]"));
  newRows.forEach(row=>{
    const id=row.dataset.id;
    if (oldPos[id]!=null){
      const newY=row.getBoundingClientRect().top;
      const delta=oldPos[id]-newY;
      if (Math.abs(delta)>2){
        row.style.transform=`translateY(${delta}px)`;
        row.classList.add("moved");
        requestAnimationFrame(()=> row.style.transform="" );
      }
    }
  });
}
function updateCurrentViewerLabel() {
  const label = document.getElementById("current-viewer-label");
  if (!currentViewer) { label.textContent = "No viewer selected."; return; }
  //console.log(parseInt(currentViewer));
  
  const list = aggregated();
  const entry = list.findIndex(u => u.username === currentViewer.username);
  const total = entry ? currentViewer.stars : 0;
  label.textContent = "Current: " + currentViewer.username + " – Total Stars (all platforms): " + total + "⭐";
}
function logLive(msg) {
  const pre = document.getElementById("live-log");
  if (!pre) return;
  const now = new Date();
  const stamp = now.toLocaleTimeString();
  const line = "[" + stamp + "] " + msg;
  const lines = pre.textContent.split("\n").filter(Boolean);
  lines.unshift(line);
  pre.textContent = lines.slice(0, 120).join("\n");
}
document.getElementById("ensure-viewer-btn").onclick = () => {
  const p = document.getElementById("platform-select").value;
  const u = document.getElementById("username-input").value.trim();
  if (!u) { alert("Enter username"); return; }
  currentViewer = ensureViewer(p, u);
  renderLeaderboard();
  updateCurrentViewerLabel();
  logLive("Selected viewer: " + currentViewer.username + " [" + p + "]");
};
document.getElementById("double-stars-toggle").onchange = e => {
  doubleStars = e.target.checked;
  logLive("Double Stars Mode: " + (doubleStars ? "ON" : "OFF"));
};
document.querySelectorAll("button[data-event]").forEach(btn => {
  btn.onclick = () => {
    if (!currentViewer) { alert("Select a viewer first"); return; }
    const e = btn.dataset.event;
    const map = {
      "tier1-sub": { stars:10,stickers:1,label:"Tier 1 Sub" },
      "tier2-sub": { stars:20,stickers:2,label:"Tier 2 Sub" },
      "tier3-sub": { stars:35, stickers:3,label:"Tier 3 Sub" },
      "gift-sub": { stars:10,stickers:1,label:"Gifted Sub" },
      "wishlist": { stars:10, stickers:0,label:"Wishlist / Physical Gift" },
      "bits-1000": { stars:10,stickers:0,label:"1000 Bits" },
      "coins-1000": { stars:10,stickers:0,label:"1000 Coins" },
      "top-sub-gifter": { stars:5, stickers:0,label:"Top Sub Gifter" },
      "top-tiktok-gifter": { stars:5,stickers:0,label:"Top TikTok Gifter" },
      "top-bit-giver": { stars:5,stickers:0, label:"Top Bit Giver" },
      "beat-intro-win": { stars:4,stickers:0,label:"Beat Intro Winner" },
      "beat-intro-second": { stars:3,stickers:0,label:"Beat Intro 2nd" },
      "discord-boost": { stars:3,stickers:0,label:"Discord Boost" },
      "jumpscare": { stars:2,stickers:0,label:"Jumpscare" },
      "correct-answer": { stars:2, stickers:0,label:"Correct Answer" }
    };
    const def = map[e];
    if (!def) return;
	//console.log(def);
    addStars2(currentViewer, def.stars, def.label,def.stickers);
  };
});
document.getElementById("reset-stars-btn").onclick = () => {

};
