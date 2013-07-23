require.config({
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
        jndex: {
            deps: ['jquery', 'jquery.dateFormat', 'underscore', 'backbone'],
            exports: 'JNDEX'
        }, 
        'jquery.dateFormat': ['jquery']
    }
});

require([
    'jndex'
], function(JNDEX) {
    console.log('loaded');
    console.log(JNDEX);
    JNDEX.init();
    console.log('inited');
});
