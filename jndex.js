JNDEX.init = function() {
    var File = Backbone.Model.extend({
        defaults: function() {
            return {
                filename: '--',
                url: '#',
                date: '1/1/1970 00:00:00'
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
                      date = d;
                    }
                  });

                  if (filename && date) {
                    json.push({filename: filename, date: date});
                  }
                });

                console.log(json);
                collection.reset(json);               
                console.log(collection.toJSON());
            });

            request.fail(function() {
                console.log('Directory.fetch failed');    
            });
        }
    });

    var cwd = new Directory;

    var FileView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#file-template').html()),
        initialize: function(options) {
            console.log('options', options);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        events: {
            'click': function() { $(this.el).trigger('openfile', this.model); }
        },
        render: function() {
            $(this.el).addClass('span3 thumbnail').html(this.template(this.model.toJSON()));
            return this;
        },
        clear: function() {
            this.model.destroy();
        }
    });

    var JndexView  = Backbone.View.extend({
        float: null,
        clear: null,
        min_width: 0,
        el: $('#jndex'),
        events: {
            'click #breadcrumb a': 'navigate',
            'openfile': 'openFile', 
            'click #overlay': 'closeFile'
        },
        initialize: function() {
            console.log('JndexView.initialize');
            this.listenTo(cwd, 'reset', this.setDirectory);
            // there must be a better way to do this
            var jndex = this;
            $(window).resize(function() { jndex.render() });
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
        openFile: function(e, file) {
            console.log('JndexView.openFile');
            $('#overlay').removeClass('hide').html();
            var src = 'http://adurosolutions.com/jndex/358tlz.jpg';
            var img = new Image();
            img.src = src;
            var w = img.width;
            var h = img.height;

            console.log('a');
            var t = _.template($('#lightbox-template').html())({src: src});
            $('body').append(t);

            console.log($(t));
            console.log($('.lightbox').first());
            console.log('width', $('.lightbox').outerWidth(), $('.lightbox').width());

            var max_width = $('.lightbox').outerWidth();
            var max_height = $('.lightbox').outerHeight();

            $('.lightbox').css('left', ($(window).width()-max_width)/2);
            $('.lightbox').css('top', ($(window).height()-max_height)/2);

            // image + border is greater than window size
            // image is greater than window size
            // image is smaller than window size
            $('.lightbox').removeClass('invisible').html();
        },
        closeFile: function() {
            console.log('close file');
        },
        navigate: function() {
            console.log('navigation');
        },
    });

    var Jndex = new JndexView;
};

JNDEX.dependencies_loaded = function() {
    try {
        if (jQuery != null && _ != null && Backbone != null) {
            console.log('all defined');
            return true;
        }
    }
    catch(e) {
    }
    return false;
}

JNDEX.init_wrapper = function() {
    console.log('trying to load jndex');
    if (!JNDEX.dependencies_loaded()) {
        console.log('failed, will try again');
        setTimeout(JNDEX.init_wrapper, 100);
        return;
    }
    console.log('loaded');
    JNDEX.init();
}

JNDEX.init_wrapper();
