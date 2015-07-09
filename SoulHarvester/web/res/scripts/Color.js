var Color = function(r, g, b, light) {
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