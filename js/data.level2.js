'use strict';

require("levels", function(res) {
    const placementTilesData = 
    [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 9, 9, 9, 0, 0, 0, 9, 0, 0,
        0, 0, 0, 0, 9, 0, 9, 0, 0, 9, 9, 0, 0,
        0, 0, 0, 0, 9, 0, 0, 0, 9, 0, 0, 0, 0,
        0, 0, 9, 9, 0, 0, 9, 0, 9, 0, 0, 0, 0,
        0, 0, 9, 0, 0, 0, 9, 9, 9, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    const waypoints = [
        {
         "x":665.333333333333,
         "y":1436
        }, 
        {
         "x":290.666666666667,
         "y":1437.33333333333
        }, 
        {
         "x":297.333333333333,
         "y":864
        }, 
        {
         "x":666.666666666667,
         "y":866.666666666667
        }, 
        {
         "x":665.333333333333,
         "y":289.333333333333
        }, 
        {
         "x":1430.66666666667,
         "y":288
        }, 
        {
         "x":1437.33333333333,
         "y":853.333333333333
        }, 
        {
         "x":1060,
         "y":861.333333333333
        }, 
        {
         "x":1065.33333333333,
         "y":1428
        }, 
        {
         "x":1825.33333333333,
         "y":1421.33333333333
        }, 
        {
         "x":1826.66666666667,
         "y":861.333333333333
        }, 
        {
         "x":2202.66666666667,
         "y":858.666666666667
        },
        {
         "x":2196,
         "y":292
        }, 
        {
         "x":1769.33333333333,
         "y":293.333333333333
        }
    ];
    window.levels[1].mapSize = [2496, 1728];
    window.levels[1].tileSize = [13, 9];
    window.levels[1].placementTilesData = placementTilesData;
    window.levels[1].waypoints = waypoints;
    window.levelLoaded = true;
    
    // will only be checked if on final waypoint
    window.levels[1].enemyCheck = function(position) {
        if(position.x <= waypoints[waypoints.length-1].x + 50) {
            return true;
        } else {
            return false;
        }
    };
    
});