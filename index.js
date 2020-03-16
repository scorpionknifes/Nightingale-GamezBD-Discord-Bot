const Discord = require('discord.js');

//data files
const config = require('./data/config.json');
var nonregister = [];

//google xlsx module
var GoogleSpreadsheet = require('google-spreadsheet');
var asyncs = require('async');

var doc = new GoogleSpreadsheet(config.doc.member);
var sheet;
var srules;
var grules;
var mes;
var memberlist = [];
var member = [];
var gschanged = false;
var warning = [];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


const util = require('util');
const bot = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ['TYPING_START']
});



module.exports = {
	dele: function(channeldel) {
		console.log("test");
		del(channeldel);
		return;
	}
}
if(gschanged){
				setTimeout(updatelistgoogle(), 60000);
				gschanged = false;
			}

bot.on("guildMemberAdd", (member) => {
    member.guild.channels.get(config.channel.modchat).send(`<@${member.id}> has joined the server`);
	member.addRole(member.guild.roles.find(role => role.name === config.tag.potential));
	member.guild.channels.get(config.channel.general).send(`<@${member.id}> **Welcome to Nightingale's Discord Server** *use !register for details to register with the bot*`);
});

bot.on("guildMemberRemove", (member) => {
	member.guild.channels.get(config.channel.modchat).send(`<@${member.id}> ${message.author.toString()} has left the server`);
});

bot.on("ready", () => {
    bot.user.setGame('with the Editor | Alpha'); //you can set a default game
    console.log(`Bot is online!\n${bot.users.size} users, in ${bot.guilds.size} servers connected.`);
	
	googleupdate();
});

bot.on("guildCreate", guild => {
    console.log(`I've joined the guild ${guild.name} (${guild.id}), owned by ${guild.owner.user.username} (${guild.owner.user.id}).`);
});

