

function dealWithMessage(usr,msg,flg,self,extra){
		
		let msgID = extra.id;
        let msgContent = handleEmo(msg,extra);
        let msgSender = usr;
       	
		var d =new Date();
		var joinStampH =d.getHours();
		var joinStampM =d.getMinutes();
		var joinStampS= d.getSeconds();
			
		if(joinStampH<10){joinStampH = "0"+joinStampH}	
		if(joinStampM<10){joinStampM = "0" + joinStampM;}
		if(joinStampS<10){joinStampS = "0" + joinStampS}
		
		var fulltime= joinStampH+ ":" + joinStampM +":" + joinStampS 
		var temp = "<div class=msg> " + "<span style='font-weight:border;color:purple'><b>" + msgSender + " </b></span> " +msgContent + "</div><br>";
		
		
		displayIt(temp);
		
}

function displayIt(strData){

	displayDiv.innerHTML = displayDiv.innerHTML+ strData 
	//console.log(strData);
	 
}


function StartOrPause(){
	ScrollingDown = ScrollingDown?false:true; 

}
function start(){
	
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString); 
	var userName= urlParams.get("twitch"); 
	if(userName!=null){
	
		
	}
	else{
		userName="RoxxieToxxic";
		
	}
	twitch(userName)
}

	
	
function twitch(twitchuser) {
    
    ComfyJS.onChat = (user, message, flags, self, extra) => {
        
		dealWithMessage(user,message,flags,self,extra);
		
    }	
		ComfyJS.onFollow=(data)=>{
	
	console.log(data)
	}
    ComfyJS.onMessageDeleted = (messageID, extra) => {
       // handleTwitchDelete(messageID);
    }
	ComfyJS.onSub =(data) =>{
	
	displayIt("<div>"+"Has become a sub " +data + "</div>"); 
	
	}
	
	ComfyJS.onJoin =(data) =>{
	console.log( "Just joined " + data);
	}
	ComfyJS.onCommand = (user, command, message, flags, extra) => {
	//console.log(command);
	console.log(message);
	var callfor = checkForTrigger("!"+command);
				if(callfor !=null)
				{
					obsTest(callfor);
				}
/*	if(flags.mod || flags.broadcaster){
	if(command==="vip"){
	makeItVisible();
	
	}
	
  } 
  */
	}
    ComfyJS.onBan = (bannedUsername, extra) => {
       // handleTwitchBan(bannedUsername);
    }
    ComfyJS.onTimeout = (timedOutUsername, durationInSeconds, extra) => {
       // console.log(timedOutUsername, durationInSeconds, extra);
      //  handleTwitchBan(timedOutUsername);
    }
    ComfyJS.Init("", "", twitchuser, true);
/*
var callfor = checkForTrigger(sub[x].comment);
				if(callfor !=null)
				{
					obsTest(callfor);
				}
				

*/	
	
}

function loadBadges(channelID) {
        // getJSON('https://badges.twitch.tv/v1/badges/channels/' + encodeURIComponent(channelID) + '/display')
        $.getJSON('https://api.corard.tv/badges/channel?id=' + encodeURIComponent(channelID)).done(function (res) {
            res.badge_sets.forEach(function (badgeSet) {
                badgeSet.versions.forEach(function (version) {
                    badges[badgeSet.set_id + ':' + version.id] = version.image_url_4x;
                });
            });
        });

        // getJSON('https://badges.twitch.tv/v1/badges/global/display')
        $.getJSON('https://api.corard.tv/badges/global').done(function (res) {
            res.badge_sets.forEach(function (badgeSet) {
                badgeSet.versions.forEach(function (version) {
                    badges[badgeSet.set_id + ':' + version.id] = version.image_url_4x;
                });
            });
        });
    }
