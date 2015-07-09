/**
 * @type SoulParticle
 * @param x
 * @param y
 * @param color
 * @returns {SoulParticle}
 */
var SoulParticle = function(x, y, color) {
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