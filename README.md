# Floating Delaunay Polygons

----
> Floating Polygon Animation.

**Install**

>

    npm install floating-delaunay-polygons

**Usage**

>

    import FloatingDelaunayPolygons from 'floating-delaunay-polygons';

    // canvas element required
    var canvas = document.getElementById("my_canvas");

    // optional colors (defaults to balack and gray)
    var colors = ['#000000', '#dddddd', '#888888'];

    // optional size of polygons (can be int or string such as '250px' or '20%')
    var size = 250;

    var floatingDelaunayPolygons = new FloatingDelaunayPolygons(canvas, colors, size);


**Start the Animation**

>

    //start the animation
    floatingDelaunayPolygons.start();


**Add an Optional Background Image**

>

    var src = "/assets/my-image.jpg";

    // optional callback for loaded event
    var onLoadedCallback = function(){ doSomething(); };

    floatingDelaunayPolygons.loadBgImage(src, onLoadedCallback);


**Clear All**

>

    floatingDelaunayPolygons.clear();


