/*jshint evil:true */
javascript:(function(){
    try {
        var d = document;
        // allow for reloading in case of errors
        d.head.innerHTML = '';
        d.body.innerHTML = '';
        var s = d.createElement("script");
        s.type="text/javascript";
        s.src="BASE_URI/loader.js?"+(new Date()).getTime();
        d.head.appendChild(s);
    }
    catch(e) {
        // nothing
    }
})();
