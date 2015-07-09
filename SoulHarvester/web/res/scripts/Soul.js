var Soul = function(name, desc, icon, clickable, pColor) {
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