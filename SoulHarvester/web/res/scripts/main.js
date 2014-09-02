/**
 * 
 */

function lHtml(id) {
	return document.getElementById(id);
};

function captalize(str) {
	return str.charAt(0).toUpperCase + str.slice(1);
};

function supportsLocalStorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
};

function formatNumber(num) {
	//var order = ["Thou", "Million", "Billion" ];
	return Math.floor(num);
};

Game = {};

//CONSTANTS
Game.PATH_SAVE = "SoulHarvester.Save";
Game.PATH_ICONS = "./res/icons/";
Game.FPS = 30;

//Flags
Game.tabUnlocked = true;
Game.unitBuy = false;
Game.unitBought = false;

//Objects
Game.Tabs = [];
Game.Souls = [];
Game.Areas = [];
Game.saveSlot = 0;

var genericDesc = "<p>This Generic Soul is so generic there is no description for it yet! Check back later!</p>";
var genericMisc = "<p>This Generic Soul is so generic there is no miscelaneus stuff for it yet! Check back later!</p>";

Game.Color = function(r, g, b, light) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.light = light;
	
	this.getR = function() {
		return (typeof this.r == "function") ? this.r() : this.r;
	};

	this.getG = function() {
		return (typeof this.g == "function") ? this.g() : this.g;
	};
	
	this.getB = function() {
		return (typeof this.b == "function") ? this.b() : this.b;
	};
	
	this.getLight = function() {
		return (typeof this.light == "function") ? this.light() : this.light;
	};
};

Game.Unit = function(name, desc, icon, cost, gen) {
	this.name = name;
	this.desc = desc;
	this.icon = icon;
	this.cost = cost;
	this.gen = gen;
	
	this.quantity = 0;
	this.clickedN = 0;
	this.locked = true;
	
	this.unlock = function() {
		this.locked = false;
	};
	
	this.buy = function() {
		this.quantity++;
	};
	
	this.getGen = function() {
		return this.gen*this.quantity;
	};
};

Game.Soul = function(name, desc, icon, clickable, pColor) {
	this.name = name;
	this.desc = desc;
	this.icon = icon;
	this.clickable = clickable;
	this.pColor = pColor;
	
	this.quantity = 0;
	this.clickedN = 0;
	this.locked = true;
	this.units = [];
	
	this.unlock = function() {
		this.locked = false;
	};
};

Game.Souls[0] = new Game.Soul("Common", "The souls of lower life forms. Its abundance makes it easy to harvest.<br>Tastes like blueberries...", "soulBlue.png", "soulBlue.png", new Game.Color(
		function(){
			return Math.round(Math.random() * 50);
		}, 
		function(){
			return 100 + Math.round(Math.random() * 155);
		}, 
		function(){
			return 155 + Math.round(Math.random() * 100);
		},
		true));

Game.Souls[0].units.push(new Game.Unit("Reaper", "The most basic collector of souls.", "reaper.png", {Common: 15},  0.1));
Game.Souls[0].units.push(new Game.Unit("Reaper", "The most basic collector of souls.", "reaper.png", {Common: 15},  0.1));
Game.Souls[0].units.push(new Game.Unit("Reaper", "The most basic collector of souls.", "reaper.png", {Common: 15},  0.1));
Game.Souls[0].units.push(new Game.Unit("Reaper", "The most basic collector of souls.", "reaper.png", {Common: 15},  0.1));
Game.Souls[0].units.push(new Game.Unit("Reaper", "The most basic collector of souls.", "reaper.png", {Common: 15},  0.1));
Game.Souls[0].units.push(new Game.Unit("Reaper", "The most basic collector of souls.", "reaper.png", {Common: 15},  0.1));
Game.Souls[0].units.push(new Game.Unit("Reaper", "The most basic collector of souls.", "reaper.png", {Common: 15},  0.1));
Game.Souls[0].units.push(new Game.Unit("Reaper", "The most basic collector of souls.", "reaper.png", {Common: 15},  0.1));
Game.Souls[0].units.push(new Game.Unit("Reaper", "The most basic collector of souls.", "reaper.png", {Common: 15},  0.1));
Game.Souls[0].units.push(new Game.Unit("Reaper", "The most basic collector of souls.", "reaper.png", {Common: 15},  0.1));

