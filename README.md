#Delaunay Brush

----
>Paints delaunay traingles on mouse move.

**Install**

>

    npm install delaunay-brush

**Usage**

>

    // canvas element required
    var canvas = document.getElementById("my_canvas");

    // optional stroke color
    var stroke_color = "#d16a99";

    // optional stroke thickness (in pixels)
    var stroke_thickness = 250;

    var delaunayBrush = new DelaunayBrush(canvas, stroke_color, stroke_thickness);

**Add an Optional Background Image**

>

    var src = "/assets/my-image.jpg";

    // optional callback for loaded event
    var onLoadedCallback = function(){ doSomething(); };

    delaunayBrush.loadBgImage(src, onLoadedCallback);

