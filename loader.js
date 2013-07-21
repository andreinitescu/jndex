JNDEX = {};
JNDEX.loadCss = function(src) {
    var css = document.createElement('link');
    css.href = src;
    css.rel = 'stylesheet';
    css.media = 'screen';
    document.head.appendChild(css);
};
JNDEX.loadScript = function (src) {
    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    document.head.appendChild(script);
};

// load css
JNDEX.loadCss('http://localhost/~matthew/jndex/jndex.css');
JNDEX.loadCss('http://localhost/~matthew/jndex/vendor/bootstrap.css');

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
'        <li><a href="#">Home</a> <span class="divider">/</span></li>' + 
'        <li><a href="#">Library</a> <span class="divider">/</span></li>' + 
'        <li class="active">Data</li>' + 
'    </ul>' + 
'    <div id="content">' + 
'        <div class="row-fluid">' + 
'            <ul id="thumbnails" class="thumbnails">' + 
'            </ul>' + 
'        </div>' + 
'    </div>';
document.body.appendChild(d);

var s = document.createElement('script');
s.id = 'file-template';
s.type = 'text/template';
s.innerHTML = 
'<img src="http://adurosolutions.com/jndex/3q2wfv.jpg">' + 
'<span class="title"><a href="<%- url %>"><%- filename %></a></span>' + 
'<span class="date"><%- date %></span>';

document.body.appendChild(s);

// load scripts 
// if backbone is loaded before underscore, we'll have problems
//      Uncaught TypeError: Cannot call method 'each' of undefined 
// using Require.js seems like it might solve this problem
JNDEX.loadScript('http://localhost/~matthew/jndex/vendor/jquery.js');
JNDEX.loadScript('http://localhost/~matthew/jndex/vendor/underscore.js');
JNDEX.loadScript('http://localhost/~matthew/jndex/vendor/backbone.js');
JNDEX.loadScript('http://localhost/~matthew/jndex/jndex.js?'+(new Date()).getTime());