Game.Souls[1] = new Game.Soul("Wrath", "Powerfull souls consumed by rage.", "soulRed.png", "soulRed.png", new Game.Color(
		function(){
			return 140 + Math.round(Math.random() * 115);
		}, 
		function(){
			return Math.round(Math.random() * 20);
		}, 
		function(){
			return Math.round(Math.random() * 20);
		},
		false));
Game.Souls[2] = new Game.Soul("Evil", "The souls of lower demons and their ilk.", "soulPurple.png", "soulPurple.png", new Game.Color(
		function(){
			return 80 + Math.round(Math.random() * 50);
		}, 
		function(){
			return Math.round(Math.random() * 30);
		}, 
		function(){
			return 70 + Math.round(Math.random() * 50);
		},
		false));
Game.Souls[3] = new Game.Soul("Pure", "The soul of lower arcane beings. Delicious, but watch those callories", "soulYellow.png", "soulYellow.png", new Game.Color(
		function(){
			return 180 + Math.round(Math.random() * 75);
		}, 
		function(){
			return 180 + Math.round(Math.random() * 75);
		}, 
		function(){
			return Math.round(Math.random() * 10);
		},
		true));

Game.currentScreen = 0;
Game.goToArea = 0;


Game.getGameArea = function(id) {
	console.log(id + ': ');
	Game.Areas[Game.currentScreen].area.style.display = 'none';
	Game.Areas[id].area.style.display = 'block';
	Game.Tabs[Game.currentScreen].setAttribute('class', 'none');
	Game.Tabs[id].setAttribute('class','activeTab');
	Game.currentScreen = id;
};


Game.tabCliked = function(id) {
	if(!Game.Souls[id].locked)Game.goToArea = id;
};

Game.unitClicked = function(id) {
	Game.Souls[Game.currentScreen].units[id].clickedN++;
	Game.unitBuy = true;
};

//TABS
var aux;
var str = "";
for(var id = 0; id < Game.Souls.length; id++) {
	str += "<div class='tab' style='z-index: " + (Game.Souls.length+10-id)
		+ ";' onclick='Game.tabCliked(" + id + ");'><img src='"
		+ Game.PATH_ICONS + Game.Souls[id].icon + "'><p>" + Game.Souls[id].name + " Souls</p>"
		+"<div class = 'lockActive'><img class = 'lockIcon' src='" + Game.PATH_ICONS + "padlock.png'></div></div>";
}
aux = lHtml("tabs");
aux.innerHTML = str;
Game.Tabs = aux.childNodes;
console.log(Game.Tabs);

str = "";
for(var id = 0; id < Game.Souls.length; id++) {
	str +=	"<div class='gameArea'><div class='soulImg'><p>"+ formatNumber(Game.Souls[id].quantity) +"</p><img onclick='Game.soulClicked()' src='"
		+ Game.PATH_ICONS
		+ Game.Souls[id].clickable
		+ "'><canvas class='soulCanvas' width='260' height='260'></div><div class='soulDesc'><h1>"+ Game.Souls[id].name + " Souls:<br></h1>"
		+ Game.Souls[id].desc
		+ "</div><div class='soulUnits'><div class='header'>Units:</div><div class='unitList'>";
	for(var i = 0; i < Game.Souls[id].units.length; i++) {
		str +=	"<div class='unit' onclick='Game.unitClicked("+i+")'><p class='unitCounter'>"+ formatNumber(Game.Souls[id].units[i].quantity) 
			+"</p><p class='unitName'>"+ Game.Souls[id].units[i].name +": </p><img src='"
			+ Game.PATH_ICONS
			+ Game.Souls[id].units[i].icon
			+ "'><p class='unitCost'>"+ formatNumber(Game.Souls[id].units[i].quantity) +"</p></div>";
	}
	str += "</div></div><div class='soulMisc'>"
		+ genericMisc
		+ "</div></div>";
}
aux = lHtml("gameAreas");
aux.innerHTML = str;

