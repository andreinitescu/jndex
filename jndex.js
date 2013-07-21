//var JNDEX = {};
//JNDEX.min_width = 0;
//JNDEX.float = null;
//JNDEX.refloat = function() {
//    // handle floating left->right->left based on parent width
//    var float = ($('.thumbnail').first().width() <= JNDEX.min_width ? 'left' : 'right');
//    var clear = (float == 'left' ? 'both' : 'none');
//
//    if (JNDEX.float != float) {
//        $('#thumbnails').find('.date').css('float', float);
//        $('#thumbnails').find('.date').css('clear', clear);
//        JNDEX.float = float;
//    }
//};
//
//$(window).resize(JNDEX.refloat);
//$(document).ready(function() {
//    $('.thumbnail').each(function() {
//        var min_width = ($(this).find('.title').outerWidth(true)||0) + 
//                        ($(this).find('.date').outerWidth(true)||0);
//        if (min_width > JNDEX.min_width) {
//            JNDEX.min_width = min_width;
//        }
//    });
//    JNDEX.refloat();
//});

$(function() {
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

            var request = $.ajax({
                url: 'http://localhost/~matthew/jndex/vendor/'
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
        el: $('#jndex'),
        max_width: 0,
        events: {
            'click #breadcrumb a': 'navigate',
            'openfile': 'openFile', 
        },
        initialize: function() {
            console.log('JndexView.initialize');
            this.listenTo(cwd, 'reset', this.setDirectory);
            cwd.fetch();
        },
        setDirectory: function() {
            console.log('JndexView.setDirectory');
            cwd.each(function(file) {
                var view = new FileView({model: file});
                var el = view.render().el;
                // -- works, but 'this' doesn't keep track of the events
                //$(el).on('click', function() { console.log('click2', this); });
                // -- 'this' keeps track of the events, but it doesn't work
                //this.listenTo($(el), 'click', function() { console.log('click', this); });
                this.$("#thumbnails").append(el);
            }, this);
            this.render();
        },
        openFile: function(e, file) {
            console.log('JndexView.openFile');
        },
        render: function() {
            console.log('JndexView.render');
        },
        navigate: function() {
            console.log('navigation');
        },
    });

    var Jndex = new JndexView;

});
