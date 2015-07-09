var RectCollider = function(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.collides = function(pos) {
		var isCollision = false;
		if ((this.x) <= pos.x && (this.x + this.w) >= pos.x
				&& (this.y) <= pos.y && (this.y + this.h) >= pos.y) {
			isCollision = true;
		}
		return isCollision;
	};
};