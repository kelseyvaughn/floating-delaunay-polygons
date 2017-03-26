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
    var colors = ['#cc79ad', '#b7e4fb', '#d3fbea', '#e7a789'];

    // optional size (in pixels - default is 250 px)
    var size = 250;

    var floatingDelaunayPolygons = new FloatingDelaunayPolygons(canvas, colors, size);

**Add an Optional Background Image**

>

    var src = "/assets/my-image.jpg";

    // optional callback for loaded event
    var onLoadedCallback = function(){ doSomething(); };

    floatingDelaunayPolygons.loadBgImage(src, onLoadedCallback);

