(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("endless-map-obj",
{ "compressionlevel":-1,
 "height":11,
 "infinite":false,
 "layers":[
        {
         "data":[3, 3, 4, 3, 3, 3, 4, 3, 4, 4, 3, 3, 3,
            3, 4, 4, 3, 3, 4, 4, 1, 1, 1, 1, 1, 3,
            3, 4, 3, 4, 4, 4, 4, 1, 3, 3, 3, 1, 3,
            3, 4, 4, 1, 1, 1, 1, 1, 3, 1, 3, 1, 3,
            4, 4, 4, 1, 4, 4, 4, 4, 4, 1, 3, 1, 4,
            4, 1, 4, 1, 4, 1, 1, 1, 4, 1, 4, 1, 4,
            4, 1, 3, 1, 4, 4, 4, 4, 4, 1, 4, 4, 3,
            3, 1, 3, 1, 3, 1, 1, 1, 1, 1, 4, 4, 3,
            3, 1, 3, 3, 3, 1, 4, 4, 4, 4, 4, 3, 3,
            3, 1, 1, 1, 1, 1, 4, 4, 4, 3, 3, 3, 3,
            3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3],
         "height":11,
         "id":1,
         "name":"ground",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 2147483662, 0, 0, 0, 2147483662, 0, 0, 2147483662, 0, 0, 0,
            0, 0, 2147483662, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2147483662, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 2147483662, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 2147483662, 0, 0, 0, 0, 0, 0],
         "height":11,
         "id":9,
         "name":"shadows2",
         "opacity":0.4,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[2147483654, 0, 0, 0, 0, 1073741833, 3221225481, 0, 0, 2147483655, 7, 0, 6,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2147483656, 0, 0, 0, 0, 0, 0, 0, 3221225481, 0, 0, 0, 0,
            2147483656, 0, 0, 0, 3221225479, 1073741831, 0, 0, 0, 0, 0, 0, 8,
            3221225480, 0, 1610612743, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9,
            0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1073741833,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 3221225481, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2147483654,
            1073741831, 0, 0, 0, 2684354569, 0, 0, 0, 3221225479, 1073741831, 0, 0, 3221225478],
         "height":11,
         "id":3,
         "name":"design1",
         "opacity":0.7,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 12, 0, 0, 0, 0, 0, 13, 12, 13, 13, 12, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            13, 0, 0, 13, 0, 0, 12, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 13, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0,
            12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13,
            0, 0, 0, 0, 0, 0, 0, 0, 13, 12, 0, 0, 13,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 12, 13, 0, 0, 0, 0, 0, 0, 0, 13, 0],
         "height":11,
         "id":5,
         "name":"design2",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11,
            11, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 11,
            0, 0, 0, 0, 10, 11, 0, 0, 0, 0, 0, 0, 10,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10,
            10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            11, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11,
            0, 0, 0, 11, 0, 0, 0, 0, 0, 11, 0, 0, 10],
         "height":11,
         "id":4,
         "name":"design3",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2147483662, 0,
            0, 0, 0, 0, 0, 0, 0, 2147483662, 0, 0, 0, 2147483662, 0,
            0, 0, 0, 0, 0, 0, 0, 2147483662, 0, 2147483662, 0, 2147483662, 0,
            0, 0, 0, 2147483662, 0, 0, 0, 0, 0, 2147483662, 0, 2147483662, 0,
            0, 2147483662, 0, 2147483662, 0, 0, 0, 2147483662, 0, 2147483662, 0, 2147483662, 0,
            0, 2147483662, 0, 2147483662, 0, 0, 0, 0, 0, 2147483662, 0, 0, 0,
            0, 2147483662, 0, 2147483662, 0, 0, 0, 0, 0, 2147483662, 0, 0, 0,
            0, 2147483662, 0, 0, 0, 2147483662, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 2147483662, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "id":6,
         "name":"shadows",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 15, 0, 0, 0, 15, 0, 15, 15, 15, 15, 15, 0,
            0, 0, 0, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 15, 15, 15, 15, 0, 0, 15, 0, 0, 0,
            15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 15, 0, 0, 0, 15, 15, 15, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 15, 15, 15, 15, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "id":7,
         "name":"highlights1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 15, 15, 15, 15, 0, 0, 15, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 15, 0, 0, 0, 15, 15, 15, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 15, 15, 15, 15, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "id":8,
         "name":"highlights2",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 5, 5, 0, 5, 5, 5, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 0, 0,
            0, 0, 0, 0, 5, 0, 5, 5, 5, 0, 5, 0, 0,
            0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0,
            0, 0, 5, 0, 5, 5, 5, 0, 5, 0, 0, 0, 0,
            0, 0, 5, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 5, 5, 5, 0, 5, 5, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "id":2,
         "name":"slots",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "id":10,
         "name":"base",
         "opacity":1,
         "type":"tilelayer",
         "visible":false,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":11,
         "name":"waypoints1",
         "objects":[
                {
                 "height":0,
                 "id":3,
                 "name":"",
                 "polyline":[
                        {
                         "x":0,
                         "y":0
                        }, 
                        {
                         "x":668,
                         "y":1436
                        }, 
                        {
                         "x":672,
                         "y":674
                        }, 
                        {
                         "x":1440,
                         "y":670
                        }, 
                        {
                         "x":1440,
                         "y":282
                        }, 
                        {
                         "x":2214,
                         "y":285
                        }, 
                        {
                         "x":2215,
                         "y":1073
                        }, 
                        {
                         "x":1433,
                         "y":1057
                        }, 
                        {
                         "x":1259,
                         "y":1059
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":0,
                 "x":0,
                 "y":0
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":12,
         "name":"waypoints2",
         "objects":[
                {
                 "height":0,
                 "id":4,
                 "name":"",
                 "polyline":[
                        {
                         "x":0,
                         "y":0
                        }, 
                        {
                         "x":1824,
                         "y":657
                        }, 
                        {
                         "x":1819,
                         "y":1434
                        }, 
                        {
                         "x":1057,
                         "y":1440
                        }, 
                        {
                         "x":1057,
                         "y":1816
                        }, 
                        {
                         "x":292,
                         "y":1819
                        }, 
                        {
                         "x":289,
                         "y":1045
                        }, 
                        {
                         "x":1055,
                         "y":1044
                        }, 
                        {
                         "x":1260,
                         "y":1045
                        }],
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":0,
                 "x":0,
                 "y":0
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":false,
         "x":0,
         "y":0
        }],
 "nextlayerid":13,
 "nextobjectid":5,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.10.2",
 "tileheight":192,
 "tilesets":[
        {
         "firstgid":1,
         "source":"..\/..\/tiled\/Untitled259_20240504203328.tsx"
        }, 
        {
         "firstgid":2,
         "source":"..\/..\/tiled\/Untitled259_20240504203317.tsx"
        }, 
        {
         "firstgid":3,
         "source":"..\/..\/tiled\/Untitled259_20240504203319.tsx"
        }, 
        {
         "firstgid":4,
         "source":"..\/..\/tiled\/Untitled259_20240504203324.tsx"
        }, 
        {
         "firstgid":5,
         "source":"..\/..\/tiled\/Untitled257_20240501175202.tsx"
        }, 
        {
         "firstgid":6,
         "source":"..\/..\/tiled\/Untitled259_20240504203515.tsx"
        }, 
        {
         "firstgid":7,
         "source":"..\/..\/tiled\/Untitled259_20240504203519.tsx"
        }, 
        {
         "firstgid":8,
         "source":"..\/..\/tiled\/Untitled259_20240504203521.tsx"
        }, 
        {
         "firstgid":9,
         "source":"..\/..\/tiled\/Untitled259_20240504203524.tsx"
        }, 
        {
         "firstgid":10,
         "source":"..\/..\/tiled\/Untitled259_20240504203528.tsx"
        }, 
        {
         "firstgid":11,
         "source":"..\/..\/tiled\/Untitled259_20240504203531.tsx"
        }, 
        {
         "firstgid":12,
         "source":"..\/..\/tiled\/Untitled259_20240504203534.tsx"
        }, 
        {
         "firstgid":13,
         "source":"..\/..\/tiled\/Untitled259_20240504203537.tsx"
        },
    
        {
         "firstgid":14,
         "source":"..\/..\/tiled\/Untitled225_20240224145742.tsx"
        }, 
        {
         "firstgid":15,
         "source":"..\/..\/tiled\/Untitled225_20240224145739.tsx"
        }, 
        {
         "firstgid":16,
         "source":"..\/..\/tiled\/Untitled259_20240504203413.tsx"
        }, 
        {
         "firstgid":17,
         "source":"..\/..\/tiled\/base.tsx"
        }],
 "tilewidth":192,
 "type":"map",
 "version":"1.10",
 "width":13
});