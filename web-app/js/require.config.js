
requirejs.config({
    paths: {
		json2                           : "libs/json2",
        jquery                          : "libs/jquery-1.9.0.min",
		underscore                      : "libs/underscore.min",
        backbone                        : "libs/backbone.min",
		"backbone.marionette"           : "libs/backbone.marionette.min",
		"Handlebars"					: "libs/handlebars",
		hbs								: "libs/hbs",
		i18nprecompile                  : "libs/i18nprecompile",
		"backbone.marionette.handlebars": "libs/backbone.marionette.handlebars",
		"juissi"						: "libs/juissi.swipe",
        "bootstrap"                     : "libs/bootstrap.min"
    },
    map: {
        hbs: {
            "hbs/underscore"            : "underscore",
            "hbs/i18nprecompile"        : "i18nprecompile",
            "hbs/json2"                 : "json2"
        }
    },
    hbs: {
        disableI18n: true
    },
	shim: {
		underscore: {
            exports: "_"
        },
		backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        "backbone.marionette": {
        	deps: ["underscore", "jquery", "backbone"],
        	exports: "Marionette"
        },
        "Handlebars": {
        	exports: "Handlebars"
        },
        "juissi": {
        	deps: ["jquery"],
        	exports: "Conmio"
        }
    },
    deps: ["backbone.marionette.handlebars", "juissi"]
});