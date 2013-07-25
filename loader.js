(function() {
    bustCache = function(string, doit) {
        if (doit) {
            string += '?' + (new Date()).getTime();
        }
        return string;
    };

    loadCss = function(src, bustcache) {
        var css = document.createElement('link');
        css.href = bustCache(src, bustcache);
        css.rel = 'stylesheet';
        css.media = 'screen';
        document.head.appendChild(css);
    };

    // load css
    loadCss('http://localhost/~matthew/jndex/vendor/bootstrap.css');
    loadCss('http://localhost/~matthew/jndex/jndex.css', true);

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

    // ✖ - &#10005; &#x2715;
    // ✕ - &#10006; &#x2716;
    var d = document.createElement('div');
    d.id = 'jndex';
    d.innerHTML = 
    '    <div id="header">' + 
    '    <a class="title" href="https://github.com/dzaman/jndex">jndex</a>' + 
    '    <a class="closebtn" href="javascript:(window.location=window.location)">&#x2715;</a></div>' + 
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
    '<img src="<%= img %>">' + 
    '<span class="title"><a href="<%= filename %>"><%= filename %></a></span>' + 
    '<span class="date"><% print($.format.date(date, "MM/dd/yy hh:MM a")); %></span>';
    document.body.appendChild(f);

    // without HTML doctype, $(window).height/width will to $(document).height/width instead of the visible area
    var newDoctype = document.implementation.createDocumentType('html');
    if (document.doctype) {
        document.doctype.parentNode.replaceChild(newDoctype, document.doctype);
    }
    else {
        document.body.parentNode.parentNode.appendChild(newDoctype);
    }

    var script = document.createElement('script');
    script.src = 'http://localhost/~matthew/jndex/vendor/require.js';
    script.type = 'text/javascript';
    script.setAttribute('data-main', bustCache('http://localhost/~matthew/jndex/main.js', true));
    document.head.appendChild(script);

    // insert JLOAD config (# of items per row)
})();
