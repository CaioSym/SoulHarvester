//Globals
var mouse = {
	x : 0,
	y : 0
};

// Document Events
document.addEventListener('mousemove', function(e) {
	mouse.x = e.clientX || e.pageX;
	mouse.y = e.clientY || e.pageY;
}, false);

// The game.
var Game = {};

// CONSTANTS
Game.FPS = 30;
Game.PATH_SAVE = "SoulHarvester.Save";
Game.PATH_ICONS = "./res/icons/";

// Timers
Game.drawT = 0;
Game.saveT = 0;

// Flags
Game.tabUnlocked = true;
Game.unitBuy = false;
Game.unitBought = true;
Game.saveF = false;

Game.soulClick = false;
// Objects
Game.Tabs = [];
Game.Souls = [];
Game.SoulsByN = [];
Game.Areas = [];
Game.saveSlot = 0;

// Variables
Game.currentScreen = 0;
Game.goToArea = 0;
Game.soulSize = 1;

Game.getGameArea = function(id) {
	console.log(id + ': ');
	Game.Areas[Game.currentScreen].area.style.display = 'none';
	Game.Areas[id].area.style.display = 'block';
	Game.Tabs[Game.currentScreen].setAttribute('class', 'none');
	Game.Tabs[id].setAttribute('class', 'activeTab');
	Game.currentScreen = id;
};

Game.menuClicked = function(icon) {
	switch (icon) {
	case "save":
		Game.saveF = true;
		break;
	case "load":
		location.reload(true);
		break;
	case "reset":
		Game.deleteSave();
		break;
	case "settings":

		break;
	default:
		console.log("menu icon does note exist!");
		break;
	}
};

Game.tabCliked = function(id) {
	if (!Game.Souls[id].locked)
		Game.goToArea = id;
};

Game.unitClicked = function(id) {
	Game.Souls[Game.currentScreen].units[id].clickedN++;
	Game.unitBuy = true;
};

Game.soulClicked = function() {
	for ( var i = 0; i < 200; i++) {
		if (Game.Areas[Game.currentScreen].soulCanvas.particles.length < 3000)
			Game.Areas[Game.currentScreen].soulCanvas.particles
					.push(new SoulParticle(130, 185,
							Game.Souls[Game.currentScreen].pColor));
	}
	Game.soulClick = true;
	Game.Souls[Game.currentScreen].clickedN++;
};

Game.unlockSoul = function(id) {
	Game.Souls[id].unlock();
	Game.Souls[id].info.style.display = "block";
	Game.tabUnlocked = true;
};

