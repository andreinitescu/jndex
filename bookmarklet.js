javascript:(function(){
    try {
        var d = document;
        if (d.jndex) {
            d.jndex.show(); 
        }
        else {
            var s = a.createElement("script");
            s.src="jndex.js?"+(new Date()).getTime());
            d.body.appendChild(s)
        }
    }
    catch(e) {
        // nothing
    }
})();
