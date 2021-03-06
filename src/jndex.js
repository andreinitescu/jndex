/* jshint debug:true */
define([
    'jquery', 'underscore', 'backbone', 'jquery-dateFormat', 'jquery-cookie', '_vendor'
], function($, _, Backbone, exports) { 

    var ICON_DATA = {
        video:                      'SVG:video.svg',
        audio:                      'SVG:music.svg',
        'windows-executable':       'SVG:windows.svg',
        'text-document':            'SVG:pencil.svg',
        'android-executable':       'SVG:android.svg',
        archive:                    'SVG:archive.svg',
        spreadsheet:                'SVG:barchart.svg',
        code:                       'SVG:code.svg',
        disc:                       'SVG:drive.svg',
        'osx-executable':           'SVG:apple.svg',
        directory:                  'SVG:folder.svg',
        file:                       'SVG:doc.svg',
    };

    var File = Backbone.Model.extend({
        initialize: function() {
            // no-op 
        },
        defaults: function() {
            return {
                name: '--',
                type: '--',
                date: new Date(0)
            };
        },
        isImg: function() {
            return this.get('type') == 'image';
        },
        isDir: function() {
            return this.get('type') == 'directory';
        }
    });

    var DirectoryResponseHandler = function() {
        var url = null;

        var parseTable = function(data) {
            console.log('parsing table');
            return $.makeArray($(data).find('tr').map(function() {
                var name = null;
                var date = null;

                $(this).find('td').each(function() {
                    var a = $(this).find('a');
                    if (a) {
                        var href = a.attr('href');
                        if (href) {
                            name = href;
                        }
                    }
                    var text = $(this).html();
                    var d = Date.parse(text);
                    if (d) {
                        date = new Date(d);
                    }
                });

                return {name: name, date: date};
            }));
        };

        var parsePre = function(data) { 
            // does not seem to work
            //var pre_html = $(data).find('pre').html();
            var pre_html = data.match(/<pre>((?:(?!<\/pre>)(?:.|\r\n|\n|\r))+)/);
            console.log('pre_html', pre_html);
            if (!pre_html || pre_html.length < 2 || !pre_html[1]) {
                return [];
            }

            var a_regex = /(?:href|HREF)="([^"]+)"/;
            var d_regex = / ([0-9]+-[A-Za-z]+-[0-9]+ [0-9]+:[0-9]+) /;
            return _.map(pre_html[1].split(/\r\n|\r|\n/), function(line) {
                var filename;
                var date;
                console.log('line', line);

                var match = a_regex.exec(line);
                if (match && match[1]) {
                    filename = match[1];
                }

                match = d_regex.exec(line);
                if (match && match[1]) {
                    var date_int = Date.parse(match[1]);
                    if (date_int) {
                        date = new Date(date_int);
                    }
                }

                return {name: filename, date: date};
            });
        };
        
        var requireNameAndDate = function(data) {
            return data.name && data.date;
        };

        var getAbsolutePath = function(name, url) {
            console.log('getAbsolutePath', name, url);
            // url and absolute path 
            if (name.match(/:\/\//)) {
                return name.match(/[A-Za-z0-9]+:\/\/(?:[^\/]+|:[0-9]+)+(\/.+)/)[1];
            }
            // absolute path
            else if (name[0] == '/') {
                return name;
            }
            // relative path
            else {
                if (name.substring(0, 2) == './') {
                    name = name.substring(2);
                }
                return url + name;
            }
            return null;
        };

        var isSubfile = function(path, url) {
            return path.length > url.length && path.substring(0, url.length) == url;
        };

        var parseFileType = function(name) {
            //var types = ['image', 'video', 'audio', 'windows-executable', 'text-document', 'android-executable', 'archive', 'spreadsheet', 'code', 'disc', 'osx-executable', 'file', 'directory'];
            //return types[Math.floor(Math.random()*(types.length-1))];
            if (name.match(/\.(jpg|gif|png|jpg2|tiff)$/i)) {
                return 'image';
            }
            else if (name.match(/\.(avi|mkv|mp4|mov|oog|mpg|mpeg|wmv|flv)$/i)) {
                return 'video';
            }
            else if (name.match(/\.(aiff|au|raw|wav|flac|pac|m4a|wma|mp3|aac|mid)$/i)) {
                return 'audio';
            }
            else if (name.match(/\.exe$/i)) {
                return 'windows-executable';
            }
            else if (name.match(/\.(txt|rtf|md|pod|doc|docx)$/i)) {
                return 'text-document';
            }
            else if (name.match(/\.apk$/i)) {
                return 'android-executable';
            }
            else if (name.match(/\.(zip|bz2|gz|rar|tar)$/i)) {
                return 'archive';
            }
            else if (name.match(/\.(xls|numbers|csv)$/i)) {
                return 'spreadsheet';
            }
            else if (name.match(/\.(php|pl|pm|c|cc|rb|java|js|html|xhtml|xml|json|py)(~|\.swp|\.back\|.tmp)?$/i)) {
                return 'code';
            }
            else if (name.match(/\.(iso|dmg)$/i)) {
                return 'disc';
            }
            else if (name.match(/\/[A-Za-z0-9-_.]+\.app$/i)) {
                return 'osx-executable';
            }
            else if (name.match(/\/$/)) {
                return 'directory';
            }
            else {
                return 'file';
            }
        };

        return {
            parse: function(url, data) {
                var files = [];

                if ($(data).find('table')) {
                    files = parseTable(data);
                    files = files.filter(requireNameAndDate);
                }
                if (!files.length && $(data).find('pre')) {
                    files = parsePre(data);
                    files = files.filter(requireNameAndDate);
                }

                files = _.map(files, function(file) {
                    file.path = getAbsolutePath(file.name, url);
                    file.name = file.path.substring(url.length);
                    return file;
                });

                files = _.filter(files, function(file) {
                    return isSubfile(file.path, url);
                });

                files = _.map(files, function(file) {
                    file.type = parseFileType(file.name);
                    return file;
                });

                return files;
            }
        };
    };

    directoryResponseHandler = new DirectoryResponseHandler();


    var Directory = Backbone.Collection.extend({
        model: File,
        comparator: 'name',
        url: null,
        fetch: function(url) {
            var collection = this;
            this.url = url;

            var request = $.ajax({
                url: url
            });

            $('#progress').addClass('animate-spin');

            request.done(function(data) {
                var models = directoryResponseHandler.parse(url, data);
                if (models) {
                    collection.reset(models);               
                }
            });

            request.fail(function(xhr) {
                console.log(xhr);
                collection.trigger('error', {status: xhr.status, statusText: xhr.statusText});
            });
            
            request.complete(function() {
                setTimeout(function() {
                    $('#progress').removeClass('animate-spin');
                }, 1000);
            });
        }
    });

    var thumbnail_class = 'span2';

    var FileView = Backbone.View.extend({
        tagName: 'li',
        compiled: _.template($('#file-template').html()),
        initialize: function(options) {
            this.listenTo(this.model, 'destroy', this.remove);
        },
        events: {
            'click img': 'open',
            'click a': 'open'
        },
        open: function(event) {
            event.preventDefault();
            $(this.el).trigger('openfile', this.model); 
        },
        render: function() {
            $(this.el).addClass(thumbnail_class + ' thumbnail').html(this.compiled({file: this.model.toJSON(), ICON_DATA: ICON_DATA}));
            return this;
        },
        clear: function() {
            this.model.destroy();
        }
    });

    var JndexView = Backbone.View.extend({
        currentDirectory: null,
        float: null,
        clear: null,
        currentFile: null,
        min_width: 0,
        controlsTimeout: null,
        class_map: ['span1', 'span2', 'span3', 'span4', 'span6'],
        el: $('#jndex'),
        events: {
            'click #breadcrumb a': 'navigate',
            'openfile': 'openFile', 
            'click #overlay': 'closeFile',
            'click #lightbox': 'closeFile',
            'click #error .close': 'hideError',
            'slideChange #scale': 'resizeIcons',
            'mousemove': 'updateControls'
        },
        resetControlsTimeout: function() {
            console.log('adding controls timeout', this.controlsTimeout);
            var context = this;
            clearTimeout(this.controlsTimeout);
            this.controlsTimeout = setTimeout(function() {
                clearTimeout(context.controlsTimeout);
                $('#controls').fadeOut(2000);
                context.controlsTimeout = null;
                console.log('cleared timeout');
            }, 2000);
            console.log('controls timeout = ', this.controlsTimeout);
        },
        nextMoveTime: 0,
        updateControls: function() {
            var time = (new Date()).getTime();
            if (time < this.nextMoveTime) {
                return;
            }
            this.nextMoveTime= time + 250;

            if (this.currentFile) {
                console.log('file open');
                if (this.controlsTimeout) {
                    console.log('timeout active');
                    this.resetControlsTimeout();
                }
                else {
                    console.log('no timeout');
                    this.resetControlsTimeout();
                    $('#controls').stop(true);
                    $('#controls').fadeTo(250,1);
                }
            }
            // maybe update controls here if it's not a mouse event 
        },
        resizeIcons: function(event) {
            console.log(thumbnail_class, event.new);
            $('#thumbnails .' + thumbnail_class).addClass(this.class_map[event.new]).removeClass(thumbnail_class);
            thumbnail_class = this.class_map[event.new];
        },
        initialize: function() {
            console.log('JndexView.initialize');
            this.listenTo(currentDirectory, 'reset', this.resetDirectory);
            this.listenTo(currentDirectory, 'error', this.handleError);

            // there must be a better way to do this
            var jndex = this;
            $(window).resize(function() { jndex.render(); });
            // Note that fetch should not be used to populate collections on page load — all models needed at 
            // load time should already be bootstrapped in to place. -- backbone docs
            this.resetDirectory();
        },
        render: function() {
            console.log('rendering...');

            console.log($('.thumbnail').first().width(), this.min_width);

            // handle floating left->right->left based on parent width
            var float = ($('.thumbnail').first().width() <= this.min_width ? 'left' : 'right');
            var clear = (float == 'left' ? 'both' : 'none');

            console.log(float, this.float);

            if (this.float != float) {
                $('#thumbnails').find('.date').css('float', float);
                $('#thumbnails').find('.date').css('clear', clear);
                this.float = float;
            }
            
            if (this.currentFile) {
                // do this in open
                var padding_width = $('#lightbox').outerWidth()-$('#lightbox').width();
                var padding_height = $('#lightbox').outerHeight()-$('#lightbox').height();
                var max_width = this.currentFile.w + padding_width/2;
                var max_height = this.currentFile.h + padding_height/2;
                // -- end do this in open
                //var width = Math.min($(window).width(), max_height);
                //var height = Math.min($(window).height(), max_width);
                var width = Math.min(window.innerWidth, max_width);
                var height = Math.min(window.innerHeight, max_height);

                console.log(window.innerWidth, max_width, width);
                console.log(window.innerHeight, max_height, height);

                if (width < max_width || height < max_height) {
                    var r_width = width/max_width;
                    var r_height = height/max_height;

                    // scale by height b.c. height is a smaller percentage of the respective max
                    if (r_width > r_height) {
                        width = max_width * r_height;
                    } 
                    // scale by width b.c. width is a smaller percentage of the respecive max
                    else {
                        height = max_height * r_width;
                    }
                }

                $('#open_file').find('img').height(height-padding_height); 
                $('#open_file').find('img').width(width-padding_width);

                //$('#lightbox').css('left', ($(window).width()-width)/2);
                //$('#lightbox').css('top', ($(window).height()-height)/2);
                $('#lightbox').css('left', window.scrollX + (window.innerWidth-width)/2);
                $('#lightbox').css('top', window.scrollY + (window.innerHeight-height)/2);
            }
        },
        hideError: function(e) {
            var delay = (e ? 300 : 1000);
            $('#error').fadeOut(delay);
        },
        handleError: function(error) {
            clearTimeout(this.errorTimeout);
            $('#error_message').text(error.status + ': ' + error.statusText);
            var context = this;
            $('#error').fadeIn(300, function() {
                context.errorTimeout = setTimeout(context.hideError, 2000);
            });
        },
        resetDirectory: function() {
            console.log('JndexView.resetDirectory');
            console.log(currentDirectory.url);

            var breadcrumb_template = $('#breadcrumb-template').html();
            this.$('#breadcrumb li').remove();
            var currentPath = '/';
            var node = _.template(breadcrumb_template, {label: window.location.hostname, link: currentPath}); 
            this.$('#breadcrumb').append(node);
            if (window.location.pathname) {
                var path = window.location.pathname.split("\/");
                for (var i = 0; i < path.length; i++) {
                    if (path[i] === '') {
                        continue; 
                    }
                    currentPath += path[i] + '/';
                    node = _.template(breadcrumb_template, {label: path[i], link: currentPath});
                    this.$('#breadcrumb').append(node);
                }
            }

            $('#slide').slider();
            $('#scale').removeClass('hidden');

            this.min_width = 0;
            this.float = null;
            this.clear = null;
            this.$('#thumbnails .thumbnail').remove();
            if (currentDirectory.length) {
                this.$('#thumbnails').removeClass('hide');
                this.$('#empty').addClass('hide');
                currentDirectory.each(function(file) {
                    var view = new FileView({model: file});
                    var el = view.render().el;
                    // -- works, but 'this' doesn't keep track of the events
                    //$(el).on('click', function() { console.log('click2', this); });
                    // -- 'this' keeps track of the events, but it doesn't work
                    // -- probably why this.listenTo($(window), 'resize', ...) didn't work either
                    //this.listenTo($(el), 'click', function() { console.log('click', this); });
                    this.$("#thumbnails").append(el);
                    var min_width = ($(el).find('.title').outerWidth(true)||0) +
                                    ($(el).find('.date').outerWidth(true)||0);

                    if (min_width > this.min_width) {
                        this.min_width = min_width;
                    }
                }, this);
            }
            else {
                this.$('#thumbnails').addClass('hide');
                this.$('#empty').removeClass('hide');
            }

            this.render();
        },
        openFile: function(e, file, file2) {
            console.log('JndexView.openFile', e, file, file2);
            e.stopPropagation();

            if (file.isImg()) {
                $('#overlay').removeClass('hide');
                var src = file.get('name');
                var img = new Image();
                img.src = src;

                this.currentFile = {
                    img: img,
                    h: img.height, 
                    w: img.width
                };

                $('#open_file').append(img);
                this.render();
                this.updateControls();
                $('#lightbox').removeClass('invisible');
            }
            else if (file.isDir()) {
                console.log('dir', file.get('name'));
                var filename = file.get('name');
                var url;

                if (filename.match("^\/")) {
                    url = filename;
                }
                else {
                    url = window.location.pathname + file.get('name');
                }
                router.navigate(url, {trigger:true});
            }
            else {
                window.open(file.get('name'), '_blank');
            }

        },
        closeFile: function() {
            console.log('JndexView.closeFile');
            this.currentFile = null;
            $('#lightbox').addClass('invisible');
            $('#overlay').addClass('hide');
            $('#open_file').find('img').remove();
        },
        navigate: function(event, element) {
            event.preventDefault();
            router.navigate(event.target.pathname, {trigger:true});
        }
    });

    var Router = Backbone.Router.extend({
        routes: {
            '*path': 'all'
        },
        all: function(path) {
            path = '/' + (path || '');
            console.log('navigating to... ', path);
            currentDirectory.fetch(path);
        }
    });

    // I don't like the visibility of currentDirectory but this will work for now
    var currentDirectory = new Directory();
    var Jndex = new JndexView();
    var router = new Router();

    Backbone.history.start({pushState: true});

    // set JNDEX in the global namespace so that it can be referenced by the bookmarklet to refresh the page
    window.JNDEX = {
        loadUrl: function(options) {
            options = options || {};
            if (!options.url) {
                url = options.url = window.location.pathname || '';
            }
            if (options.refresh) { 
                url += (url.match(/\?/) ? '&' : '?');
                url += (new Date()).getTime();
            }
            router.navigate(url, {trigger:true, replace:options.refresh});

            if (options.refresh) {
                router.navigate(options.url, {trigger:false, replace:true});
            }
        }
    };

    return JNDEX;
});

