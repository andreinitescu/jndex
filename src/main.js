require.config({
    /* cache busting */
    /* http://stackoverflow.com/questions/8315088/prevent-requirejs-from-caching-required-scripts */
    urlArgs: "bust="+(new Date()).getTime(),
    paths: {
        jquery: 'vendor/jquery',
        underscore: 'vendor/underscore',
        backbone: 'vendor/backbone',
        jndex: 'jndex',
        'jquery.dateFormat': 'vendor/jquery.dateFormat-1.0'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'jquery.dateFormat': ['jquery']
    }
});

require([
    'jndex'
], function(JNDEX) {
    JNDEX.loadUrl(window.location.pathname||'');
});
