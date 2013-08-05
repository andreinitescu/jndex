(function() {
    loadCss = function(src) {
        var css = document.createElement('link');
        css.href = src;
        css.rel = 'stylesheet';
        css.media = 'screen';
        document.head.appendChild(css);
    };

    // load css
    loadCss('EXTERNAL_URI/bootstrap.css');
    loadCss('BASE_URI/jndex.css?BUST_CACHE');

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
    '<div id="header">' + 
    '<a class="title" href="https://github.com/dzaman/jndex">jndex</a>' + 
    '<a class="closebtn" href="javascript:window.location.reload()">&#x2715;</a>' +
    //'<a class="refreshbtn" href="#"><img id="progress" src="SVG:spin.svg" width="15px"></a>' + 
    '</div>' + 
    '<div id="subheader" class="clearfix">' + 
        '<ul id="breadcrumb" class="breadcrumb"></ul>' + 
        '<div id="scale" class="hidden">' +
            '<img src="SVG:small.svg" width="12px">' +
            '<input id="slide" type="text" class="span2" value="" data-slider-min="0" data-slider-max="4" data-slider-step="1" data-slider-value="1" data-slider-selection="before" data-slider-tooltip="hide">' +
            '<img src="SVG:large.svg" width="12px">' + 
        '</div>' + 
    '</div>' + 
    '<div id="content">' + 
        '<div class="row-fluid">' + 
            '<ul id="thumbnails" class="thumbnails"></ul>' + 
        '</div>' + 
        // this should use alert markup
        '<div id="empty" class="hide">Empty directory / not an index</div>' + 
        '<div id="error" class="hide">' +
            '<div class="alert alert-block alert-error">' + 
                '<a href="#" class="close">&times;</a>' + 
                '<h4>Error</h4>' + 
                '<p id="error_message"></p>' + 
            '</div>' + 
        '</div>' + 
    '</div>' + 
    '<div id="overlay" class="hide"></div>' + 
    '<div id="lightbox" class="invisible"></div>';
    document.body.appendChild(d);

    var f = document.createElement('script');
    f.id = 'file-template';
    f.type = 'text/template';
    f.innerHTML = 
    '<% if (file.type == "image") { %>' +
        '<img src="<%= file.name %>"' + 
    '<% } else { %>' + 
        '<img src="<%= ICON_DATA[file.type] %>" class="icon">' + 
    '<% } %>' + 
    '<p><span class="title"><a href="<%= file %>"><%= file.name%></a></span>' + 
    '<span class="date"><% print($.format.date(file.date, "MM/dd/yy hh:MM a")); %></span></p>'; 
    document.body.appendChild(f);

    var b = document.createElement('script');
    b.id = 'breadcrumb-template';
    b.type = 'text/template';
    b.innerHTML = '<li><a href="<%= link %>"><%= label %></a> <span class="divider">/</span></li>';
    document.body.appendChild(b);

    // without HTML doctype, $(window).height/width will to $(document).height/width instead of the visible area
    var newDoctype = document.implementation.createDocumentType('html');
    if (document.doctype) {
        document.doctype.parentNode.replaceChild(newDoctype, document.doctype);
    }
    else {
        document.body.parentNode.parentNode.insertBefore(newDoctype, document.body.parentNode.parentNode.firstChild);
    }

    var script = document.createElement('script');
    script.src = 'REQUIREJS_URI/MODULE_PATH:requirejs?BUST_CACHE';
    script.type = 'text/javascript';
    script.setAttribute('data-main', 'BASE_URI/main.js?BUST_CACHE');
    document.head.appendChild(script);

    // insert JLOAD config (# of items per row)
    // or set this as a cookie value
})();
