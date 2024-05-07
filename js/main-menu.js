"use strict";

let mainMusic = new Audio('bgm/main-menu.mp3');
mainMusic.loop = true;
let buttonSound = new Audio('sfx/button-click.mp3');

$(function() {
    setInterval((window) => {
        let winW = window.innerWidth;
        let winH = window.innerHeight;
        
        if(winW < winH) {
            try {
                screen.orientation.lock('landscape');
            } catch(e) { };
            alert("Please rotate to landscape mode");
        }
    }, 100, window);

    setTimeout(() => {
        $(".loaderContainer").fadeOut(500);
    }, 2000)
    
    $('.menu-toggle-btn').click(function () {
      $('.menu-toggle-btn').toggleClass("effect");
      $('.menu-list').toggleClass("effect");
    });

    $("#info-button").click(() =>{
        $(".info-container, .info-bg").toggleClass("active");    
        return false;
    })

    $(".info-close").click(() => {
        $(".info-container, .info-bg").toggleClass("active");    
    })

    $("#settings-button").click(() => {alert("settings menu coming soon")});
    $("#feedback-button").click(() => {alert("feedback button coming soon")});

    $("button, svg, .menu-item, .menu-toggle-btn").click(() => {buttonSound.play()})

    let playingMusic = false;
      $(".musicToggle").click(() => {
        if(!playingMusic){
            mainMusic.play();
            mainMusic.volume = 0.3;
            playingMusic = true;
        } else{
            mainMusic.pause();
            playingMusic = false;
        }
        $("#musicPause").toggle();
        $("#musicButton").toggle();
    });

});