bot.on("message", async message => { 
    if(message.author.bot || message.system) return; // Ignore bots
	
	
	if (message.content.indexOf(config.prefix) != 0) {
		googleupdate();
		sheet.getRows({
			offset: 1,
		limit: 100,
		},function( err, rows ){
			try{
			var po = rows.map(function (test) { return test.id; }).indexOf(message.author.id);
			if (rows[po].gs < 500){
				var nodays = config.time.defaults;
			} else {
				var nodays = config.time.endgame;
			}
			if (rows[po].second == "") return;
			var day = new Date();
			var tseconds = day.getTime();
			console.log(Number(tseconds) );
			console.log(Number(rows[po].second));
			console.log(nodays);
			if ((Number(tseconds) - Number(rows[po].second)) > nodays*24*60*60*1000){
				if(warning.indexof(message.member.id) < 0){
					message.channel.send(`<@${message.member.id}> **Your Gearscore is older than ${nodays}** *please update Gearscore by !gs*`);
					warning.push(message.member.id);
				}
			}
			}catch(err){}
		});
	}
	
	
    if(message.channel.type === 'dm') {
		googleupdate();
			sheet.getRows({
				offset: 1,
			limit: 100,
			},function( err, rows ){
			if((rows.map(function (test) { return test.id; }).indexOf(message.author.id)) < 0 || rows[rows.map(function (test) { return test.id; }).indexOf(message.author.id)].ap == ""){
				var test = registersystem(message);
				message.reply(test);
				return;
			}else{
				message.reply("you have already registered");
			}
			return;
		});
    } 
	

    console.log(message.content); // Log chat to console for debugging/testing
    if (message.content.indexOf(config.prefix) === 0) { // Message starts with your prefix
	
        let msg = message.content.slice(config.prefix.length); // slice of the prefix on the message

        let args = msg.split(" "); // break the message into part by spaces

        let cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case
			
        args.shift(); // delete the first word from the args
		if (args.length >> 1){
		args[0] = args[0].replace(/!/g, '');
		}
        
        if (cmd === 'hi' || cmd === 'hello') { // the first command [I don't like ping > pong]
            message.channel.send(`Hi there ${message.author.toString()}`);
            return; 
        }
		
		
		//gamezbd bot list
		if (cmd === 'update'){
			if (message.member.roles.find("name", config.tag.admin) ||message.member.roles.find("name", "Editor")){
				var par = args[0].toLowerCase();
				if(args.length == 0){
					message.channel.send("***Please use either*** !update *all*, !update *welcome*, !update *rules*, !update *leaderboard*, !update *id*");
				}
				else if(par == "welcome"){
					message.channel.send("Not setup");
				}
				else if(par == "rules"){
					message.channel.send("Not setup");
				}
				else if(par == "id"){
					autoaddid();
					mes = message;
				}
				else if(par == "leaderboard"){
					updatelistgoogle();
				}
				else if(par == "all"){
					updatelistgoogle();
				}
				else{
					message.channel.send("Wrong Command, Please use either !update all, !update welcome, !update rules, !update leaderboard, !update id");
				}
			}
			
		}
		
		else if (cmd === "debug" && message.author.id === config.userid.owner){
			message.channel.send(`**Bot is online! ${bot.users.size} users, in ${bot.guilds.size} servers connected**`);
			updatelistgoogle();
			return;
		}
		
	
		else if (cmd === "gs" || cmd === "gear" || cmd === "g"){
			console.log(args[0]);
			googleupdate();
			sheet.getRows({
				offset: 1,
			limit: 100,
			},function( err, rows ){
				if (args[0] == "update"){
					if  (message.member.roles.find("name", config.tag.admin)||message.member.roles.find("name", "Editor")){
						for(var i = 0; i<rows.length; i++){
							rows[i].gs = Math.round((Number(rows[i].ap) + Number(rows[i].awp))/2 + Number(rows[i].dp));
							rows[i].save();
						}
						message.channel.send("**Calculated Gearscore for all Members**");
						updatelistgoogle();
						return;
					}
				}
				var targetid = message.member.id;
				if (args.length >= 1)
				{	
					try{
						if(args[0] == " "){
							while(args[0] == " "){
								args.shift();
							}
							message.channel.send("Extra Spaces has been detected and automatically removed ;)");
						}
					}
					catch(err){}
					if (args[0].charAt(0) == `<` || args[0].charAt(0) == "@"){
						if (args.length == 1){
							try{
								var pos = rows.map(function (img) { return img.id}).indexOf(args[0].replace(/[<@!>]/g, ''));
								if (pos < 0){
									pos = rows.map(function (img) { return img.family}).indexOf(args[0].replace(/[@]/g, ''));
								}
								message.channel.send(
								"<@"+rows[pos].id+"> ***Info*** - Lvl: " + rows[pos].level+
								"\n    **ap**:  " +rows[pos].ap+
								"\n    **awp**: " +rows[pos].awp+
								"\n    **dp**:  " +rows[pos].dp
								);
								return;
							} 
							catch(err) {
								message.channel.send(`${args[0]} has not registered`);
								return;
							}
						}
						else if (message.member.roles.find("name", config.tag.admin) ||message.member.roles.find("name", "Editor")){
							if (args[0].charAt(0) == `<`){
								targetid = args[0].replace(/[<@!>]/g, '');
							}
							else{
								targetid = rows[rows.map(function (img) { return img.family}).indexOf(args[0].replace(/[@]/g, ''))].id;
							}
							args.shift();
						}
						else return;
					}
					var gear = args[0].split("/");
					var day = new Date();
					var pos = rows.map(function (img) { return img.id}).indexOf(targetid);
					if (gear.length == 3){
						rows[pos].ap = gear[0];
						rows[pos].awp = gear[1];
						rows[pos].dp = gear[2];
						rows[pos].gs = Math.round((Number(gear[0]) + Number(gear[1]))/2 + Number(gear[2]));
						rows[pos].date = day.getDate()+" "+ months[day.getMonth()];
						rows[pos].second = day.getTime();
						rows[pos].save();
					}
					else {
						test = args[0].toLowerCase();
						console.log(test);
						if (test == "ap"){
							rows[pos].ap = args[1];
							gear = [args[1],rows[pos].awp,rows[pos].dp];
							rows[pos].gs = Math.round((Number(gear[0]) + Number(gear[1]))/2 + Number(gear[2]));
							rows[pos].date = day.getDate()+" "+ months[day.getMonth()];
							rows[pos].second = day.getTime();
							rows[pos].save();
						}
						else if (test == "awp"){
							rows[pos].awp = args[1];
							gear = [rows[pos].ap,args[1],rows[pos].dp];
							rows[pos].gs = Math.round((Number(gear[0]) + Number(gear[1]))/2 + Number(gear[2]));
							rows[pos].date = day.getDate()+" "+ months[day.getMonth()];
							rows[pos].second = day.getTime();
							rows[pos].save();
						}
						else if (test == "dp"){
							rows[pos].awp = args[1];
							gear = [rows[pos].ap,rows[pos].awp,args[1]];
							rows[pos].gs = Math.round((Number(gear[0]) + Number(gear[1]))/2 + Number(gear[2]));
							rows[pos].date = day.getDate()+" "+ months[day.getMonth()];
							rows[pos].second = day.getTime();
							rows[pos].save();
						}
						else if (test == "level" || test == "lvl"){
							if (args[1] << 100){
								rows[pos].level = args[1];
								rows[pos].date = day.getDate()+" "+ months[day.getMonth()];
								rows[pos].second = day.getTime();
								rows[pos].save();
								message.channel.send(`<@${targetid}> ***Updated Level***: ${args[1]}`);
							}
							else{
								message.channel.send(`<@${message.member.id}> !gs lvl XX`+
								"\n        *Example:* !gs level 60"+
								"\n        *!gs lvl 60* also work ");
							}
							return;
						}
						else if (test == "class" || test == "type"){
							if (args[1] << 100){
								rows[pos].level = args[1];
								rows[pos].date = day.getDate()+" "+ months[day.getMonth()];
								rows[pos].second = day.getTime();
								rows[pos].save();
								message.channel.send(`<@${targetid}> ***Updated Class***: ${args[1]}`);
							}
							else{
								message.channel.send(`<@${message.member.id}> !gs lvl XX`+
								"\n        *Example:* !gs level 60"+
								"\n        *!gs lvl 60* also work ");
							}
							return;
						}
						else {
							try{
								var pos = rows.map(function (img) { return img.family}).indexOf(args[0]);
								message.channel.send(
								"<@"+rows[pos].id+"> ***Info*** - Lvl: " + rows[pos].level + 
								"\n    **ap**:  " +rows[pos].ap+
								"\n    **awp**: " +rows[pos].awp+
								"\n    **dp**:  " +rows[pos].dp
								);
							}
							catch(err){
								message.channel.send(`<@${message.member.id}> !gs AP/AWP/DP`+
								"\n        *Example:* !gs 262/260/300"+
								"\n        *You can change single value by:* !gs ap 300 ");
							}
							return;
						}
					}
					message.channel.send(`<@${targetid}> ***Updated Gearscore***:  ${Math.round((Number(gear[0]) + Number(gear[1]))/2 + Number(gear[2]))}  (**AP** *${gear[0]}*/**AWP** *${gear[1]}*/**DP** *${gear[2]}*)`);
					gschanged = true;
				}
				else{
					message.channel.send(`<@${message.member.id}> !gs AP/AWP/DP`+
					"\n        *Example:* !gs 262/260/300"+
					"\n        *You can change single value by:* !gs ap 300 ");
				}
			});
			
		
			return;
		}
		else if (cmd === "remove"){
			googleupdate();
			sheet.getRows({
				offset: 1,
			limit: 100,
			},function( err, rows ){
				var pos = rows.map(function (img) { return img.id}).indexOf(args[0].replace(/[<@!>]/g, ''));
				if(pos < 0){
					pos = rows.map(function (img) { return img.family}).indexOf(args[0].replace(/[@]/g, ''));
				}
				if(pos > 0){
					if (rows[pos].rank == "R"){
						message.channel.send("<@"+rows[pos].id+"> *has already been removed*, ***changing Rank back to*** **M**");
						rows[pos].rank ="M";
						rows[pos].save();
					}
					else if (rows[pos].rank == "M"){
						message.channel.send("<@"+rows[pos].id+"> *removing user*, ***changing Rank to*** **R**");
						rows[pos].rank ="R";
						rows[pos].save();
					}
					else if (rows[pos].rank == "O"){
						message.channel.send("<@"+rows[pos].id+"> *Cannot removed Officer through bot*, ***Please do this manually***");
					}
					else{
						message.channel.send("***Error in removing user***");
					}
				}
			});
		}
		
		else if (cmd === "register"){
			if (message.member.roles.find("name", config.tag.admin) ||message.member.roles.find("name", "Editor")){
				if (args.length > 0){
					googleupdate();
					sheet.getRows({
						offset: 1,
					limit: 100,
					},function( err, rows ){
						var pos = rows.map(function (img) { return img.id}).indexOf(args[0].replace(/[<@!>]/g, ''));
						if (args[0].includes("@")) {
							if(pos < 0){
								pos = rows.map(function (img) { return img.family}).indexOf(args[0].replace(/[@]/g, ''));
								var i = 0;
								while(pos < 0){
									i++
									if (rows[i].id == "0")
									{
										pos = i;
									}
								}
								console.log(pos);
								rows[pos].id = args[0].replace(/[<@!>]/g, '');
								rows[pos].rank = "M";
								rows[pos].save();
								message.channel.send(`<@${rows[pos].id}> **Has been registered to the system** you can use ***!register family Vonz*** and ***!register class Wizard***`);
							}
							if (args.length > 1)
							{
								var cmd2 = args[1].toLowerCase();
								targetid = args[0].replace(/[<@!>]/g, '');
								if (cmd2 == "family"){
									try{
										rows[pos].family = args[1];
										message.channel.send(`<@${rows[pos].id}> Family Name is Set to **${args[2]}**`);
										rows[pos].save();
										message.guild.members.get(interview.member[tes].id).setNickname(interview.member[tes].family);
									} catch(err){
										message.channel.send("**Wrong Command:** !register family Vonz");
									}
								}
								else if (cmd2 == "class"){
									var firstword = args[2].toLowerCase();
									var classnames = ["ranger", "sorceress", "lahn", "tamer", "maehwa", "valkyrie", "kunoichi", "witch", "mystic", "darkknight", "dark", "warrior", "berserker", "striker", "musa", "ninja", "wizard", "archer", "shai"];
									var classlist = ["Ranger", "Sorceress", "Lahn", "Tamer", "Maehwa", "Valkyrie", "Kunoichi", "Witch", "Mystic", "Dark Knight", "Dark Knight", "Warrior", "Berserker", "Striker", "Musa", "Ninja", "Wizard", "Archer", "Shai"];
									if (args.length == 3 || firstword == "dark"){
										if(classnames.indexOf(firstword) < 0){
											console.log(classlist[classnames.indexOf(firstword)]);
											message.channel.send("**Wrong Class:** Please spell your class right");
										}
										else{
											rows[pos].class = classlist[classnames.indexOf(firstword)];
											message.channel.send(`<@${rows[pos].id}> Class is Set to **${classlist[classnames.indexOf(firstword)]}**`);
											rows[pos].save();
										}
										
									}
									else{
										message.channel.send("**Wrong Format:** !register class CLASS \n      *Example:* ***!register class Wizard***");
									}
								}
							}
						}
						
					});
				}
				else{
					message.channel.send(`<@${message.member.id}> *direct message <@${config.userid.bot}> anything to start register process*`);
				}
			}
			else{
				message.channel.send(`<@${message.member.id}> *direct message <@${config.userid.bot}> anything to start register process*`);
			}
		}
		
		else if (cmd === "delete"){
			if (!message.channel.permissionsFor(message.author).has("MANAGE_MESSAGES")) {
				message.channel.send("Sorry, you don't have the permission to execute the command \""+message.content+"\"");
				console.log("Sorry, you don't have the permission to execute the command \""+message.content+"\"");
				return;
			} else if (!message.channel.permissionsFor(bot.user).has("MANAGE_MESSAGES")) {
				message.channel.send("Sorry, I don't have the permission to execute the command \""+message.content+"\"");
				console.log("Sorry, I don't have the permission to execute the command \""+message.content+"\"");
				return;
			} else if (!message.member.roles.find("name", "Host"))
			{
				message.channel.send("Sorry, you don't have the permission to execute the command \""+message.content+"\"");
				console.log("Sorry, you don't have the permission to execute the command \""+message.content+"\"");
				return;
			} else if (args[0] == null){
				message.channel.send("Sorry, don't use this command if you don't know how to use it \""+message.content+"\"");
			return;
			}
			del(args[0]);
			message.channel.send(`Command ${message.content} Running`).then(msg => {
				msg.delete(5000);
			});
		}
		else if (cmd === "decline"){
			if (message.channel.id == config.channel.modchat){
				try{
					var tes = interview.member.map(function (img) { return img.id}).indexOf(args[0].replace(/[<@!>]/g, ''));
					if (tes < 0){
						tes = interview.member.map(function (img) { return img.family}).indexOf(args[0].replace(/[<@!>]/g, ''));
					}
					if (tes > 0){
						console.log(tes);
						message.reply(`**The User ${args[0]} entry has been declined**`);
						interview.member.splice(tes, 1);
						save(interview);
					}
					else message.reply(`**The User ${args[0]} has not Registered through the register system**`);
				}
				catch(err){
					message.reply(`**The User ${args[0]} has not Registered through the register system**`);
				}
			}
		}
		else if (cmd === "accept"){
			if (message.channel.id == config.channel.modchat){
				if(args[0] == "list"|| args.length == 0){
					console.log("listing");
					interview = require('./data/interview.json');
					for(var i=0; i<interview.member.length; i++){
					message.channel.send("<@"+interview.member[i].id+">** " + interview.member[i].family +"**  *Lvl:* " + interview.member[i].level + "  *Class:* " + interview.member[i].class +"  *GS:* " + interview.member[i].gs +"  "+ interview.member[i].ap+"/"+ interview.member[i].awp+"/"+ interview.member[i].dp);
					console.log(i);
					}
				}
				else{
					if(args.length == 1){
						interview = require('./data/interview.json');
						try{
							var tes = interview.member.map(function (img) { return img.id}).indexOf(args[0].replace(/[<@!>]/g, ''));
							if (tes <0){
								tes = interview.member.map(function (img) { return img.family}).indexOf(args[0].replace(/[<@!>]/g, ''));
							}
							message.guild.members.get(interview.member[tes].id).setNickname(interview.member[tes].family).catch(console.error);
							message.guild.members.get(interview.member[tes].id).removeRole(message.guild.roles.find(role => role.name === config.tag.potential)).catch(console.error);
							message.guild.members.get(interview.member[tes].id).addRole(message.guild.roles.find(role => role.name === config.tag.member)).catch(console.error);
							googleupdate();
							sheet.getRows({
								offset: 1,
							limit: 100,
							},function( err, rows ){
								var pos = rows.map(function (ces) { return ces.id; }).indexOf(interview.member[tes].id);
								if(pos < 0){
									console.log(rows.length);
									var i = 0;
									while(pos < 0){
										i++
										if (rows[i].id == "0")
										{
											pos = i;
										}
									}
									rows[pos].id = interview.member[tes].id;
								}
								console.log(pos);
								console.log(interview.member[tes].id);
								rows[pos].rank = `M`;
								rows[pos].family = interview.member[tes].family;
								rows[pos].class = interview.member[tes].class;
								rows[pos].level = interview.member[tes].level;
								rows[pos].ap = interview.member[tes].ap;
								rows[pos].awp = interview.member[tes].awp;
								rows[pos].dp = interview.member[tes].dp;
								rows[pos].gs = interview.member[tes].gs;
								var day = new Date();
								rows[pos].date = day.getDate()+" "+ months[day.getMonth()];
								rows[pos].second = day.getTime();
								rows[pos].save();
								message.reply(`**The User ${args[0]} has been Registered to the Database**`);
								bot.channels.get(config.channel.general).send(`${args[0]} has joined the guild`);
								googleupdate();
								interview.member.splice(tes, 1);
								save(interview);
							});
						}
						catch(err){
							message.reply(`**The User ${args[0]} has not Registered through the register system**`);
						}
					}
				}
			}
		}
			
		else if (cmd === "help" || cmd === "commands" || cmd === "command"){
			message.channel.send(
			`**Nightingale Bot Commands** \`\`\`
			\n   !gs or !g or !gear              - shows "how to use" !gear (all 3 commands works)
			\n   !gs @USER or !gs FAMILYNAME     - shows the user's gearscore
			\n   !gs AP/AWP/DP                     e.g !gs 200/200/300- changes users gearscore
			\n   !gs AP XXX                        e.g !gs awp 300 - changes individual scores
			\n   !gs lvl XX                        e.g !gs lvl 66 - changes level
			\n   !register                         start registering process - pm bot to start
			\`\`\``);
		}
		
        else { // if the command doesn't match anything you can say something or just ignore it
            //message.channel.send(`I don't know what command that is. For more check ***!help***`);
            return;
        }
        
    } else if (message.content.indexOf("<@"+bot.user.id) === 0 || message.content.indexOf("<@!"+bot.user.id) === 0) { // Catch @Mentions

        return message.channel.send(`Use \`${config.prefix}\` to interact with me.`); //help people learn your prefix
    }
    return;
});

