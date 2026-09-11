
// start of  discord npm stuff 
// install node-fetch@1.7.3  otherwise will get a fetch error
/*


*/
const http = require("http");

var express =  require('express'); 
var app = express(); 
const bodyParser= require('body-parser');

var jsonsave
var found=false;
const path2 = require('path');
const date = new Date();
const yad=date.getDate();

const fs3 = require("fs").promises;
const path3 = require("path");

const fileCache = new Set();
const stripe = require('stripe')('');
  

console.log("Running");
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var checkname= months[date.getMonth()]+"_"+"RoxxieToxxic_vipboard2.json";
var hist="history_"+checkname;
/*kick listen and api */

const crypto = require("crypto");


// Backend stuff  
const CLIENT_ID = "";
const CLIENT_SECRET = "";


const CHANNEL_NAME="RoxxieToxxic"

const PORT = 8181;
const PUBLIC_BASE_URL = "https://swan-tight-porpoise.ngrok-free.app";
const OAUTH_CALLBACK = `${PUBLIC_BASE_URL}/kick/callback`; 
const WEBHOOK_URL = `${PUBLIC_BASE_URL}/kick/webhook`;

const SCOPES = [
    "user:read",
    "channel:read",
    "events:subscribe"
];

let oauthState = null;
let codeVerifier = null;

let accessToken = null;
let refreshToken = null;


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    next();
});

// Keep the raw request body.
// Kick signs:
// messageId.timestamp.rawBody
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));



app.get("/kick/", (req, res) => {

    res.send(`
        <html>
        <body style="font-family:Arial">

            <h1>Kick Webhook Server</h1>

            <p>Channel: ${CHANNEL_NAME}</p>

            <p>
                <a href="/kick/login">
                    Connect Kick
                </a>
            </p>

        </body>
        </html>
    `);

});


app.get("/kick/login", (req, res) => {

    if (!CLIENT_ID) {

        return res.status(500).send(
            "CLIENT_ID is empty."
        );

    }

    // ---------------------------------------------
    // PKCE CODE VERIFIER
    // ---------------------------------------------

    codeVerifier =
        crypto
            .randomBytes(32)
            .toString("base64url");

    // ---------------------------------------------
    // PKCE CODE CHALLENGE
    // ---------------------------------------------

    const codeChallenge =
        crypto
            .createHash("sha256")
            .update(codeVerifier)
            .digest("base64url");

    // ---------------------------------------------
    // STATE
    // ---------------------------------------------

    oauthState =
        crypto
            .randomBytes(32)
            .toString("hex");

    // ---------------------------------------------
    // AUTHORIZATION URL
    // ---------------------------------------------

    const params =
        new URLSearchParams({

            response_type:
                "code",

            client_id:
                CLIENT_ID,

            redirect_uri:
                OAUTH_CALLBACK,

            scope:
                SCOPES.join(" "),

            code_challenge:
                codeChallenge,

            code_challenge_method:
                "S256",

            state:
                oauthState

        });

    const authURL =
        "https://id.kick.com/oauth/authorize?" +
        params.toString();

    console.log("");
    console.log(
        "======================================"
    );
    console.log(
        "KICK OAUTH"
    );
    console.log(
        "======================================"
    );
    console.log(authURL);
    console.log(
        "======================================"
    );
    console.log("");

    res.redirect(authURL);

});

// =====================================================
// OAUTH CALLBACK
// =====================================================

