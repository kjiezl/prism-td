var screenZoom = 1;
$(function() {
    let lastWidth = 0;
    let body = $("body");
    setInterval((window) => {
        
        let winW = window.innerWidth;
        let winH = window.innerHeight;
        
        if(winW == lastWidth) return;
        lastWidth = winW;
        
        let target = canvas.clientWidth;
        let source = winW;
        
        if(winW > winH) {
            // landscape
            body.css({rotate: "0deg"});
            if(winW / 2 > winH) {
                // screen height is ok
                
            } else {
                // screen height is smaller
                target = winH * 2;
            }
        } else {
            // portrait
            try {
                screen.orientation.lock('landscape');
            } catch(e) { };
            alert("Please rotate to landscape mode");
            /*
            target = canvas.clientHeight;
            source = winH;
            body.css({rotate: "90deg"});
            if(winH / 2 > winW) {
                // screen height is ok
            } else {
                // screen width is smaller
                target = winW * 2;
            }
            winH = winW;
            winW = source;
            */
        }
        screenZoom = source / target;
        body.css({zoom: screenZoom, width: winW, height: winH});
        console.log(screenZoom);
        
    }, 2000, window);
    
});