function evalCmd(message, code) {
    if(message.author.id !== config.userid.owner) return;
    try {
        let evaled = eval(code);
        if (typeof evaled !== "string")
            evaled = util.inspect(evaled);
            message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}


function updatelistgoogle(){
	googleupdate();
	sheet.getRows({
		offset: 1,
	limit: 100,
	},function( err, rows ){
		var total = 0;
		console.log('Read '+rows.length+' rows');
		var post = "Rank        Family      Level   AP/AWP/DP       Gearscore\n";
		var post2 = "";
		var post3 = "";
		list = rows.sort(sortByProperty('gs'));
		try{
			var k =0;
			for(var i=0;i<=rows.length-1;i++){
				try{
					var fname = rows[rows.map(function (test) { return test.family; }).indexOf(list[i].family)].family;
				}catch(err){
					var fname = "ERROR";
				}
				if (list[i].rank == "M" || list[i].rank == "GM" || list[i].rank == "O"){
					var scores = list[i].ap + "/" + list[i].awp + "/" + list[i].dp;
					k++;
					if (k<=30){
						post += `# ${space(`${k}`,3)}     ${space(fname,15)} ${space(list[i].level,4)}  ${space(scores,15)}    ${list[i].gs}\n`;
					}else if(k<30 && k>=60){
						post2 += `# ${space(`${k}`,3)}     ${space(fname,15)} ${space(list[i].level,4)}  ${space(scores,15)}    ${list[i].gs}\n`;
					}else if(k<60){
						post3 += `# ${space(`${k}`,3)}     ${space(fname,15)} ${space(list[i].level,4)}  ${space(scores,15)}    ${list[i].gs}\n`;
					}
					
					
					total += Number(list[i].gs);
				}
			}
		}catch(err){bot.channels.get(config.channel.leaderboard).send(i)}
		async function clear() {
			const fetched = await bot.channels.get(config.channel.leaderboard).fetchMessages({limit: 99});
			bot.channels.get(config.channel.leaderboard).bulkDelete(fetched);
		}
		clear();
		var avg = Math.round(total/k);
		bot.channels.get(config.channel.leaderboard).send(`**Gearscore Leaderboard**  *Average Gearscore: ${avg}* \`\`\`diff\n${post}\`\`\``);
		if (post2 != ""){
			bot.channels.get(config.channel.leaderboard).send(`\`\`\`diff\n${post2}\`\`\``);
		}
		if (post3 != ""){
			bot.channels.get(config.channel.leaderboard).send(`\`\`\`diff\n${post3}\`\`\``);
		}
		bot.channels.get(config.channel.leaderboard).send(`*use* ***!gear*** *to update your renownscore, for more* ***!help***
												\n   *please remember to first* ***!register***
												\n        *Example:* !gs 262/260/300
												\n        *You can change single value by:* !gs ap 300 );
		`);
		
	});
}

function space(str, numspace)
{
    var emptySpace = "";
	var space = numspace-str.length;
    for (i = 0; i < space; i++){
        emptySpace += " ";
    }
    var output = str + emptySpace;
    return output;
}

function clean(text) {
    if (typeof(text) !== 'string') {
        text = util.inspect(text, { depth: 0 });
    }
    text = text
        .replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203))
        .replace(config.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0') //Don't let it post your token
    return text;
}

