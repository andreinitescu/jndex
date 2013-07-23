define([
    'jquery', 'underscore', 'backbone', 'jquery.dateFormat'
], function($, _, Backbone) { 
    return {
        init: function() {
            
var File = Backbone.Model.extend({
    defaults: function() {
        return {
            filename: '--',
            img: '#', // should be unknown.png
            date: new Date(0)
        };
    }
});

var Directory = Backbone.Collection.extend({
    model: File,
    comparator: 'filename',
    fetch: function() {
        var collection = this;

        console.log('Dictionary.fetch');

        console.log(window.location);
        var request = $.ajax({
            url: window.location
        });

        // yikes, this really needs to be cleaned up...
        request.done(function(data) {
            var json = [];
            $(data).find('tr').each(function() {
              var filename = null;
              var date = null;

              $(this).find('td').each(function() {
                var a = $(this).find('a');
                if (a) {
                  var href = a.attr('href');
                  if (href) {
                    filename = href;
                  }
                }
                var text = $(this).html();
                var d = Date.parse(text);
                if (d) {
                  date = new Date(d);
                }
              });

              console.log('date', date);

              if (filename && date) {
                  if (filename.match(/\.(gif|png|jpg)/i)) {
                      img = filename;
                  }
                  else {
                      img = 'http://localhost/~matthew/jndex/leopard-folder.png';
                  }
                json.push({filename: filename, img: img, date: date});
              }
            });
            
            if (!json.length) { 
                // does not seem to work
                //var pre_html = $(data).find('pre').html();
                var pre_html = data.match(/<pre>((?:(?!<\/pre>)(?:.|\r\n|\n|\r))+)/);
                console.log('pre_html', pre_html);
                if (pre_html[1]) {
                    var filename;
                    var date;
                    var a_regex = /href="([^"]+)"/;
                    var d_regex = / ([0-9]+-[A-Za-z]+-[0-9]+ [0-9]+:[0-9]+) /;
                    pre_html[1].split(/\r\n|\r|\n/).forEach(function(line) {
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

                        if (filename && date) {
                            if (filename.match(/\.(gif|png|jpg)/i)) {
                                img = filename;
                            }
                            else {
                                img = 'http://localhost/~matthew/jndex/leopard-folder.png';
                            }
                            json.push({filename: filename, img: img, date: date});
                        }
                    });
                }
            }

            console.log(json);
            collection.reset(json);               
            console.log(collection.toJSON());
        });

        request.fail(function() {
            console.log('Directory.fetch failed');    
        });
    }
});

var FileView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#file-template').html()),
    initialize: function(options) {
        console.log('options', options);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    events: {
        'click img': 'open',
        'click a': 'open'
    },
    open: function() {
        $(this.el).trigger('openfile', this.model); 
    },
    render: function() {
        $(this.el).addClass('span2 thumbnail').html(this.template(this.model.toJSON()));
        return this;
    },
    clear: function() {
        this.model.destroy();
    }
});

var cwd = new Directory();

var JndexView  = Backbone.View.extend({
    float: null,
    clear: null,
    currentFile: null,
    min_width: 0,
    el: $('#jndex'),
    events: {
        'click #breadcrumb a': 'navigate',
        'openfile': 'openFile', 
        'click #overlay': 'closeFile',
        'click #lightbox': 'closeFile'
    },
    initialize: function() {
        console.log('JndexView.initialize');
        this.listenTo(cwd, 'reset', this.setDirectory);
        // there must be a better way to do this
        var jndex = this;
        $(window).resize(function() { jndex.render(); });
        // Note that fetch should not be used to populate collections on page load — all models needed at 
        // load time should already be bootstrapped in to place. -- backbone docs
        cwd.fetch();
    },
    render: function() {
        console.log('rendering...');

        // handle floating left->right->left based on parent width
        var float = ($('.thumbnail').first().width() <= this.min_width ? 'left' : 'right');
        var clear = (float == 'left' ? 'both' : 'none');

        if (this.float != float) {
            $('#thumbnails').find('.date').css('float', float);
            $('#thumbnails').find('.date').css('clear', clear);
            this.float = float;
        }
        
        if (this.currentFile) {
            // do this in open
            var padding_width = $('#lightbox').outerWidth()-$('#lightbox').width();
            var padding_height = $('#lightbox').outerHeight()-$('#lightbox').height();
            var max_width = this.currentFile.h + padding_width/2;
            var max_height = this.currentFile.w + padding_height/2;
            // -- end do this in open
            //var width = Math.min($(window).width(), max_height);
            //var height = Math.min($(window).height(), max_width);
            var width = Math.min(window.innerWidth, max_height);
            var height = Math.min(window.innerHeight, max_width);

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

            $('#lightbox').find('img').height(height-padding_height); 
            $('#lightbox').find('img').width(width-padding_width);

            //$('#lightbox').css('left', ($(window).width()-width)/2);
            //$('#lightbox').css('top', ($(window).height()-height)/2);
            $('#lightbox').css('left', (window.innerWidth-width)/2);
            $('#lightbox').css('top', (window.innerHeight-height)/2);
        }
    },
    setDirectory: function() {
        console.log('JndexView.setDirectory');
        this.min_width = 0;
        cwd.each(function(file) {
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

            console.log(this);

            if (min_width > this.min_width) {
                this.min_width = min_width;
            }
        }, this);
        console.log(this);
        this.render();
    },
    openFile: function(e, file, file2) {
        console.log('JndexView.openFile', e, file, file2);
        $('#overlay').removeClass('hide');
        var src = file.get('img');
        var img = new Image();
        img.src = src;

        this.currentFile = {
            img: img,
            h: img.height, 
            w: img.width
        };

        $('#lightbox').append(img);
        this.render();
        $('#lightbox').removeClass('invisible');
    },
    closeFile: function() {
        console.log('JndexView.closeFile');
        this.currentFile = null;
        $('#lightbox').addClass('invisible');
        $('#overlay').addClass('hide');
        $('#lightbox').find('img').remove();
    },
    navigate: function() {
        console.log('navigation');
    },
});

var Jndex = new JndexView();

        }
    };
});

