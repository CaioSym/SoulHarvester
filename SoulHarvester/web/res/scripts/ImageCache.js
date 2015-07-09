var ImageCache = {};

ImageCache.imgs = [];

ImageCache.preload = function(imgSrcs) {
	if(typeof imgSrcs == 'array') {
		for (var i = 0; i < imgSrcs.length; i++) {
		//	if(ImageCache.imgs[imgSrcs[i]] != undefined) 
			ImageCache.imgs[imgSrcs[i]] = new Image();
			ImageCache.imgs[imgSrcs[i]].src = imgSrcs[i];
		}
	}
	else {
		ImageCache.imgs[imgSrcs] = new Image();
		ImageCache.imgs[imgSrcs].src = imgSrcs;
	}
};