function timer(){
	var now = new Date();
	var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0, 0) - now;
	if (millisTill10 < 0) {
		 millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
	}
	setTimeout(function()
	{
		bot.channel.get(496468868953407489).send("It's time!");
		timer();
	}, millisTill10);
	console.log(`timer set`);
}


function del(channeldel){
	var test1 = bot.channels.get(channeldel).fetchMessages();
	var test = test1;
	//bot.channels.get(channeldel).fetchMessage(test[1].id).delete;
	//for (var i=0;i>test.length;i++){
	//		 bot.channels.get(channeldel).fetchMessage(test[i].id).delete;
	//		 console.log(i);
	//	}
	
	bot.channels.get(channeldel).fetchMessages()
	  .then(messages => {
		messagesDeleted = messages.array(); // number of messages deleted
		//bot.channels.get(channeldel).bulkDelete(messages);
		for (var i=0;i<=messagesDeleted.length;i++){
			try{
			console.log(messagesDeleted.length-1-i);
			 message = bot.channels.get(channeldel).fetchMessage(messagesDeleted[messagesDeleted.length-1-i].id).then(msg => msg.delete());
			} catch(err){console.log("final " +messagesDeleted.length-1-i);}
		}
		

		// Logging the number of messages deleted on both the channel and console.
		bot.channels.get(channeldel).send("Deletion of messages successful. Total messages deleted: "+messagesDeleted.length)
		.then(msg => {
			msg.delete(5000);
		});
		console.log('Deletion of messages successful. Total messages deleted: '+messagesDeleted.length)
	  })
	  .catch(err => {
		console.log('Error while doing Bulk Delete');
		console.log(err);
	});
}


