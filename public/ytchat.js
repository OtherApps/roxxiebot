//thanks chatgpt for giving most of the code 
function start(){		
		const socket = io("http://192.168.1.172:3000");
        var container = document.getElementById('chat-container');
		var userInput=document.getElementById("chID");
		
		document.getElementById('info-div').style.display = 'none';
		container.style.display="block";
	
        socket.on("connect", () => {
            document.getElementById('status-dot').classList.add('live');
            document.getElementById('status-text').innerText = "LIVE";
        });
		socket.emit('change-channel-yt',userInput.value);
	
        socket.on("message", ({ type, data, count }) => {
            document.getElementById('msg-counter').innerText = `| 💬 ${count}`;
            const msgDiv = document.createElement('div');
            msgDiv.className = type === 'superChat' ? 'chat-line super-chat' : 'chat-line';

            let badges = "";
            if (data.author.isChatOwner) badges += '<i class="fas fa-crown badge" style="color:#ffca28"></i>';
            if (data.author.isChatModerator) badges += '<i class="fas fa-wrench badge" style="color:#5e81ac"></i>';

            const content = data.message.map(run => {
                if (run.text) return `<span>${run.text}</span>`;
                if (run.emoji) return `<img src="${run.emoji.thumbnails.url}" class="emote">`;
            }).join("");

            if (type === 'superChat') { chime.play(); msgDiv.innerHTML = `💰 ${data.amount} ${data.currency}<br>`; }
            msgDiv.innerHTML += `${badges}<strong>${data.author.name}:</strong> ${content}`;

            container.appendChild(msgDiv);
            if (container.children.length > 12) container.removeChild(container.firstChild);
        });
}