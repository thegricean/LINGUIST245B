var preload = function(resources, options /* afterEach, after, width */) {
	var resources = resources.slice(),
			finished = false,
			numLoaded = 0;
	
	if (!options) options = {};
	
	var afterEach = options.afterEach || function() {},
			after = options.after || function() {},
			width = options.width || 6;
	
	var loadNext = function() {
		var filename = resources.shift();
		if (!filename)  {
			if (!finished) {
				finished = true;
				after();
			}
			return;
		}
		var imageExp = /.jpg|.jpeg|.gif|.png|.bmp|.tif|.tiff/,
				audioExp = /.mp3/,
				obj, embedTag;
		
		if (filename.match(imageExp)) {
			obj = new Image();
		} else {
			embedTag = true;
			obj = document.createElement('iframe');
		}
		
		obj.onload = function() {
//			document.body.removeChild(this);
			afterEach(filename);
			loadNext();
		}
		
		obj.onerror = function(e) {
			$z.log("error");
		}
		
		if (embedTag) {
			obj.style.width = "0px";
			obj.style.height = "0px";
			obj.style.border = "0";
			obj.style.margin = "0";
			obj.style.padding = "0";
			obj.src = filename;
			
			document.body.appendChild(obj);

		} else {
			obj.src = filename;
		}
	}
	
	var times = Math.min(width, resources.length);
	while(times--) {
		loadNext();
	}
};