Game.drawSoulCanvas = function() {
	var canvas = Game.Areas[Game.currentScreen].soulCanvas;
	canvas.ctx.globalCompositeOperation = "source-over";
	canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
	canvas.ctx.beginPath();
	canvas.ctx.arc(canvas.soul.col.center.x, canvas.soul.col.center.y,
			canvas.soul.col.r, 0, 2 * Math.PI, false);
	canvas.ctx.lineWidth = 1;
	canvas.ctx.strokeStyle = 'red';
	canvas.ctx.stroke();
	for ( var i = 0; i < canvas.particles.length; i++) {
		var p = canvas.particles[i];
		if (p.light)
			canvas.ctx.globalCompositeOperation = "lighter";
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
	// if(Game.soulClick){
	// var s = 0.7;
	// Game.soulClick = false;
	// canvas.ctx.drawImage(canvas.soul.img,
	// (canvas.w-canvas.soul.img.width*s)/2,
	// (canvas.h-canvas.soul.img.height*s)/2, canvas.soul.img.width*s,
	// canvas.soul.img.height*s);
	// }
	// else
	// canvas.ctx.drawImage(canvas.soul.img, (canvas.w-canvas.soul.img.width)/2,
	// (canvas.h-canvas.soul.img.height)/2);
	canvas.ctx.drawImage(canvas.soul.img, (canvas.w - canvas.soul.img.width
			* Game.soulSize) / 2, (canvas.h - canvas.soul.img.height
			* Game.soulSize) / 2, canvas.soul.img.width * Game.soulSize,
			canvas.soul.img.height * Game.soulSize);
	var parts = [];
	for ( var i = 0; i < canvas.particles.length; i++) {
		var p = canvas.particles[i];
		if (p.remainingLife >= 0 && p.radius > 0) {
			parts.push(p);
		}
	}
	delete canvas.particles;
	canvas.particles = parts;
};

Game.buyUnit = function(unitId) {
	var unit = Game.Souls[Game.currentScreen].units[unitId];
	var cost = unit.getCost();
	for (c in cost) {
		if (cost[c] > Game.SoulsByN[c].quantity)
			return false;
	}
	for (c in cost) {
		Game.SoulsByN[c].quantity -= cost[c];
	}
	unit.buy();
	Game.unitBought = true;
	return true;
};

Game.init = function() {
	var genericMisc = "<p>This Generic Soul is so generic there is no miscelaneus stuff for it yet! Check back later!</p>";
	var str;
	var aux, i;

	// Create Souls
	Game.Souls[0] = new Soul(
			"Common",
			"The souls of lower life forms. Its abundance makes it easy to harvest.<br>Tastes like blueberries...",
			"soulBlue.png", "soulBlue.png", new Color(function() {
				return Math.round(Math.random() * 50);
			}, function() {
				return 100 + Math.round(Math.random() * 155);
			}, function() {
				return 155 + Math.round(Math.random() * 100);
			}, true));
	Game.Souls[1] = new Soul("Wrath", "Powerfull souls consumed by rage.",
			"soulRed.png", "soulRed.png", new Color(function() {
				return 140 + Math.round(Math.random() * 115);
			}, function() {
				return Math.round(Math.random() * 20);
			}, function() {
				return Math.round(Math.random() * 20);
			}, false));
	Game.Souls[2] = new Soul("Evil",
			"The souls of lower demons and their ilk.", "soulPurple.png",
			"soulPurple.png", new Color(function() {
				return 80 + Math.round(Math.random() * 50);
			}, function() {
				return Math.round(Math.random() * 30);
			}, function() {
				return 70 + Math.round(Math.random() * 50);
			}, false));
	Game.Souls[3] = new Soul(
			"Pure",
			"The soul of lower arcane beings. Delicious, but watch those callories",
			"soulYellow.png", "soulYellow.png", new Color(function() {
				return 180 + Math.round(Math.random() * 75);
			}, function() {
				return 180 + Math.round(Math.random() * 75);
			}, function() {
				return Math.round(Math.random() * 10);
			}, true));
	Game.Souls[4] = new Soul("Death", "blabla", "soulGreen.png",
			"soulGreen.png", new Color(function() {
				return 180 + Math.round(Math.random() * 75);
			}, function() {
				return 180 + Math.round(Math.random() * 75);
			}, function() {
				return Math.round(Math.random() * 10);
			}, true));

	// Create SoulsByName
	for (i = 0; i < Game.Souls.length; i++) {
		Game.SoulsByN[Game.Souls[i].name] = Game.Souls[i];
		// ImageCache.preload(Game.Souls[i].icon);
	}

	// Create Units

	// Common Soul
	Game.Souls[0].units.push(new Unit("Reapers",
			"The most basic collector of souls.", "reaper.png", {
				Common : 15
			}, 0.1));
	Game.Souls[0].units.push(new Unit("Soul Urn",
			"A vessel that drawns the souls of lower lifeforms.",
			"soulUrn.png", {
				Common : 110
			}, 0.5));
	Game.Souls[0].units.push(new Unit("3rd Tier", "Summons souls",
			"ritualCircle.png", {
				Common : 600
			}, 5));
	Game.Souls[0].units.push(new Unit("Channeling Obelisk",
			"Huge crystaline scructure that drawns a greta number of souls",
			"reaper.png", {
				Common : 4000
			}, 30));
	Game.Souls[0].units
			.push(new Unit(
					"Pact Demon",
					"Bursting with souls! just take care not to eat the whole thing in one go",
					"reaper.png", {
						Evil : 4000
					}, 400));

	// Wrath Soul
	Game.Souls[1].units.push(new Unit("Imp",
			"Annoys souls into a state of wrath", "reaper.png", {
				Wrath : 15
			}, 0.1));
	Game.Souls[1].units.push(new Unit("Torturer",
			"Tortures souls, angering them", "soulUrn.png", {
				Wrath : 110
			}, 0.4));
	Game.Souls[1].units.push(new Unit("Chamber of Pain", "blalala",
			"ritualCircle.png", {
				Wrath : 600
			}, 4));
	Game.Souls[1].units
			.push(new Unit(
					"4th Tier",
					"Bursting with souls! just take care not to eat the whole thing in one go",
					"reaper.png", {
						Wrath : 4000
					}, 26));

	// Evil Soul
	Game.Souls[2].units.push(new Unit("Cultist", "Demons...", "reaper.png", {
		Evil : 15
	}, 0.1));
	Game.Souls[2].units.push(new Unit("Ritual Circle",
			"A vessel that drawns the souls of lower lifeforms.",
			"soulUrn.png", {
				Evil : 110
			}, 0.5));
	Game.Souls[2].units.push(new Unit("Sacrificial Altar", "Summons souls",
			"ritualCircle.png", {
				Evil : 600
			}, 5));
	Game.Souls[2].units
			.push(new Unit(
					"Dungeon",
					"Bursting with souls! just take care not to eat the whole thing in one go",
					"reaper.png", {
						Evil : 4000
					}, 30));
	Game.Souls[2].units
			.push(new Unit(
					"Hell Gate",
					"Bursting with souls! just take care not to eat the whole thing in one go",
					"reaper.png", {
						Evil : 10000
					}, 100));

	// Pure Soul
	Game.Souls[3].units.push(new Unit("Priest",
			"The most basic collector of souls.", "reaper.png", {
				Pure : 15
			}, 0.1));
	Game.Souls[3].units.push(new Unit("Holy Sigil",
			"A vessel that drawns the souls of lower lifeforms.",
			"soulUrn.png", {
				Pure : 110
			}, 0.5));
	Game.Souls[3].units.push(new Unit("Blessed Altar", "Summons souls",
			"ritualCircle.png", {
				Pure : 600
			}, 5));
	Game.Souls[3].units
			.push(new Unit(
					"Temple",
					"Bursting with souls! just take care not to eat the whole thing in one go",
					"reaper.png", {
						Pure : 4000
					}, 30));

	// Create Tabs
	str = "";
	for (i = 0; i < Game.Souls.length; i++) {
		str += "<div class='tab' style='z-index: "
				+ (Game.Souls.length + 10 - i) + ";' onclick='Game.tabCliked("
				+ i + ");'><img src='" + Game.PATH_ICONS + Game.Souls[i].icon
				+ "'><p>" + Game.Souls[i].name + " Souls</p>"
				+ "<div class = 'lockActive'><img class = 'lockIcon' src='"
				+ Game.PATH_ICONS + "padlock.png'></div></div>";
	}
	aux = lHtml("tabs");
	aux.innerHTML = str;
	Game.Tabs = aux.childNodes;
	console.log(Game.Tabs);

	// Create Areas
	str = "";
	for (i = 0; i < Game.Souls.length; i++) {
		str += "<div class='gameArea'><div class='soulImg'><p>"
				+ formatNumber(Game.Souls[i].quantity)
				+ "</p><canvas id='canvas"+i+"' class='soulCanvas' width='260' height='260'></div><div class='soulDesc'><h1>"
				+ Game.Souls[i].name
				+ " Souls:<br></h1>"
				+ Game.Souls[i].desc
				+ "</div><div class='soulUnits'><div class='header'>Units:</div><div class='unitList'>";
		for ( var j = 0; j < Game.Souls[i].units.length; j++) {
			str += "<div class='unit' onclick='Game.unitClicked(" + j
					+ ")'><p class='unitCounter'>"
					+ formatNumber(Game.Souls[i].units[j].quantity)
					+ "</p><p class='unitName'>" + Game.Souls[i].units[j].name
					+ ": </p><img src='" + Game.PATH_ICONS
					+ Game.Souls[i].units[j].icon + "'><div class='unitCost'>";
			var cost = Game.Souls[i].units[j].getCost();
			for (c in cost) {
				str += "<img src='" + Game.PATH_ICONS + Game.SoulsByN[c].icon
						+ "'><p>" + formatNumber(cost[c]) + "</p>";
			}
			str += "</div></div>";
		}
		str += "</div></div><div class='soulMisc'>" + genericMisc
				+ "</div></div>";
	}
	aux = lHtml("gameAreas");
	aux.innerHTML = str;

	for (i = 0; i < aux.childNodes.length; i++) {
		// Create the object
		Game.Areas[i] = {};
		// The Area
		Game.Areas[i].area = aux.childNodes[i];

		// Soul SubArea
		Game.Areas[i].counter = aux.childNodes[i].firstChild.firstChild;
		var canvas = aux.childNodes[i].firstChild.lastChild;
		Game.Areas[i].soulCanvas = {};
		Game.Areas[i].soulCanvas.canvas = canvas;// 
		canvas.addEventListener('click', function(e) {
		    var canvasCoords = lHtml("canvas"+Game.currentScreen).getBoundingClientRect();
			var myCoords = {
				x : mouse.x - canvasCoords.left,
				y : mouse.y - canvasCoords.top
			};
			if (Game.Areas[Game.currentScreen].soulCanvas.soul.col
					.collides(myCoords)) {
				Game.soulClicked();
			}
		}, false);
		canvas.addEventListener('mousedown', function(e) {
			 var canvasCoords = lHtml("canvas"+Game.currentScreen).getBoundingClientRect();
				var myCoords = {
					x : mouse.x - canvasCoords.left,
					y : mouse.y - canvasCoords.top
				};
			if (Game.Areas[Game.currentScreen].soulCanvas.soul.col
					.collides(myCoords)) {
				Game.soulSize = 1.1;
			}
		}, false);
		canvas.addEventListener('mouseup', function(e) {
			 var canvasCoords = lHtml("canvas"+Game.currentScreen).getBoundingClientRect();
				var myCoords = {
					x : mouse.x - canvasCoords.left,
					y : mouse.y - canvasCoords.top
				};
			if (Game.Areas[Game.currentScreen].soulCanvas.soul.col
					.collides(myCoords)) {
				Game.soulSize = 1;
			}
		}, false);
		canvas.addEventListener('mousemove', function(e) {
			 var canvasCoords = lHtml("canvas"+Game.currentScreen).getBoundingClientRect();
				var myCoords = {
					x : mouse.x - canvasCoords.left,
					y : mouse.y - canvasCoords.top
				};
			if (Game.Areas[Game.currentScreen].soulCanvas.soul.col
					.collides(myCoords)) {
				Game.soulSize = 1.2;
			}
			else {
				Game.soulSize = 1;
			}
		}, false);
		Game.Areas[i].soulCanvas.ctx = canvas.getContext("2d");
		Game.Areas[i].soulCanvas.w = canvas.width;
		Game.Areas[i].soulCanvas.h = canvas.height;
		Game.Areas[i].soulCanvas.soul = {};
		Game.Areas[i].soulCanvas.soul.img = new Image();
		Game.Areas[i].soulCanvas.soul.img.src = Game.PATH_ICONS
				+ Game.Souls[i].clickable;
		Game.Areas[i].soulCanvas.soul.col = new CircCollider(
				canvas.width / 2 - 90, canvas.height / 2 - 90, 90);
		Game.Areas[i].soulCanvas.particles = [];

		// Units SubArea
		Game.Areas[i].unitList = aux.childNodes[i].childNodes[2].lastChild.childNodes;
		for (j = 0; j < Game.Areas[i].unitList.length; j++) {
			tip = "<img class='mainIcon' src='"
					+ Game.PATH_ICONS + Game.Souls[i].units[j].icon + "'> <p>" + Game.Souls[i].units[j].name + "</p><p>"
					+ Game.Souls[i].units[j].desc + "</p>";
			Game.Areas[i].unitList[j].addEventListener("mouseover", ToolTip.get(tip));
			Game.Areas[i].unitList[j].addEventListener("mouseout", function() {
				ToolTip.hide();
			});
			console.log(i + "/" + j + ":" + Game.Souls[i].units[j].name+ ":" +tip);
		}
	}
	console.log(Game.Areas);

	str = "";
	for (i = 0; i < Game.Souls.length; i++) {
		str += "<div class='souls'><img src='" + Game.PATH_ICONS
				+ Game.Souls[i].icon + "'><p>SOULS:</p><p>"
				+ formatNumber(Game.Souls[i].quantity) + "</p></div>";
	}
	aux = lHtml("leftInf");
	aux.innerHTML = str;
	for ( var i = 0; i < aux.childNodes.length; i++) {
		Game.Souls[i].info = aux.childNodes[i];
		Game.Souls[i].counter = aux.childNodes[i].lastChild;
	}
	console.log(Game.Souls);

	Game.getGameArea(0);
	Game.unlockSoul(0);
	Game.Souls[0].units[0].unlock();
	Game.lastFrameDate = new Date();
};

Game.update = function() {
	var i, j;

	// Update Timers
	Game.drawT++;
	Game.saveT++;

	// Active Gain
	for (i = 0; i < Game.Souls.length; i++) {
		Game.Souls[i].quantity += Game.Souls[i].clickedN;
		Game.Souls[i].clickedN = 0;
	}

	// Passive Gain
	for (i = 0; i < Game.Souls.length; i++) {
		for (j = 0; j < Game.Souls[i].units.length; j++) {
			Game.Souls[i].quantity += Game.Souls[i].units[j].getGen()
					/ Game.FPS;
		}
	}

	// Unit Buys
	if (Game.unitBuy) {
		for (i = 0; i < Game.Souls[Game.currentScreen].units.length; i++) {
			while (Game.Souls[Game.currentScreen].units[i].clickedN > 0) {
				if (!Game.buyUnit(i)) {
					Game.Souls[Game.currentScreen].units[i].clickedN = 0;
					break;
				}
				Game.Souls[Game.currentScreen].units[i].clickedN--;
			}
		}
		Game.unitBuy = false;
	}

	// Soul Unlocks
	if (Game.Souls[1].locked && Game.Souls[0].quantity > 100) {
		Game.unlockSoul(1);
	}
	if (Game.Souls[2].locked && Game.Souls[1].quantity > 100) {
		Game.unlockSoul(2);
	}
	if (Game.Souls[3].locked && Game.Souls[2].quantity > 100) {
		Game.unlockSoul(3);
	}
	if (Game.Souls[4].locked && Game.Souls[3].quantity > 100) {
		Game.unlockSoul(4);
	}
	
	// Unit Unlocks

	// Save
	if (Game.saveT % (60 * Game.FPS) == 0 || Game.saveF) {
		Game.save();
		Game.saveF = false;
	}
};

Game.draw = function() {
	Game.drawSoulCanvas();
	for ( var i = 0; i < Game.Souls.length; i++) {
		Game.Souls[i].counter.innerHTML = formatNumber(Game.Souls[i].quantity);
		Game.Areas[i].counter.innerHTML = formatNumber(Game.Souls[i].quantity);
	}
	// REDRAW UNITS
	if (Game.drawT % (1) == 0) {
		for ( var i = 0; i < Game.Souls[Game.currentScreen].units.length; i++) {
			Game.Areas[Game.currentScreen].unitList[i].firstChild.innerHTML = formatNumber(Game.Souls[Game.currentScreen].units[i].quantity);
			var canBuy = "canBuy";
			var cost = Game.Souls[Game.currentScreen].units[i].getCost();
			var str = "";
			for (c in cost) {
				str += "<img src='"
						+ Game.PATH_ICONS
						+ Game.SoulsByN[c].icon
						+ "'><p class='"
						+ ((cost[c] <= Game.SoulsByN[c].quantity) ? "canBuy"
								: "cantBuy") + "'>" + formatNumber(cost[c])
						+ "</p>";
				if (cost[c] > Game.SoulsByN[c].quantity)
					canBuy = "cantBuy";
			}
			Game.Areas[Game.currentScreen].unitList[i].setAttribute("class",
					"unit " + canBuy);
			Game.Areas[Game.currentScreen].unitList[i].lastChild.innerHTML = str;
		}
		Game.unitBought = false;
	}
	if (Game.tabUnlocked) {
		for (i = 0; i < Game.Souls.length; i++) {
			if (!Game.Souls[i].locked)
				Game.Tabs[i].lastChild.setAttribute("class", "lockInactive");
		}
		Game.tabUnlocked = false;
	}
	ToolTip.update();
	if (Game.goToArea != Game.currentScreen)
		Game.getGameArea(Game.goToArea);
};

Game.save = function() {
	var str = "", i, j;
	if (!supportsLocalStorage())
		return;
	for (i = 0; i < Game.Souls.length; i++) {
		str += Game.Souls[i].quantity + ':';
		for (j = 0; j < Game.Souls[i].units.length; j++) {
			str += Game.Souls[i].units[j].quantity + ':';
		}
		str += ',';
	}
	str += '|';
	localStorage[Game.PATH_SAVE + Game.saveSlot] = str;
	console.log("Game saved");
};

Game.load = function() {
	var str = "", souls, innerSoul, i, j;
	if (!supportsLocalStorage())
		return;
	str = localStorage[Game.PATH_SAVE + Game.saveSlot];
	if (!str)
		return;
	str = str.split('|');
	souls = str[0].split(',');
	for (i = 0; i < souls.length; i++) {
		innerSoul = souls[i].split(':');
		if (innerSoul[0])
			Game.Souls[i].quantity = parseInt(innerSoul[0]);
		for (j = 1; j < innerSoul.length; j++) {
			console.log(i + ":" + j);
			if (innerSoul[j])
				Game.Souls[i].units[j - 1].quantity = parseInt(innerSoul[j]);
		}
	}
	console.log("Game loaded");
};

Game.deleteSave = function() {
	if (!supportsLocalStorage())
		return;
	localStorage.clear();
	location.reload(true);
};

Game.loop = function() {
	var thisFrame = new Date();
	Game.update();
	Game.draw();
	// console.log(thisFrame.getTime() - Game.lastFrameDate.getTime());
	Game.lastFrameDate = thisFrame;
	setTimeout(function() {
		Game.loop();
	}, 1000 / Game.FPS);
};

Game.launch = function() {
	Game.init();
	Game.load();
	Game.draw();
	Game.loop();
};