app.get("/kick/callback", async (req, res) => {

    try {

        const {
            code,
            state,
            error,
            error_description
        } = req.query;

        // ---------------------------------------------
        // OAUTH ERROR
        // ---------------------------------------------

        if (error) {

            console.log(
                "Kick OAuth error:",
                error,
                error_description || ""
            );

            return res.status(400).send(`
                <h1>Kick OAuth Error</h1>
                <p>${error}</p>
                <p>${error_description || ""}</p>
            `);

        }

        // ---------------------------------------------
        // CHECK CODE
        // ---------------------------------------------

        if (!code) {

            return res.status(400).send(
                "Kick did not return an authorization code."
            );

        }

        // ---------------------------------------------
        // CHECK STATE
        // ---------------------------------------------

        if (
            !state ||
            !oauthState ||
            state !== oauthState
        ) {

            console.log(
                "Invalid OAuth state."
            );

            return res.status(400).send(
                "Invalid OAuth state."
            );

        }

        // ---------------------------------------------
        // CHECK PKCE
        // ---------------------------------------------

        if (!codeVerifier) {

            return res.status(400).send(
                "Missing PKCE code verifier."
            );

        }

        console.log("");
        console.log(
            "Kick authorization successful."
        );

        // ---------------------------------------------
        // EXCHANGE CODE
        // ---------------------------------------------

        const tokenBody =
            new URLSearchParams({

                grant_type:
                    "authorization_code",

                client_id:
                    CLIENT_ID,

                client_secret:
                    CLIENT_SECRET,

                redirect_uri:
                    OAUTH_CALLBACK,

                code:
                    code,

                code_verifier:
                    codeVerifier

            });

        const tokenResponse =
            await fetch(
                "https://id.kick.com/oauth/token",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/x-www-form-urlencoded"

                    },

                    body:
                        tokenBody

                }
            );

        const tokenText =
            await tokenResponse.text();

        console.log(
            "TOKEN STATUS:",
            tokenResponse.status
        );

        console.log(
            "TOKEN RESPONSE:",
            tokenText
        );

        if (!tokenResponse.ok) {

            return res.status(500).send(`
                <h1>Kick Token Error</h1>
                <pre>${tokenText}</pre>
            `);

        }

        const tokenData =
            JSON.parse(tokenText);

        accessToken =
            tokenData.access_token;

        refreshToken =
            tokenData.refresh_token;

        if (!accessToken) {

            throw new Error(
                "Kick did not return an access token."
            );

        }

        console.log("");
        console.log(
            "======================================"
        );
        console.log(
            "ACCESS TOKEN RECEIVED"
        );
        console.log(
            "======================================"
        );

        console.log(
            "Scope:",
            tokenData.scope
        );

        console.log(
            "Expires:",
            tokenData.expires_in
        );

        console.log(
            "======================================"
        );

        // =================================================
        // GET AUTHENTICATED USER
        // =================================================

        const user =
            await getCurrentUser(
                accessToken
            );

        console.log("");
        console.log(
            "Authenticated Kick account:"
        );

        console.log(
            JSON.stringify(
                user,
                null,
                2
            )
        );

        // =================================================
        // GET CHANNEL
        // =================================================

        const channel =
            await getChannel(
                accessToken
            );

        console.log("");
        console.log(
            "Channel:"
        );

        console.log(
            JSON.stringify(
                channel,
                null,
                2
            )
        );

        const broadcasterID =
            channel.broadcaster_user_id;

        console.log("");
        console.log(
            "Broadcaster ID:",
            broadcasterID
        );

        // =================================================
        // SUBSCRIBE
        // =================================================

        const subscription =
            await subscribeToGiftSubs(
                accessToken,
                broadcasterID
            );

        console.log("");
        console.log(
            "======================================"
        );
        console.log(
            "SUBSCRIPTION RESULT"
        );
        console.log(
            "======================================"
        );

        console.log(
            JSON.stringify(
                subscription,
                null,
                2
            )
        );

        console.log(
            "======================================"
        );

        res.send(`
            <html>
            <body style="font-family:Arial">

                <h1>Kick Connected!</h1>

                <p>
                    Account:
                    <strong>${user.username}</strong>
                </p>

                <p>
                    Channel:
                    <strong>${CHANNEL_NAME}</strong>
                </p>

                <p>
                    Broadcaster ID:
                    <strong>${broadcasterID}</strong>
                </p>

                <p>
                    Gift-sub webhook subscription created.
                </p>

                <p>
                    Webhook:
                    <strong>${WEBHOOK_URL}</strong>
                </p>

                <p>
                    You can close this window.
                </p>

            </body>
            </html>
        `);

        // Clear one-time OAuth values
        oauthState = null;
        codeVerifier = null;

    }
    catch (err) {

        console.error(
            "OAuth callback error:",
            err
        );

        res.status(500).send(`
            <h1>Error</h1>
            <pre>${err.stack || err}</pre>
        `);

    }

});

// =====================================================
// GET CURRENT USER
// =====================================================

async function getCurrentUser(token) {

    const response =
        await fetch(
            "https://api.kick.com/public/v1/users",
            {

                headers: {

                    Authorization:
                        `Bearer ${token}`,

                    Accept:
                        "application/json"

                }

            }
        );

    const text =
        await response.text();

    console.log(
        "USER STATUS:",
        response.status
    );

    console.log(
        "USER RESPONSE:",
        text
    );

    if (!response.ok) {

        throw new Error(
            "Could not get authenticated Kick user."
        );

    }

    const result =
        JSON.parse(text);

    if (
        !result.data ||
        !result.data.length
    ) {

        throw new Error(
            "Kick returned no authenticated user."
        );

    }

    return result.data[0];

}

