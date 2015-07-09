ToolTip = {};

ToolTip.html = lHtml("toolTip");

ToolTip.content = '';

ToolTip.active = false;

ToolTip.draw = function(content) {
	this.html.style.left = 'auto';
	this.html.style.top = 'auto';
	this.html.style.right = 'auto';
	this.html.style.bottom = 'auto';
	this.html.style.display = "block";

	this.content = content;
	this.active = true;
	
	this.html.style.opacity = 0;
	this.html.innerHTML = (typeof content == "function") ? content() : content;
	//console.log("drew!");
};

ToolTip.update = function() {
	if (!this.active)
		return;
	this.html.style.left = (mouse.x - 320) + "px";
	this.html.style.top = (mouse.y - 10) + "px";
	this.html.style.opacity = 1;

	if (typeof this.content == "function")
		this.content();
};

ToolTip.hide = function() {
	this.html.style.display = "none";
	this.active = false;
	//console.log("hid!");
};

ToolTip.get = function(content) {
	//return " onmouseover = 'function(){ToolTip.draw("+content+");}' onmouseout = 'function(){ToolTip.hide();}' ";
	return function(){ToolTip.draw(content);};
};