function loadEmotes(channelID) {
        // Get emotes from channel
        ['emotes/global', 'users/twitch/' + encodeURIComponent(channelID)].forEach(endpoint => {
            $.getJSON('https://api.betterttv.net/3/cached/frankerfacez/' + endpoint).done(function (res) {
                res.forEach(emote => {
                    if (emote.images['4x']) {
                        var imageUrl = emote.images['4x'];
                        var upscale = false;
                    } else {
                        var imageUrl = emote.images['2x'] || emote.images['1x'];
                        var upscale = true;
                    }
                    emotes[emote.code] = {
                        id: emote.id,
                        image: imageUrl,
                        upscale: upscale
                    };
                });
            });
        });

        ['emotes/global', 'users/twitch/' + encodeURIComponent(channelID)].forEach(endpoint => {
            $.getJSON('https://api.betterttv.net/3/cached/' + endpoint).done(function (res) {
                if (!Array.isArray(res)) {
                    res = res.channelEmotes.concat(res.sharedEmotes);
                }
                res.forEach(emote => {
                    emotes[emote.code] = {
                        id: emote.id,
                        image: 'https://cdn.betterttv.net/emote/' + emote.id + '/3x',
                        zeroWidth: ["5e76d338d6581c3724c0f0b2", "5e76d399d6581c3724c0f0b8", "567b5b520e984428652809b6", "5849c9a4f52be01a7ee5f79d", "567b5c080e984428652809ba", "567b5dc00e984428652809bd", "58487cc6f52be01a7ee5f205", "5849c9c8f52be01a7ee5f79e"].includes(emote.id) // "5e76d338d6581c3724c0f0b2" => cvHazmat, "5e76d399d6581c3724c0f0b8" => cvMask, "567b5b520e984428652809b6" => SoSnowy, "5849c9a4f52be01a7ee5f79d" => IceCold, "567b5c080e984428652809ba" => CandyCane, "567b5dc00e984428652809bd" => ReinDeer, "58487cc6f52be01a7ee5f205" => SantaHat, "5849c9c8f52be01a7ee5f79e" => TopHat
                    };
                });
            });
        });

        ['emotes/global', 'users/' + encodeURIComponent(channelID) + '/emotes'].forEach(endpoint => {
            $.getJSON('https://api.7tv.app/v2/' + endpoint).done(function (res) {
                res.forEach(emote => {
                    emotes[emote.name] = {
                        id: emote.id,
                        image: emote.urls[emote.urls.length - 1][1],
                        zeroWidth: emote.visibility_simple.includes("ZERO_WIDTH")
                    };
                });
            });
        });
    }
function handleEmo(msgContent, extra) {
        let msgEmotes = {};
        // Loop through the emotes in the message
        for (let emote in extra.messageEmotes) {
            // Loop through the emote positions
            for (let pos of extra.messageEmotes[emote]) {
                let start, end = 0;
                // Pos is "start-end"
                start = parseInt(pos.split("-")[0]);
                end = parseInt(pos.split("-")[1]);
                console.log("start: " + start + " end: " + end);
                // Get the emote name from the message
                const emoteName = msgContent.substring(start, end + 1);
                console.log("name: " + emoteName);
                // Add the emote to the emotes array as {name: url}
                let url = `https://static-cdn.jtvnw.net/emoticons/v2/${emote}/default/dark/4.0`
                msgEmotes[emoteName] = url;
            }
        }
        // Loop through the emotes in the message
        for (let emote in msgEmotes) {
            // Replace the emote name with the emote image
            msgContent = msgContent.replaceAll(emote, "<img class='emote' src='" + msgEmotes[emote] + "' />");
        }
        // Split the message into an array of words, except for the emotes already replaced
        let msgWords = msgContent.split(" ");
        // For each word in the message
        for (let word of msgWords) {
            // If the word is an emote
            if (emotes[word]) {
                // Replace the word with the emote image
                msgContent = msgContent.replace(word, "<img class='emote' src='" + emotes[word].image + "' />");
            }
        }
        return msgContent;
    }