for ( var i = 0; i < aux.childNodes.length; i++) {
	//Create the object
	Game.Areas[i] = {};
	//The Area
	Game.Areas[i].area = aux.childNodes[i];
	
	//Soul SubArea
	Game.Areas[i].counter = aux.childNodes[i].firstChild.firstChild;
	var canvas = aux.childNodes[i].firstChild.lastChild;
	Game.Areas[i].soulCanvas = {};
	Game.Areas[i].soulCanvas.canvas = canvas;
	Game.Areas[i].soulCanvas.ctx = canvas.getContext("2d");
	Game.Areas[i].soulCanvas.w = canvas.width;
	Game.Areas[i].soulCanvas.h = canvas.height;
	Game.Areas[i].soulCanvas.particles = [];
	
	//Units SubArea
	Game.Areas[i].unitList = aux.childNodes[i].childNodes[2].lastChild.childNodes;
}
console.log(Game.Areas);

id = 0;
str = "<div class='souls'><img src='" + Game.PATH_ICONS
		+ "soulBlue.png'><p>SOULS:</p><p>" + formatNumber(Game.Souls[id++].quantity) + "</p></div>"
		+ "<div class='souls'><img src='" + Game.PATH_ICONS
		+ "soulRed.png'><p>SOULS:</p><p>" + formatNumber(Game.Souls[id++].quantity) + "</p></div>"
		+ "<div class='souls'><img src='" + Game.PATH_ICONS
		+ "soulPurple.png'><p>SOULS:</p><p>" + formatNumber(Game.Souls[id++].quantity) + "</p></div>"
		+ "<div class='souls'><img src='" + Game.PATH_ICONS
		+ "soulYellow.png'><p>SOULS:</p><p>" + formatNumber(Game.Souls[id++].quantity) + "</p></div>";
aux = lHtml("leftInf");
aux.innerHTML = str;
for ( var i = 0; i < aux.childNodes.length; i++) {
	Game.Souls[i].counter = aux.childNodes[i].lastChild; 
}
console.log(Game.Souls);

Game.SoulParticle = function(x, y, color) {
	//Motion
	this.pos = {
		x : x,
		y : y
	};
	this.spd = {
		x : -9 + Math.random() * 18,
		y : 3.5 - Math.random() * 1
	};
	this.acl = {
		x : (this.spd.x > 0) ? -.5 + Math.random() * .1
				: 0.5 - Math.random() * 0.1,
		y : -1 + Math.random() * 0.5
	};
	
	//Color
	this.r = color.getR();
	this.g = color.getG();
	this.b = color.getB();
	this.light = color.getLight();
	
	//Size
	this.radius = 10 + Math.random() * 20;

	//Life time
	this.life = 20 + Math.random() * 10;
	this.remainingLife = this.life;

};

Game.soulClicked = function() {
	for ( var i = 0; i < 200; i++) {
		if(Game.Areas[Game.currentScreen].soulCanvas.particles.length < 3000)
			Game.Areas[Game.currentScreen].soulCanvas.particles.push(
				new Game.SoulParticle(130, 185, Game.Souls[Game.currentScreen].pColor)
			);
	}
	Game.Souls[Game.currentScreen].clickedN++;
};

Game.drawSoulCanvas = function() {
	var canvas = Game.Areas[Game.currentScreen].soulCanvas;
	canvas.ctx.globalCompositeOperation = "source-over";
	canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
	for ( var i = 0; i < canvas.particles.length; i++) {
		var p = canvas.particles[i];
		if(p.light)canvas.ctx.globalCompositeOperation = "lighter";
		canvas.ctx.beginPath();

		p.opacity = Math.round(p.remainingLife / p.life * 100) / 100;

		var gradient = canvas.ctx.createRadialGradient(p.pos.x, p.pos.y, 0,
				p.pos.x, p.pos.y, p.radius);
		gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", "
				+ p.opacity + ")");
		gradient.addColorStop(0.4, "rgba(" + p.r + ", " + p.g + ", " + p.b
				+ ", " + p.opacity + ")");
		gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b
				+ ", 0)");
		canvas.ctx.fillStyle = gradient;
		canvas.ctx.arc(p.pos.x, p.pos.y, p.radius, Math.PI * 2, false);
		canvas.ctx.fill();

		// lets move the particles
		p.remaining_life--;
		p.radius--;
		p.pos.x += p.spd.x;
		p.pos.y += p.spd.y;
		p.spd.x += p.acl.x;
		p.spd.y += p.acl.y;
		if (p.remainingLife < p.life / 2) {
			p.acl.x *= 0.5;
		}
	}
	var parts = [];
	for ( var i = 0; i < canvas.particles.length; i++) {
		var p = canvas.particles[i];
		if (p.remainingLife >= 0 && p.radius > 0) {
			parts.push(p);
		}
	}
	canvas.particles = parts;
};

