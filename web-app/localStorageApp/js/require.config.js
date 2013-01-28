requirejs.config({
    paths: {
        jquery                          : "libs/jquery-1.8.3.min",
		underscore                      : "libs/underscore-min",
        backbone                        : "libs/backbone-min",
		backboneLocalstorage			: "libs/backbone-localstorage"
    },
	shim: {
		underscore: {
            exports: '_'
        },
		backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
		backboneLocalstorage: {
			deps: ['underscore', 'jquery', 'backbone'],
			exports: 'Store'
		}
    }
});