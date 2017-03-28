import paper from "paper";
import DelaunayTriangulate from "delaunay-triangulate";

/* ------------------------------

	Floating Delaunay Polygons

	animation loop of floating polygons
	made of delaunay triangles

---------------------------------- */

class FloatingDelaunayPolygons{

	//--------------------------------- declareConstants
	declareConstants(){
		this.POLYGON_POOL_SIZE 			= 50;
		this.NUM_RANDOM_PTS 			= 12;
		this.MIN_MOUSE_DELTA 			= 10;
		this.POLYGON_X_DELTA 			= 100;
		this.CREATE_POLYGON_DELAY 		= 300;
		this.DEFAULT_SIZE 				= 250;
		this.DEFAULT_COLORS  			= ['#000000', '#dddddd', '#888888'];
	}

	//--------------------------------- initVars
	initVars(){
		// the index of the current image
		// (so that we can add multiple images
		// and swap them out on some user input
		// if desired in the future)
		this.cur_image_ind 				= -1;
		// the pool that holds the polygons
		this.polygon_pool 				= [];
		this.animating_polygons 		= [];
	}

	// params can be an array of strings or 
	// a string representing the images or the image
	//--------------------------------- constructor
	constructor(stage_element, colors, size){
		this.declareConstants();
		
		// if no colors ---> use black & grays as default
		this.colors = colors || this.DEFAULT_COLORS;

		this.size = size || this.DEFAULT_SIZE;

		this.initVars();

		this.stage_element = stage_element;
		if(this.stage_element) paper.setup(this.stage_element);

		this.onResize();

		paper.view.onResize = this.onResize.bind(this);
	}

	//--------------------------------- start 
	start(){
		paper.view.onFrame = this.onFrame.bind(this);	
	}

	//--------------------------------- loadBgImage 
	loadBgImage(images, onLoaded){
		// if string convert to array
		if(typeof images === 'string') images = [images];
		this.images = images || [];

		this.onLoaded = onLoaded;
		// begin to load the image(s)
		this.loadNextImage();
	}

	//--------------------------------- loadNextImage
	loadNextImage(){
		this.cur_image_ind++;
		if(this.cur_image_ind >= this.images.length) this.cur_image_ind = 0;
		this.loadImageByIndex(this.cur_image_ind);
	}

	//--------------------------------- loadImageByIndex
	loadImageByIndex(ind){
		this.raster = new paper.Raster(this.images[ind]);
		this.raster.on("load", this.onImageLoaded.bind(this));
	}

	//--------------------------------- onImageLoaded
	onImageLoaded(){
		if(this.onLoad) this.onLoad();
		this.onResize();
	}

	//--------------------------------- onResize
	onResize(event){
		if(this.raster) this.raster.fitBounds(paper.view.bounds, true);

		if( typeof this.size == "string" && this.size.indexOf("%") > -1 ) 
			this.size_in_px = (parseInt( this.size.replace("%", "") )/100) * paper.view.bounds.width;

		else if( typeof this.size == "string" && this.size.indexOf("px") > -1 ) 
			this.size_in_px = parseInt(this.size);

		else if( typeof this.size == "number" ) 
			this.size_in_px = this.size;
		
		else 
			this.size_in_px = this.DEFAULT_SIZE;
	}

	//--------------------------------- onFrame
	onFrame(event){
		var time = new Date().getTime();

		if( !this.last_generate_polygon_time ||
			(time - this.last_generate_polygon_time) >= this.CREATE_POLYGON_DELAY ) {
			this.generatePolygon();
			this.last_generate_polygon_time = time;
		}
	
		this.animatePolygons();
	}

	//--------------------------------- generatePolygon
	generatePolygon(){
		var polygon;

		// if available,
		// grab the  polygon from the 
		// polygon pool
		if(this.polygon_pool.length > 0) {
			polygon = this.polygon_pool.pop();
		}
		// otherwise create a new one
		else polygon = this.createPolygon();

		//detremine start & end pts
		var end_pt = {
			x: polygon.bounds.x + (-this.POLYGON_X_DELTA + Math.round(Math.random()*this.POLYGON_X_DELTA*2)),
			y: -this.size_in_px - Math.round(Math.random()*this.size_in_px/2)
		};
		var start_pt = {
			x: polygon.bounds.x, 
			y: polygon.bounds.y
		};

		var end_rotation = -180 + Math.round(Math.random()*360);

		// each polygon will have a duration,
		// a starting pt, and an end pt
		this.animating_polygons.push({
			polygon: polygon,
			duration: 10000 + Math.round(Math.random()*3000),
			start_pt: {
				x: start_pt.x, 
				y: start_pt.y
			},
			total_delta: {
				x: end_pt.x - start_pt.x,
				y: end_pt.y - start_pt.y,
				rot: end_rotation
			},
			start_time: new Date().getTime()
		});
	}

	//--------------------------------- createPolygon
	createPolygon(){
		//create polygon at psuedorandom 
		//point below the fold 
		var x = Math.round(Math.random()*paper.view.bounds.width);
		var y = paper.view.bounds.height + (this.size_in_px + Math.random()*this.size_in_px);  
		
		return this.createPolygonAroundPoint(x, y);
	}

