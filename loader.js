JNDEX = {};
JNDEX.bustCache = function(string, doit) {
    if (doit) {
        string += '?' + (new Date()).getTime();
    }
    return string;
}

JNDEX.loadCss = function(src, bustcache) {
    var css = document.createElement('link');
    css.href = JNDEX.bustCache(src, bustcache);
    css.rel = 'stylesheet';
    css.media = 'screen';
    document.head.appendChild(css);
};
JNDEX.loadScript = function (src, bustcache) {
    var script = document.createElement('script');
    script.src = JNDEX.bustCache(src, bustcache);
    script.type = 'text/javascript';
    document.head.appendChild(script);
};

// load css
JNDEX.loadCss('http://localhost/~matthew/jndex/vendor/bootstrap.css');
JNDEX.loadCss('http://localhost/~matthew/jndex/jndex.css', true);

// write document body
// -- this isn't allowed for some reason. chrome says it's unsafe.
// -- might have been caused by HTTP->HTTPS issue
//document.body.innerHTML = 
//'<div id="jndex">' + 
//'    <div id="header"><a href="https://github.com/dzaman/jndex">jndex</a></div>' + 
//'    <ul id="breadcrumb" class="breadcrumb">' + 
//'        <li><a href="#">Home</a> <span class="divider">/</span></li>' + 
//'        <li><a href="#">Library</a> <span class="divider">/</span></li>' + 
//'        <li class="active">Data</li>' + 
//'    </ul>' + 
//'    <div id="content">' + 
//'        <div class="row-fluid">' + 
//'            <ul id="thumbnails" class="thumbnails">' + 
//'            </ul>' + 
//'        </div>' + 
//'    </div>' + 
//'</div>';

var d = document.createElement('div');
d.id = 'jndex';
d.innerHTML = 
'    <div id="header"><a href="https://github.com/dzaman/jndex">jndex</a></div>' + 
'    <ul id="breadcrumb" class="breadcrumb">' + 
//'        <li><a href="#">Home</a> <span class="divider">/</span></li>' + 
//'        <li><a href="#">Library</a> <span class="divider">/</span></li>' + 
'        <li class="active">Directory browsing coming soon...</li>' + 
'    </ul>' + 
'    <div id="content">' + 
'        <div class="row-fluid">' + 
'            <ul id="thumbnails" class="thumbnails">' + 
'            </ul>' + 
'        </div>' + 
'    <div id="overlay" class="hide"></div>' + 
'    <div id="lightbox" class="invisible"></div>' +
'    </div>';
document.body.appendChild(d);

var f = document.createElement('script');
f.id = 'file-template';
f.type = 'text/template';
f.innerHTML = 
'<img src="<%= filename %>">' + 
'<span class="title"><a href="<%= url %>"><%= filename %></a></span>' + 
'<span class="date"><% print($.format.date(date, "MM/dd/yy hh:MM a")); %></span>';
document.body.appendChild(f);

// without HTML doctype, $(window).height/width will to $(document).height/width instead of the visible area
var newDoctype = document.implementation.createDocumentType('html');
document.doctype.parentNode.replaceChild(newDoctype, document.doctype);

// load scripts 
// if backbone is loaded before underscore, we'll have problems
//      Uncaught TypeError: Cannot call method 'each' of undefined 
// using Require.js seems like it might solve this problem
JNDEX.loadScript('http://localhost/~matthew/jndex/vendor/jquery.js');
JNDEX.loadScript('http://localhost/~matthew/jndex/vendor/underscore.js');
JNDEX.loadScript('http://localhost/~matthew/jndex/vendor/backbone.js', true);
JNDEX.loadScript('http://localhost/~matthew/jndex/vendor/jquery.dateFormat-1.0.js');
JNDEX.loadScript('http://localhost/~matthew/jndex/jndex.js', true);