Game.init = function() {
	Game.getGameArea(0);
	Game.Souls[0].unlock();
	Game.Souls[0].units[0].unlock();
	Game.lastFrameDate = new Date();
};

Game.update = function() {
	var i, j;
	
	//Active Gain
	for(i = 0; i < Game.Souls.length; i++) {
		Game.Souls[i].quantity += Game.Souls[i].clickedN;
		Game.Souls[i].clickedN = 0;
	}
	
	//Passive Gain
	for(i = 0; i < Game.Souls.length; i++) {
		for(j = 0; j < Game.Souls[i].units.length; j++) {
			Game.Souls[i].quantity += Game.Souls[i].units[j].getGen()/Game.FPS;
		}
	}
	
	//Unit Buys
	if(Game.unitBuy) {
		for(i = 0; i < Game.Souls[Game.currentScreen].units.length; i++) {
			while(Game.Souls[Game.currentScreen].units[i].clickedN > 0) {
				Game.Souls[Game.currentScreen].units[i].buy();
				Game.Souls[Game.currentScreen].units[i].clickedN--;
			}
			Game.unitBought = true;
		}
		Game.unitBuy = false;
	}
	
	//Soul Unlocks
	if(Game.Souls[1].locked && Game.Souls[0].quantity > 100) {
		Game.Souls[1].unlock();
		Game.tabUnlocked = true;
	}
	
	//Unit Unlocks
	
};

Game.draw = function() {
	Game.drawSoulCanvas();
	for(var i = 0; i < Game.Souls.length; i++) {
		Game.Souls[i].counter.innerText = formatNumber(Game.Souls[i].quantity);
		Game.Areas[i].counter.innerText = formatNumber(Game.Souls[i].quantity);
	}
	if (Game.unitBought) {
		for(var i = 0; i < Game.Souls[Game.currentScreen].units.length; i++) {
			Game.Areas[Game.currentScreen].unitList[i].firstChild.innerHTML = formatNumber(Game.Souls[Game.currentScreen].units[i].quantity);
		}
		Game.unitBought = false;
	}
	if(Game.tabUnlocked) {
		for(i = 0; i < Game.Souls.length; i++) {
			if(!Game.Souls[i].locked)
				Game.Tabs[i].lastChild.setAttribute("class", "lockInactive");
		}
		Game.tabUnlocked = false;
	}
	if(Game.goToArea != Game.currentScreen) Game.getGameArea(Game.goToArea);
};

Game.save = function() {
	var str = "", i;
	if(!supportsLocalStorage()) return;
	for(i = 0; i<Game.Souls.length; i++) {
		str += Game.Souls[i].quantity + ',';
	}
	str += '|';
	localStorage[Game.PATH_SAVE+Game.saveSlot] = str;
	console.log("Game saved");
};

Game.load = function() {
	var str = "", quantities, i;
	if(!supportsLocalStorage()) return;
	str = localStorage[Game.PATH_SAVE+Game.saveSlot];
	if(!str) return;
	str = str.split('|');
	quantities = str[0].split(',');
	for(i = 0; i<quantities.length; i++) {
		if(quantities[i]) Game.Souls[i].quantity = parseInt(quantities[i]);
	}
	console.log("Game loaded");
};

Game.wipeSave = function() {
};

Game.loop = function() {
	var thisFrame = new Date();
	Game.update();
	Game.draw();
	if (0)
		Game.save();
	// console.log(thisFrame.getTime() - Game.lastFrameDate.getTime());
	Game.lastFrameDate = thisFrame;
	setTimeout(function() {
		Game.loop();
	}, 1000 / Game.FPS);
};

Game.launch = function() {
	Game.init();
	Game.load();
	setTimeout(Game.loop(), 1000 / Game.FPS);
};