	//--------------------------------- createPolygonAroundPoint
	createPolygonAroundPoint(x, y){
		var pts = this.getRandomPointsAroundPoint(x, y);

		return this.generatePolygonByTrianglePoints(pts);
	}

	//--------------------------------- getRandomPointsAroundPoint
	getRandomPointsAroundPoint(x, y){
		// get the mouse pos
		// from the mouseEvent
		var pt_x, pt_y;
		var pts = [];

		var size = this.size_in_px;
		var rand = Math.random();
		//create a few smaller ones
		if(rand < 0.3) size = 80 + Math.random()*(this.size_in_px-80);

		// now generate random points
		// within the MOUSE_POINT_RADIUS
		for(var i=0; i<this.NUM_RANDOM_PTS; i++){

			//create random x and y points
			// pt_x = Math.round
			pt_x = (x-size) + 
					Math.round(Math.random()*(size));
			pt_y = (y-size) + 
					Math.round(Math.random()*(size));

			pts.push([pt_x, pt_y]);
		}
		return pts;
	}

	//--------------------------------- generatePolygonByTrianglePoints
	generatePolygonByTrianglePoints(pts){
		// create the delaunay triangles
		// around based on the pts
		var triangles = DelaunayTriangulate(pts);

		// then will call createTriangleGroups
		return this.createTriangleGroups(pts, triangles);
	}

	//--------------------------------- createTriangleGroups
	createTriangleGroups(pts, triangles){
		//create the actual triangle paths
		var triangles_paths = this.createTrianglePaths(pts, triangles);

		//now we want to group the trainagles
		//b/c we will be animating the group
		var group = new paper.Group(triangles_paths);

		return group;
	}

	//--------------------------------- createTrianglePaths
	createTrianglePaths(pts, triangles){
		var triangle_paths = [];
		var trianglePath;
		var color = this.colors[Math.floor(Math.random()*this.colors.length)]; 

		// triangles are the indices 
		// of your pts - so draw the path
		// of each triangle by adding its
		// points to a Path
		for(var i=0;i<triangles.length;i++){
			//random color from list of colors
			var path = new paper.Path();
			path.add(new paper.Point(pts[triangles[i][0]][0], pts[triangles[i][0]][1]));
			path.add(new paper.Point(pts[triangles[i][1]][0], pts[triangles[i][1]][1]));
			path.add(new paper.Point(pts[triangles[i][2]][0], pts[triangles[i][2]][1]));
			path.closed = true;
			path.strokeColor = color;
			path.fillColor = color;
			path.opacity = 0.3 + Math.random()*0.4;
			triangle_paths.push(path);
		}

		return triangle_paths;
	}

	//--------------------------------- animatePolygons
	animatePolygons(){
		var polygon_info, time,
			delta_x, delta_y,
			to_x, to_y, to_rot;
		var cur_time = new Date().getTime();

		//traverse the animating_polygons
		//translate each as per time & its parameters
		for(var i=0;i<this.animating_polygons.length;i++){
			//we need to find new position values

			polygon_info = this.animating_polygons[i];
			// determine time (t) from cur_time - start_time 
			time = cur_time - polygon_info.start_time;

			to_x = this.easeOutExpo(
				time, 
				polygon_info.start_pt.x,
				polygon_info.total_delta.x,
				polygon_info.duration
			);

			to_y = this.easeOutExpo(
				time, 
				polygon_info.start_pt.y,
				polygon_info.total_delta.y,
				polygon_info.duration
			);

			// can attempt translate to see 
			// if less expensive
			// set current values for x & y
			polygon_info.polygon.position = new paper.Point(to_x,to_y);
			polygon_info.polygon.rotate(1);			

			// if this polygon has finshed its
			// animation remove it from the array
			// reset it and add it to the polygon_pool
			if(time > polygon_info.duration) {
				//reomve from the animating array
				this.animating_polygons.splice(i,1);
				this.resetPolygon(polygon_info);
			}
		}
	}

	//--------------------------------- easeOutExpo
	easeOutExpo (t, b, c, d) {
		// c is the change in value (total delta)
		// t is the current time
		// d is the duration
		// and b is the starting pt
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	}

	//--------------------------------- resetPolygon
    resetPolygon(polygon_info){
    	//move back down under the fold
    	var polygon = polygon_info.polygon;
    	var x = Math.round(Math.random()*paper.view.bounds.width);
		var y = paper.view.bounds.height + (this.size_in_px + Math.random()*this.size_in_px); 

    	polygon.position = new paper.Point(x, y);

    	//push into the polygon_pool
    	this.polygon_pool.push(polygon);
    }

	//--------------------------------- reset
    reset(){
        var self = this;
        if(this.raster) this.raster.onLoad = null;
        paper.project.activeLayer.removeChildren();

        this.initVars();
        this.loadNextImage();
    }
    //--------------------------------- clear
    clear(){
    	this.reset();
    }

}

export default FloatingDelaunayPolygons;

