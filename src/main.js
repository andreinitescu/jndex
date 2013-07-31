require.config({
    /* cache busting */
    /* http://stackoverflow.com/questions/8315088/prevent-requirejs-from-caching-required-scripts */
    urlArgs: "bust="+(new Date()).getTime(),
    baseUrl: 'REQUIREJS_URI/',
    paths: {
        jquery: 'MODULE_PATH:jquery',
        underscore: 'MODULE_PATH:underscorejs',
        backbone: 'MODULE_PATH:backbonejs',
        'jquery.dateFormat': 'MODULE_PATH:jquery.dateFormat'
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
    'BASE_URI/jndex.js'
], function(JNDEX) {
    JNDEX.loadUrl(window.location.pathname||'');
});
