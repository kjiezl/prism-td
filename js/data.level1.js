'use strict';

require("levels", function(res) {
    const placementTilesData = 
    [
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 9, 9, 0, 9, 9, 0, 9, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    const waypoints = [
         {
          "x":307.085735540264,
          "y":287.446531523154
         }, 
         {
          "x":862.339594569463,
          "y":291.017295889901
         }, 
         {
          "x":867.695741119583,
          "y":673.089083131858
         }, 
         {
          "x":1440.80342198252,
          "y":673.089083131858
         }, 
         {
          "x":1437.23265761577,
          "y":287.446531523154
         }, 
         {
          "x":1635.41007997024,
          "y":289.231913706528
         }
    ];
    window.levels[0].tileSize = [10, 5];
    window.levels[0].placementTilesData = placementTilesData;
    window.levels[0].waypoints = waypoints;
    window.levelLoaded = true;
    
    window.levels[0].enemyCheck = function(position) {
        return position.x > canvas.width - 400 ? true : false;
    };
    
});