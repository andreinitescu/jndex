
require.config({
    /* cache busting */
    /* http://stackoverflow.com/questions/8315088/prevent-requirejs-from-caching-required-scripts */
    urlArgs: 'BUST_CACHE',
    baseUrl: 'REQUIREJS_URI/',
    paths: {
        jquery: 'MODULE_PATH:jquery',
        underscore: 'MODULE_PATH:underscorejs',
        backbone: 'MODULE_PATH:backbonejs',
        'jquery-dateFormat': 'MODULE_PATH:jquery-dateFormat',
        'jquery-cookie': 'MODULE_PATH:jquery-cookie',
        '_vendor': 'BASE_URI/vendor'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'jquery-dateFormat': ['jquery'],
        'jquery-cookie': ['jquery'],
        '_vendor': ['jquery']
    }
});

require([
    //'BASE_URI/jndex.js?BUST_CACHE'
    'BASE_URI/jndex.js'
], function(JNDEX) {
    JNDEX.loadUrl();
});
