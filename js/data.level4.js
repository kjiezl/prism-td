'use strict';

require("levels", function(res) {
    const placementTilesData = 
    [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 9, 9, 0, 9, 9, 9, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 0, 0,
        0, 0, 0, 0, 9, 0, 9, 9, 9, 0, 9, 0, 0,
        0, 0, 0, 0, 9, 0, 0, 0, 9, 0, 0, 0, 0,
        0, 0, 9, 0, 9, 9, 9, 0, 9, 0, 0, 0, 0,
        0, 0, 9, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 9, 9, 9, 0, 9, 9, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    const waypoints1 = [
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
        }
    ];
        const waypoints2 = [
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
           }
        ];
    window.levels[3].mapSize = [2496, 2112];
    window.levels[3].tileSize = [13, 11];
    window.levels[3].placementTilesData = placementTilesData;
    window.levels[3].waypoints1 = waypoints1;
    window.levels[3].waypoints2 = waypoints2;
    window.levelLoaded = true;
    
    window.levels[3].enemyCheck = function(position) {
        if(position.x <= waypoints1[waypoints1.length-1].x + 20) {
            return true;
        } else {
            return false;
        }
    };
    window.levels[3].enemyCheck2 = function(position) {
        if(position.x >= waypoints2[waypoints2.length-1].x - 150) {
            return true;
        } else {
            return false;
        }
    };
    
});