var sortByProperty = function (property) {
		return function (x, y) {

			return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? 1 : -1));
		};
	};

function isUrl(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}

function googleupdate(){
	asyncs.series([
  function setAuth(step) {
    // see notes below for authentication instructions!
    var creds = require('./data/credentials');
    // OR, if you cannot save the file locally (like on heroku)
    var creds_json = {
      client_email: 'Nightingale@Nightingale.iam.gserviceaccount.com',
      private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxDlfia6NcjBM5\nTf39KbP8BSaF7RZPdWzwxfkEa4M2H+JwDAmmmnwXo7Lk2mYU50mX2ekM/Bo5JPsX\nQaMTfBp3l2z60Da3vRRCUvOv1dnxAKaeZpPqkeRJHurNUvLupoUysc8N26CtIlzP\nfaGccWWEe/4Pc3QZbrYZ+rEqAlPnA8hVC3YhWCfvjZUocZip6One1dEDwtsPalCz\nNHEK7jx0uOOozVut1N4V0CZTomS9Oau53nMUzfGfjMul8bJn+xBI2n+Fdkvp5+MK\nfn9Uc9BDH6pQpb5g4gnqieFKxpUZ78usK6Op4hmeK6DgeeBEFOPuLKmdz7qHHvtv\n5U/m2uXnAgMBAAECggEAEJqpv0Ac59bzDpKz2QQKLv5EqJadWwJGHyZRvgpfGbpP\nv/ZBCXC/ZnAhnLimjhtKmYUECAW0Z9uB+KJdKryetsxqmfLgzsZamgWxeLHzaFiJ\nR52TDZJ0+C6AEpVO1vai0yg9pK0OGm54ibTcbRFtVclTABvxrVjmlvUdnDTvrWBT\nRwCICyWNyWKQIICMNUqbRSMB7P59YsjiN2PJKtH5eYAElz7dwxVeRAmBuL1WApTV\neFn/63SeVMkJNBLTRjZdNh0pNYc1bkZwBdbSnKIpBIG7yXToigWKMoWIrzfX2/oF\njkwRyJBb7O9RrkW2NCH/MLmMe6rEzSUYPhjsH52+0QKBgQDswIBFt/RAK/JgSi4B\nFb/JB9bUXz3HcX2teOg+RBftt6HdvfLEa4s7geCuD1VfNqpLlOE0MCtgaIAnTEX+\nmMaE/h9jSKA5PRRH7skpggXtVas/K1h8kfprAzwL6DLJlCewy7OefbWtXXZD1id3\nPfhVjSk4AgAZB6ogFHjEBFVERQKBgQC/c2VTFJnuo694YpwIocn4HSDZJ3W7gla6\nYB5bUlPWd2I+rfrJ0/Fw3muwfP0EMjgRiY/actD6Sfx7JppRjFNO4AAIYc6JEyHR\naZB+v3yQF+jeTwJdbVmTEk0d6dg6U82KE80SjvgAu93TGiznEplgh82pNOAwdHbh\nuNhV4UciOwKBgBt1ZCsx36lFr5HNaLKFhD3bo+XzueWU2x+wgzcdjKzsfGCMdEil\ntHtNX/KwIpWtcGjdtpTn9U/0LtDf/so9i+DG3HsWZEbfN6f0IO6oful84ySrcVLZ\nV3Lr6B31a1aH0Wam6Yk7SUP3MA1EHEWvMUsy2RH+4WYFxox781nAqucFAoGBAKND\ndRT0bJDlZa3z6bwyvFmp/WkyDWRqMiud7EVUX8p05IMvOr8CztLB2nQXIm2Bpe7O\nsK5JW40VqwoaUV9Zm3GX9G8xeT/L4PsEWwS7py36Ncve9NVXexvAb6Mi2BJlhNJL\nMIazBSsbCoALwl8LrWB0bx3syYKIzxiO2W3jPxYhAoGATabua5QelXhIkUHONZqR\nPFA0nLOx/cKwQOw/rd6JKKb2TIDHABRZebyfJoUVHBNQHeZNEK6jx97viBFFpKDf\nYJyFjVbJegMSSJEhxAH/V2Yl2SVgMqctLsN2XOgYi7knglRwXyOubi1cLOGEaCYf\noKHKjvVjoPIAxWl+FvMewkM=\n-----END PRIVATE KEY-----\n'
    }
 
    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
	  srules = info.worksheets[1];
	  grules = info.worksheets[2];
      console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      step();
    });
  }], function(err){
    if( err ) {
      console.log('Error: '+err);
    }
});
}

