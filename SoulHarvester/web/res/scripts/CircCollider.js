var CircCollider = function(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.center = {x: x+r, y: y+r};

	this.collides = function(pos) {
		var isCollision = false;
		if (Math.sqrt(Math.pow(pos.x - this.center.x, 2) + Math.pow(pos.y - this.center.y , 2)) <= this.r){
			isCollision = true;
		}
		return isCollision;
	};
};