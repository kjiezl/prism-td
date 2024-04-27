
/**
 * @param1 == function that returns bool || window[name]
 * @param2 == function that executes if param1 returns true or is loaded
 * @param3 == ignore.
**/

function require(fn, ex=()=>{}, i=0) {
    const interval = 100;
    const timeout = 5000; // throw error after 2 seconds if not yet loaded
    if(typeof(fn) == "string") {
        if(typeof(window[fn]) != "undefined") {
            ex(window[fn]);
        } else if(i*interval < timeout) {
            // function not yet loaded
            setTimeout(require, interval, fn, ex, i + 1);
        } else {
            throw "RequireJS: Load Timeout -- Function " + fn + " failed to load!";
        }
    } else {
        try {
            if(fn() == true) {
                ex();
            } else if(i*interval < timeout) {
                setTimeout(require, interval, fn, ex, i+1);
            } else {
                console.log("RequireJS: Comparison Timeout");
            }
        } catch(e) {};
    }
}