function save(interview){
	var fs = require("fs");
		fs.writeFile('./data/interview.json', JSON.stringify(interview, null, 4), (err) => {
		if (err) {
			message.channel.send(err);
			return;
			};
		});
	}

function autoaddid(){
	googleupdate();
	memberlist = [];
	member = [];
	bot.channels.get("config.channel.welcome").members.forEach(member2 => memberlist.push(member2.user.id)); 
	
	console.log(bot.channels.get("config.channel.welcome").members.get(config.userid.owner).displayName)
	sheet.getRows({
		offset: 1,
		limit: 100,
	},function( err, rows ){
		for(var i=0;i<rows.length;i++){
			if(rows[i].id == ""){
				console.log(rows[i].family);
				for (var j=0;j<memberlist.length;j++){
					var texts = "failed";

					try{
						texts = String(bot.channels.get("config.channel.welcome").members.get(memberlist[j]).displayName);
						if (rows[i].family == String(bot.channels.get("config.channel.welcome").members.get(memberlist[j]).displayName)){
							
							member.push(rows[i].family);
							rows[i].id = memberlist[j];
							rows[i].save();
						}
					}
					catch(err){
						//console.log(err);
					}
					console.log("    " +texts+ "failed");
					
				}
			}
		}
		console.log(member);
		bot.channels.get(config.channel.botlog).send("Added " + member.length + " id to database");
	});
}

