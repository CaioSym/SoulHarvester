var Unit = function(name, desc, icon, cost, gen) {
	this.name = name;
	this.desc = desc;
	this.icon = icon;
	this.cost = cost;
	this.gen = gen;
	
	this.quantity = 0;
	this.clickedN = 0;
	this.locked = true;
	
	this.units = [];
	
	this.unlock = function() {
		this.locked = false;
	};
	
	this.buy = function() {
		this.quantity++;
	};
	
	this.getGen = function() {
		return this.gen*this.quantity;
	};
	
	this.getCost = function() {
		var cost = {};
		for(c in this.cost)
			cost[c] = this.cost[c] * Math.pow(1.2, this.quantity);
		return cost;
	};
};