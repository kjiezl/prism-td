"use strict";

// const socket = io("ws://localhost:3001");

let mainMusic = new Audio('bgm/main-menu.mp3');
mainMusic.loop = true;
let buttonSound = new Audio('sfx/button-click.mp3');

let username = "player";

/*
socket.emit("get-scores", username);
socket.on("send-scores", scores => {
    if (scores && scores.hasOwnProperty("1")) {
        $("#level1Score").text(scores["1"]);
    } else {
        $("#level1Score").text("0");
        $("#score1").css("opacity", 0);
    }
    if (scores && scores.hasOwnProperty("2")) {
        $("#level2Score").text(scores["2"]);
    } else {
        $("#score2").css("opacity", 0);
        $("#level2Score").text("0");
    }
    if (scores && scores.hasOwnProperty("3")) {
        $("#level3Score").text(scores["3"]);
    } else {
        $("#score3").css("opacity", 0);
        $("#level3Score").text("0");
    }
    if (scores && scores.hasOwnProperty("4")) {
        $("#level4Score").text(scores["4"]);
    } else {
        $("#score4").css("opacity", 0);
        $("#level4Score").text("0");
    }
});
*/

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

    $("#feedback-button").click(() =>{
        $(".feedback-container, .feedback-bg").toggleClass("active");    
        return false;
    })

    $(".feedback-close").click(() => {
        $(".feedback-container, .feedback-bg").toggleClass("active");    
    })

    $(".feedback-submit").click(() => {
        const feedback = $(".feedback-input").val();
        if (feedback.trim() !== "") {
            socket.emit("submit-feedback", feedback);
            $(".feedback-input").val("");
            $(".feedback-submit").toggleClass("is_active");
            setTimeout(() => {
                $(".feedback-submit").toggleClass("is_active");
            }, 1500);
        } else {
            alert("Please enter your feedback before submitting.");
        }
    });

    $("#reset-button").click(() => {
        $(".reset-popup").addClass("is-visible");
    });

    $(".reset-popup").on("click", function(event){
		if( $(event.target).is(".reset-cancel")) {
			event.preventDefault();
			$(this).removeClass("is-visible");
		}
        if( $(event.target).is(".reset")) {
			event.preventDefault();
            socket.emit("reset-account", username);
			$(this).removeClass("is-visible");
            location.reload();
		}
	});

    $("button, svg, .menu-item, .menu-toggle-btn, .reset, .reset-cancel").click(() => {buttonSound.play()})

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