function registersystem(regs){
	// Direct Message
	bot.channels.get(config.channel.botlog).send("**Debug** some send me a directmessage \n```" + regs.content+ "``` from <@" + regs.author.id+ ">");
	//regs.reply("Sry, there is no support for direct messages yet.");
	interview = require('./data/interview.json');
	let msg = regs.content.slice(config.prefix.length); // slice of the prefix on the message
	let args = msg.split(" "); // break the message into part by spaces
	let cmd = args[0].toLowerCase();
	var pos;
	
	try{
		pos = interview.member.map(function (test) { return test.id; }).indexOf(regs.author.id);
		interview.member[pos].id;
	}catch(err){
		interview.member.push({"id": `${regs.author.id}`,"family":"","level":"","class":"","ap":"","awp":"","dp":"","gs":""});
		var pos = interview.member.length-1;
		regs.reply("**Welcome to Nightingale's Auto Registering Process** \n*fill in the following table and then use command* ***!accept*** *to complete registering process*");
	}
	//return; //Optionally handle direct messages
	if (cmd == "help"){
		return (`<@&${config.officertag}> **IMPORTANT**- <@${regs.member.id}> has requested help on registering`);
	}
	else if (cmd == "gs"|| cmd == "g"|| cmd == "gear"){
		var gear = args[1].split("/");
		var firstword = args[1].toLowerCase();
		var day = new Date();
		if (gear.length == 3){
			interview.member[pos].ap = gear[0];
			interview.member[pos].awp = gear[1];
			interview.member[pos].dp = gear[2];
			interview.member[pos].gs = Math.round((Number(gear[0]) + Number(gear[1]))/2 + Number(gear[2]));
		}
		else if(firstword == "lvl" || firstword == "level" || firstword == "l"){
			if (args[2] >> 100){
				interview.member[pos].level = args[2];
			}
			else {
				return ("**Wrong Format:** !gs lvl/level LVL \n      *Example:* ***!gs lvl 66***");
			}
		}
		else{
			return ("**Wrong Format:** !gs AP/AWP/DP \n      *Example:* ***!gs 231/234/293***");
		}
	}
	else if (cmd == "family"){
		if (args.length == 2){
			interview.member[pos].family = args[1];
		}
		else{
			return ("**Wrong Format:** !family Family_Name \n      *Example:* ***!family Vonz***");
		}
	}
	else if(cmd == "class"){
		var firstword = args[1].toLowerCase();
		var classnames = ["ranger", "sorceress", "lahn", "tamer", "maehwa", "valkyrie", "kunoichi", "witch", "mystic", "darkknight", "dark", "warrior", "berserker", "striker", "musa", "ninja", "wizard", "archer", "shai"];
		var classlist = ["Ranger", "Sorceress", "Lahn", "Tamer", "Maehwa", "Valkyrie", "Kunoichi", "Witch", "Mystic", "Dark Knight", "Dark Knight", "Warrior", "Berserker", "Striker", "Musa", "Ninja", "Wizard", "Archer", "Shai"];
		if (args.length == 2 || firstword == "dark"){
			if(classnames.indexOf(firstword) < 0){
				console.log(classlist[classnames.indexOf(firstword)]);
				return ("**Wrong Class:** Please spell your class right");
			}
			interview.member[pos].class = classlist[classnames.indexOf(firstword)];
		}
		else{
			return ("**Wrong Format:** !class CLASS \n      *Example:* ***!class Wizard***");
		}
	}
	else if (cmd == "accept"){
		var testaccept = 1;
		if (interview.member[pos].family == ""){
			regs.reply("**Family Name** is empty *Please use !family family_name*");
			testaccept = 0;
		}
		if (interview.member[pos].level == ""){
			regs.reply("**Level** is empty *Please use !gs lvl ??*");
			testaccept = 0;
		}
		if (interview.member[pos].gs == ""){
			regs.reply("**Gearscore** is empty *Please use !gs AP/AWP/DP*");
			testaccept = 0;
		}if (interview.member[pos].class == ""){
			regs.reply("**Class** is empty *Please use !class CLASS*");
			testaccept = 0;
		}
		if(testaccept == 0){
			return("**Detail not Complete:**  ***Please use the following Commands*** \n```"+
			"\n         Detail         Command                 Example"+
			"\n     Family Name:    !family Family_Name     !family Vonz" +
			"\n           Level:    !gs lvl LVL             !gs lvl 66" +
			"\n           Class:    !class CLASS            !class Wizard"+
			"\n       Gearscore:    !gs AP/AWP/DP           !gs 231/234/293 ```"+
			"\n   **To Complete Register Process use - !accept**"+
			"*For any help Contact us on Nightingale's Discord Server*"
			);
		}
		else{
			bot.channels.get(config.channel.modchat).send(
			`<@${regs.author.id}>  ***Has Completed the Register Process*** \n`+"```"+
			`\n     Family Name:      ${interview.member[pos].family}`+
			`\n           Level:      ${interview.member[pos].level}`+
			`\n           Class:      ${interview.member[pos].class}`+
			`\n       Gearscore:      ${interview.member[pos].gs}     (auto calculated)`+
			`\n                       AP: ${interview.member[pos].ap} / AWP: ${interview.member[pos].awp} / DP: ${interview.member[pos].dp}`+
			"```" +`*To Accept <@${regs.author.id}>'s Entry use the Command* *** "!accept <@${regs.author.id}>" *** `);
			return(`<@${regs.author.id}>  ***Thank you for Completing the Nightingale's Registering Process***`+
			`\n    *Please Wait for your entry to be Accepted*`);
		}
	}
	else{
		return("**Unknown Command:**  ***Please use the following Commands*** \n```"+
		"\n         Detail         Command                 Example"+
		"\n     Family Name:    !family Family_Name     !family Vonz" +
		"\n           Level:    !gs lvl LVL             !gs lvl 66" +
		"\n           Class:    !class CLASS            !class Wizard"+
		"\n       Gearscore:    !gs AP/AWP/DP           !gs 231/234/293 ```"+
		"\n   **To Complete Register Process use - !accept**"+
		"\n*For any help Contact us on Nightingale's Discord Server*"
		);
	}
	save(interview);
	return(`**<@${regs.author.id}>**  ***Fill in all the details and use !accept to finish register process*** \n`+"```"+
		`\n     Family Name:      ${interview.member[pos].family}`+
		`\n           Level:      ${interview.member[pos].level}`+
		`\n           Class:      ${interview.member[pos].class}`+
		`\n       Gearscore:      ${interview.member[pos].gs}     (auto calculated)`+
 		`\n                       AP: ${interview.member[pos].ap} / AWP: ${interview.member[pos].awp} / DP: ${interview.member[pos].dp}`+
		"```" +`**To Complete Register Process use - !accept** `);
}


// Catch Errors before they crash the app.
process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
    // process.exit(1); //Eh, should be fine, but maybe handle this?
});


process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
    // process.exit(1); //Eh, should be fine, but maybe handle this?
});

bot.login(config.token);