// =====================================================
// GET CHANNEL
// =====================================================

async function getChannel(token) {

    const url =
        "https://api.kick.com/public/v1/channels" +
        "?slug=" +
        encodeURIComponent(CHANNEL_NAME);

    const response =
        await fetch(
            url,
            {

                headers: {

                    Authorization:
                        `Bearer ${token}`,

                    Accept:
                        "application/json"

                }

            }
        );

    const text =
        await response.text();

    console.log(
        "CHANNEL STATUS:",
        response.status
    );

    console.log(
        "CHANNEL RESPONSE:",
        text
    );

    if (!response.ok) {

        throw new Error(
            "Could not get channel."
        );

    }

    const result =
        JSON.parse(text);

    if (
        !result.data ||
        !result.data.length
    ) {

        throw new Error(
            `Channel not found: ${CHANNEL_NAME}`
        );

    }

    return result.data[0];

}

// =====================================================
// SUBSCRIBE TO GIFTED SUBSCRIPTIONS
// =====================================================

async function subscribeToGiftSubs(
    token,
    broadcasterID
) {

    // IMPORTANT:
    //
    // Current Kick event name:
    //
    // channel.subscription.gifts
    //
    // NOT:
    //
    // channel.subscription.gifted

    const body = {

        broadcaster_user_id:
            Number(broadcasterID),

        method:
            "webhook",

        events: [

            {

                name:
                    "channel.subscription.gifts",

                version:
                    1

            }

        ]

    };

    console.log("");
    console.log(
        "======================================"
    );
    console.log(
        "SUBSCRIBING TO GIFT SUB EVENTS"
    );
    console.log(
        "======================================"
    );

    console.log(
        JSON.stringify(
            body,
            null,
            2
        )
    );

    const response =
        await fetch(
            "https://api.kick.com/public/v1/events/subscriptions",
            {

                method:
                    "POST",

                headers: {

                    Authorization:
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json",

                    Accept:
                        "application/json"

                },

                body:
                    JSON.stringify(body)

            }
        );

    const text =
        await response.text();

    console.log("");
    console.log(
        "SUBSCRIPTION STATUS:",
        response.status
    );

    console.log(
        "SUBSCRIPTION RESPONSE:",
        text
    );

    if (!response.ok) {

        throw new Error(
            `Kick subscription failed: ${response.status} ${text}`
        );

    }

    return JSON.parse(text);

}

// =====================================================
// LIST SUBSCRIPTIONS
// =====================================================

app.get(
    "/kick/subscriptions",
    async (req, res) => {

        try {

            if (!accessToken) {

                return res.status(401).json({
                    error:
                        "Not authenticated with Kick."
                });

            }

            const response =
                await fetch(
                    "https://api.kick.com/public/v1/events/subscriptions",
                    {

                        headers: {

                            Authorization:
                                `Bearer ${accessToken}`,

                            Accept:
                                "application/json"

                        }

                    }
                );

            const text =
                await response.text();

            console.log(
                "SUBSCRIPTIONS:",
                text
            );

            res
                .status(response.status)
                .send(text);

        }
        catch (err) {

            console.error(err);

            res.status(500).json({
                error:
                    err.message
            });

        }

    }
);

// =====================================================
// KICK WEBHOOK
// =====================================================
app.get("/kick/webhook", (req, res) => {
    res.send("Kick webhook is online. Waiting for POST events.");
});

