function require(fn, ex, i=0) {
    const interval = 100;
    const timeout = 5000; // throw error after 2 seconds if not yet loaded
    if(typeof(window[fn]) == "function") {
        ex(fn);
    } else if(i*interval < timeout) {
        // function not yet loaded
        setTimeout(require, interval, fn, ex, i + 1);
    } else {
        throw "RequireJS: Load Timeout -- Function " + fn + " failed to load!";
    }
}