app.post(
    "/kick/webhook",
    async (req, res) => {

        console.log("");
        console.log(
            "======================================"
        );
        console.log(
            "KICK WEBHOOK"
        );
        console.log(
            "======================================"
        );

        const eventType =
            req.headers[
                "kick-event-type"
            ];

        const version =
            req.headers[
                "kick-event-version"
            ];

        const messageID =
            req.headers[
                "kick-event-message-id"
            ];

        console.log(
            "Event:",
            eventType
        );

        console.log(
            "Version:",
            version
        );

        console.log(
            "Message ID:",
            messageID
        );

        console.log(
            "Headers:",
            req.headers
        );

        console.log(
            "Body:",
            JSON.stringify(
                req.body,
                null,
                2
            )
        );

        // Acknowledge immediately.
        res.sendStatus(200);

        // =================================================
        // GIFTED SUBS
        // =================================================

        if (
            eventType ===
            "channel.subscription.gifts"
        ) {

            const data =
                req.body;

            console.log("");
            console.log(
                "######################################"
            );

            console.log(
                "          GIFTED SUB!"
            );

            console.log(
                "######################################"
            );
const gifter_username = data.gifter?.username || "Unknown";

/*            console.log(
                "Gifter:",
                data.gifter?.username ||
                "Unknown"
            );
 console.log(
                "Number of gifted subs:",
                data.giftees?.length ||
                0
            );
  */
const numofsubs=data.giftees?.length ||0;
var info= [{username:gifter_username, stickers:numofsubs,stars:numofsubs*10 }]

 
LogIt(info)
            console.log(
                "Recipients:"
            );

            if (
                Array.isArray(
                    data.giftees
                )
            ) {

                for (
                    const giftee
                    of data.giftees
                ) {

                    console.log(
                        " -",
                        giftee.username
                    );

                }

            }

            console.log(
                "Created:",
                data.created_at
            );

            console.log(
                "######################################"
            );

            return;

        }

        // =================================================
        // NEW SUB
        // =================================================

        if (
            eventType ===
            "channel.subscription.new"
        ) {

            console.log(
                "NEW SUB:"
            );

            console.log(
                data.subscriber?.username
            );

            return;

        }

        // =================================================
        // CHAT
        // =================================================

        if (
            eventType ===
            "chat.message.sent"
        ) {

            console.log(
                data.sender?.username,
                ":",
                data.content
            );

            return;

        }

        // =================================================
        // UNKNOWN EVENT
        // =================================================

        console.log(
            "Unhandled Kick event:",
            eventType
        );

    }
);

// =====================================================
// START
// =====================================================

app.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "======================================"
        );

        console.log(
            "KICK WEBHOOK SERVER"
        );

        console.log(
            "======================================"
        );

        console.log(
            "Port:",
            PORT
        );

        console.log(
            "Channel:",
            CHANNEL_NAME
        );

        console.log(
            "OAuth callback:"
        );

        console.log(
            OAUTH_CALLBACK
        );

        console.log(
            "Webhook:"
        );

        console.log(
            WEBHOOK_URL
        );

        console.log(
            "======================================"
        );

        console.log("");

        console.log(
            "Open:"
        );

        console.log(
            `http://localhost:${PORT}/kick/login`
        );

        console.log("");

        console.log(
            "After authentication, check:"
        );

        console.log(
            `http://localhost:${PORT}/kick/subscriptions`
        );

        console.log("");

    }
);


/* End of kick stuff*/


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

async function ensureFile3(filePath, content) {

  if (fileCache.has(filePath)) return;

  const dir = path3.dirname(filePath);
  await fs3.mkdir(dir, { recursive: true });

  try {
    await fs3.access(filePath);
  } catch {
    await fs3.writeFile(filePath, JSON.stringify(content));
  }

  fileCache.add(filePath);
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
//ensureFile(checkname,defaultName );
//ensureFile(hist,defaultName);

var client_token=''
require('discord-reply');
const Discord = require('discord.js');
const channelID='1277289516515852410';

//console.log(checkname);


//Discord plugin stuff 
const fs = require("fs");
app.use(express.json()); 

app.get('/api/pay', (req, res) => {
  
  
 /* const products = [
    { id: 'a1b2', name: 'Wireless Mouse', price: 25.99 },
    { id: 'c3d4', name: 'Mechanical Keyboard', price: 89.50 }
  ];*/

var paymentdate =
    date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0");
	
var pay = getPaymentsForDate(res,paymentdate);

//getPaymentsForDate();
  
 // res.json(pay); // Automatically stringifies and sets header
});

async function getPaymentsForDate(res,datePayment) {

    var date = datePayment;
    var totaldon = 0;
    var numberofDons = 0;

    try {

        // Start of day
        const startOfDay = Math.floor(
            new Date(date + 'T00:00:00Z').getTime() / 1000
        );

        // End of day
        const endOfDay = Math.floor(
            new Date(date + 'T23:59:59Z').getTime() / 1000
        );

  /*    
		console.log("Searching Stripe...");
        console.log("Date:", date);
        console.log("Start:", startOfDay);
        console.log("End:", endOfDay);
*/

        const payments = await stripe.paymentIntents.list({
            created: {
                gte: startOfDay,
                lte: endOfDay
            },
            limit: 100
        });

        numberofDons = payments.data.length;

    //    console.log(`Found ${numberofDons} payments for ${date}`);

        // Add up all payments
        payments.data.forEach(payment => {

         /*  console.log(
                `- ${payment.id}: ${payment.amount / 100} ${payment.currency.toUpperCase()} - {payment.status}`
				
				
            );
				*/
            totaldon += payment.amount / 100;
        });

 //       console.log("Total donations:", totaldon);

        // Send response
        if (numberofDons > 0) {

            return res.status(200).json({
                success: true,
                message: "Your operation was successful!",
                data: {
                    id: 1,
                    user: totaldon,
                    numberOfDonations: numberofDons
                }
            });

        } else {

            return res.status(200).json({
                success: true,
                message: "No donations found",
                data: {
                    id: 1,
                    user: 0,
                    numberOfDonations: 0
                }
            });
        }

    } catch (error) {

        console.error("Stripe Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
app.use(express.static('./'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.get('/subfile', (req, res) => {
  fs.readFile('./sub.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file');
      return;
    }
    // Set content type explicitly if needed, although Express often handles it
    res.set('Content-Type', 'text/plain');
    res.send(data);
  });
});

app.listen(8080);


app.post('/test',(req,res)=>{

var  streamers=req.body.streamer ?? "RoxxieToxxic";
var checkname2= months[date.getMonth()]+"_"+streamers+"_vipboard2.json";
var hist2="history_"+checkname2;
	
	ensureFile(checkname2,defaultName );
	ensureFile(hist2,defaultName);
	res.send("Thank you!");
})
app.get('/', (req, res) => {
    res.redirect('./public/nathan/?offline=true');
});
app.post('/data/', (req, res) => {
	console.log(req.body);
	
    res.send("Thank you!");
	
});
// https://api.younow.com/php/api/channel/getSubscribers/channelId=59079307/userId=59079307
app.get("/getSubscribers/:ids",function(req,res){
	
	var url = "https://api.younow.com/php/api/channel/getSubscribers/channelId="+req.params.ids+"/"+"userId="+req.params.ids;
	 getJsonStuffWithoutCookies(url,req,res); 
	
	
})
app.get("/SaveCount/:ids",function(req,res){
	SaveCount(req,res,req.params.ids);
	//console.log();
	
	
});

app.get("/SaveSubs",function(req,res){
	var usr=req.query.usr;
	var nums=req.query.nums;
	
	TopSubs(req,res,usr,nums);
	
})
app.get("/logs",function(req, res){
	listlogs(req,res)
})


app.get("/leaders",function (req,res){
	var leaders= "https://cdn.younow.com/php/api/younow/topBroadcastersLeaderboard/lang=en/locale=en/page=0/periodicity=monthly/records=500";
	
	  getJsonStuff(leaders,req,res); 
	
	
})
//
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
app.get('/kick/:ids',function (req,res){
	
var getsub ="https://kick.com/api/v2/channels/"+req.params.ids+"/";

	  getJsonStuff(getsub,req,res); 
	
})

app.get('/sub/:ids',function (req,res){
	//https://cdn.younow.com/php/api/channel/getTopSubGifters/channelId=51919855/locale=en/lang=en/numberOfRecords=12
var getsub ="https://cdn.younow.com/php/api/channel/getTopSubGifters/channelId="+req.params.ids+"/locale=en/lang=en/numberOfRecords=12";

	  getJsonStuff(getsub,req,res); 
	
})

app.get('/listsub',function (req,res){
	displaySubList(req,res);
})

app.get('/SubSave/data=:info',function (req,res){

var getsub =req.params.info;
console.log(getsub);

saveSubData(getsub,req,res); 
	
})
//saveSubData(data)
app.get('/stuff2/:userId',function (req,res){
	var userId= req.params.userId;
	var pageNum =1; 
	
	var url ='https://api.younow.com/php/api/channel/getSubscribers/channelId=' + userId + '/startFrom=' + pageNum + '/userId=' + userId
	GetDataClean(url,req,res);
	
	
})
app.get('/quiz/:ids',function (req,res){

var getsub = `https://opentdb.com/api.php?amount=5&category=${req.params.ids}&difficulty=easy&type=multiple` 
	GetDataClean(getsub,req,res); 
	
})


app.get('/info/:path', function(req, res) {
  // console.log('path:'+req.params.path);

var url2= "https://cdn.younow.com/php/api/channel/getInfo/channelId=" + req.params.path; 

   
  getJsonStuff(url2,req,res); 
   
   
});


app.get('/chat/:path',function(req,res){
	
var url3= "https://api.younow.com/php/api/broadcast/info/curId=0/user="+req.params.path;
	
	  getJsonStuff(url3,req,res); 
});
app.get('/tik/',function(req,res){
	res.sendFile("D:/tiktok/logs/json_tiktok_11-10-5_23_2024_healing_tarot_readings.txt")
//app.use(express.static(	path2.join('D:/tiktok/logs/','./log')));
	
})

//https://cdn.younow.com/php/api/broadcast/audience/broadcaster=0/channelId=' + userId + '/start=' + pageNum

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


app.get('/saveword=:word',function(req,res)
{
saveWord(req.params.word,req,res);	
	
	
	
});

app.get('/username/:path', function(req, res) {
   //console.log('path:'+req.params.path);
   
  showUserOnly(req.params.path,req,res); 
   
   
});
function showUserOnly(username,req,res){
	
	var content2 = fs.readFileSync("./cards.txt");
	var data2= String(content2);
	var dataarray= data2.split("<br>"); 
	
	var starts= 0; 
	var fulloutput; 
	
	if(data2.includes(username)){
		while(starts < dataarray.length){
		
		var parts= dataarray[starts].split(","); 
		
		
	if(parts[0].includes(username)){
		
		
		//fulloutput=  fulloutput +"<br><span><b>" +  parts[0] + "</b>\t" + parts[1] +"</span>"; 
		fulloutput= fulloutput + " " + parts[0] +"," + parts[1] + "<br>"; 
		
	//console.log( "<br><span><b>" +  parts[0] + "</b>" + parts[1] +"</span>")
	
		
	}
		
		
		starts++
	}
	
		
	}
	else{
		
	
	fulloutput ="<h2>User not found or empty list</h2>"
	}
	

	res.send(fulloutput)
	
	
	
	
	}
function readTextFile(){
	var fs = require('fs');
	
  const content = fs.readFileSync("./cards.txt");
  res.write(content);



}
function displaySubList(req,res){
	var fs = require('fs');
	const content = fs.readFileSync("./sub.txt");
	
	res.write(content);
	res.end();

	//res.send("done");
	
	
}
function fliterOnly(data,res,userTo,userFrom,Card){


var arrayofdata =  data.split("<br>"); 
var  onlyone =  false; 
var i=0;
var output ="" ; 

while(i < arrayofdata.length){
	
	var temp = arrayofdata[i].split(","); 
	
		if(temp[0].includes(userFrom)){

				if((temp[1].trim()===Card)){
					
					//console.log(temp[0]+"" + temp[1] +""  ); 
					if(onlyone !=true){
						output = output + userTo + "," + Card +"<br>"; 				
						onlyone=true; 
					}
					else{
						output = output + temp[0] +"," + temp[1] + "<br>";	
						}
					
				}
				else{
					output = output + temp[0] +"," + temp[1] + "<br>";			
				}
		
		}
		else{
			output = output + temp[0] +"," + temp[1] + "<br>";	
		}
	
	
	i++; 
	
	
}
res.send("done-");
updateCards(output)
//res.write(output); 
// 
		


}
function  convertToJson(UserName,userId,values){

		var newobj = {UserName,userId,values}
		jsonsave = jsonsave+ newobj;
			
		console.log(JSON.stringify(newobj)); 
	
}
function listlogs(req,res){
	const path = require('path');
	const directoryPath = path.join(__dirname, '/	logs');
	var output; 
//passsing directoryPath and callback function
fs.readdir("./logs", function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
		
        console.log(file); 
		output = output + file; 
		
		//res.write(file); 
		
    });
});
	console.log(output);
	
	res.send(output);

}
function  updateCards(updatedData){
	
	
	
fs.writeFile('./cards.txt', updatedData, function (err) {
  if (err) throw err;
  console.log('Saved!');
});
	
}
function saveWord(data,req,res){

var fileName='/hangman_words.txt'
var stuff=data;

fs.writeFile('./hangman_words.txt', data, function (err) {
  if (err) throw err;
  console.log('Saved!');
});
	
		res.send("done");
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
app.get('/trade', function (request , response){
	
	var UserSending = request.query.UserSending; 
	var UserTo = request.query.UserTo; 
	var cardSend = request.query.card; 
	
	response.header('Content-type', 'text/html');
	var content2 = fs.readFileSync("./cards.txt");
	var data2= String(content2);
  
	let position = data2.search(UserSending +","+cardSend);
	
	if(position >1){
	
		fliterOnly(data2,response,UserTo,UserSending,cardSend); 		
	}
	else{
		
		response.send("has  not been found");
		
	}

});

app.get('/list', function (request , response){
	
	response.sendFile(__dirname + "/cards.txt");

});
app.get('/files=:path',function(request,response){
	//console.log(request.params);
	response.sendFile(__dirname+"/"+request.params.path+".txt");
	
})
app.get( '/save', function(request,response){
	
	var username = request.query.username; 
	var cardId = request.query.cardId;  
	writeLogTest( username, cardId)
	
	

	
	response.send("has been saved"); 
})


app.get( '/saveLikes', function(request,response){
	
	var username = request.query.username; 
	var likes = request.query.likes;  
	saveLikes( username, likes)
	
	

	
	response.send("has been saved"); 
})

app.get( '/saveData', function(request,response){
	
	var stuff = request.query.str; 
	saveData(stuff)
	
	

	
	response.send("has been saved"); 
})
app.get('/GiveVip',function (request,response){
//http://192.168.1.172:8080/GiveVip?usr=test&to=Hamez&sar=100&stick=1
GiveVip(request,response,request.query.usr,request.query.to,request.query.sar,request.query.stick)
	
}
	)
app.post('/vip',function (request,response){
	var  streamers=request.body.streamer ?? "RoxxieToxxic";
	var platform = request.body.di?? "twitch";
	
//console.log(request.body.name);	

VipSave(request,response,request.body.name,request.body.stars,request.body.stickers,streamers,platform);
	
})

app.get( '/json/:path', function(request,response){
	
	var username = request.query.path; 
	GetUserId(username,request,response)

})

app.get( '/GetUserId', function(request,response){
	
	var username = request.query.username; 
	var testId = GetUserId(username,request,response)

	if(testId  >1){
		console.log(testId);
		
	}
})

function saveLikes(username, likes){


	const fileName =  "./likes.txt";
	var data = "\t "+username +": " + likes +" \r <br> "
	
	 fs.exists(fileName, function (exists) {
        if(exists){}else
        {
            fs.writeFile(fileName, {flag: 'wx'}, function (err, data) 
            { 
              
            })
        }
    });
	
	
	fs.appendFile(fileName, data, (err)=>{
		
		if(err){
			console.log();
			
		}
		else{
			fs.readFileSync(fileName);
		
	}
	
}
);
}

// saveData 

function saveData(stuff){


	const fileName =  "./likes.txt";
	var data = " "+stuff +" \r "
	
	 fs.exists(fileName, function (exists) {
        if(exists){}else
        {
            fs.writeFile(fileName, {flag: 'wx'}, function (err, data) 
            { 
              
            })
        }
    });
	
	
	fs.appendFile(fileName, data, (err)=>{
		
		if(err){
			console.log();
			
		}
		else{
			fs.readFileSync(fileName);
		
	}
	
}
);
}


function writeLogTest(username,ids){


	const fileName =  "logs/"+username+".txt";
	var data = "\t "+username +"," + ids +" \r <br> "
	
	 fs.exists(fileName, function (exists) {
        if(exists){}else
        {
            fs.writeFile(fileName, {flag: 'wx'}, function (err, data) 
            { 
              
            })
        }
    });
	
	
	fs.appendFile(fileName, data, (err)=>{
		
		if(err){
			console.log();
			
		}
		else{
			fs.readFileSync(fileName);
		
	}
	
}
);
}
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
async function saveHistory(data,db){
	//console.log(data);
	
	var data2 = fs.readFileSync(db);
	try{
	
	var myObject = JSON.parse(data2)||[{}];
	}
	catch(err){
	console.load(err);
	
	}
	myObject.push(data);	
	var newData2 =JSON.stringify(myObject)
	fs.writeFile(db, newData2, (err) => {
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

function makeJsonValid(data,filename){

	const fs = require('fs');
	
	jsonData=data;
	
	try {
	
		const fileContent = fs.readFileSync(filename, 'utf8');
		jsonData = JSON.parse(fileContent);
			
			return jsonData; 
		} catch (err) {
			
			fs.writeFileSync(filename, JSON.stringify(defaultName, null, 2));
			return defaultName; 
			
}
	
}
async function VipSave2(request,response,usr,sar,stick,streamer,plat){


var checkname2= months[date.getMonth()]+"_"+streamer+"_vipboard2.json";
var hist2="history_"+checkname2;
//ensureFile(checkname2,defaultName );
//ensureFile(hist2,defaultName);

console.log("Saving to:" +checkname2);
var data = fs.readFileSync(checkname2);
var fdate=months[date.getMonth()] + "-" + date.getDate();

var myObject=[];
var name=usr;

//console.log("precrash " +data )
try{
myObject = JSON.parse(data)
console.log(myObject)

}
catch (error) {
    if (error instanceof SyntaxError) {
        console.error("Caught expected JSON error:", error.message);
        // Error message will be: "Unexpected end of JSON input"
    } else {
        throw error; // Re-throw if it's a different type of error
    }
	
}	
var foundName;
if((typeof myObject==='object') && (myObject !==null))
{
 foundName= myObject.findIndex(p => p.username === usr);
}
else{
	foundName =-1;
	myObject = [{}];
	
}
console.log(myObject);

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
 //saveHistory(newData2,hist2);
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
 //saveHistory(newData,hist2);
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
/*
try {
  await fs.writeFile(checkname2, newData2);
  //console.log(newData2);
  response.send("New data added");
} catch (err) {
  console.error(err);
  response.status(500).send("File write failed");
}
try{
	await fs.writeFile(checkname2, newData2)
	response.send("Saved");
	
  // Error checking
  ;
}
catch (err){
	
	response.status(500).send("File write failed");
	
}

fs.writeFile(checkname2, newData2, (err) => {
  // Error checking
  if (err) throw err;
response.send("New data added");
});
*/
//console.log(newData2);
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

async function GetUserId(username,req,resp)
{	

var error = false; 
var targetUrl = 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + username;
var json = fetch ( targetUrl)

        .then (blob => blob.json ())
        .then (data =>
        {
			
		   json = JSON.stringify (data, null, 2);
            let done = JSON.parse (json);
		if(done.errorCode !=102){
			
			
			
		}
		else{
			resp.send(done)
			//console.log(done)
		}
		
				
	
        })
        .catch (e =>
        {
			console.log(e); 
        });
}
async function Retry()
{
    console.log ("Retrying in 5 seconds");
    //AddToChat ("Retrying in 5 seconds", "HelperRobot", "basic", 50250342, 0, 0, false, 0);

    await sleep (5000);
error = false;


}
async function GetDataClean(urls,req,res){
	
		 var json = fetch ( urls)
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            let done = JSON.parse (json);
         var test =Object.keys(done);
		 var i =0; 
	
		res.send(done);
			
			
        })
        .catch (e =>
        {
			console.log(e); 
        });
	
	
}
async function getJsonStuffWithoutCookies(targetUrl,req,res){
	
	var json = fetch (targetUrl)
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            let done = JSON.parse (json);
         var test =Object.keys(done);
		 var i =0; 
	
		res.send(done);
			
			
        })
        .catch (e =>
        {
			console.log(e); 
        });
	
	
}
async function getJsonStuff(targetUrl,req,res){
var cookies2='slt=bd11a427-2fd0-4722-b44f-aeb1b7be2fc0;PHPSESSID=41c1ae87b70725fd1e45ca14a590e07b';

let headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9","Accept-Language": "en,en-US;q=0.9","Cookie":cookies2}; 
			
	
	
	 var json = fetch ( targetUrl,{headers})
        .then (blob => blob.json ())
        .then (data =>
        {
            json = JSON.stringify (data, null, 2);
            let done = JSON.parse (json);
         var test =Object.keys(done);
		 var i =0; 
	
		res.send(done);
			
			
        })
        .catch (e =>
        {
			
			console.log(e); 
        });
	
	
}
function Disc(msg,req,res){
const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,Discord.GatewayIntentBits.MessageContent
]}); //creates new client

client.on('ready', () => {
	
 // console.log(`Logged in as ${client.user.tag}!`);
   client.channels.cache.get(channelID).send(msg);
   res.send("done")
   
});
client.login(client_token); //signs the bot in with token

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
function LogIt(data){
	var data2=JSON.stringify(data);
	console.log(data2);
	
	 fs.appendFile(checkname2,
	  `${data2}`
	,()=>{
	 //console.log('Successfully saved');
	})

	
}
