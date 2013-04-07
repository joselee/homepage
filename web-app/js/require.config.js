
requirejs.config({
    paths: {
		jquery                          : "libs/jquery-1.7.2.min",
		backbone                        : "libs/backbone",
		"backbone.eventbinder"          : "libs/backbone.eventbinder",
        "backbone.wreqr"                : "libs/backbone.wreqr",
		"backbone.marionette"           : "libs/backbone.marionette",
		underscore                      : "libs/underscore.min",
		handlebars  					: "libs/handlebars-1.0.0.beta.6",
		hbs								: "libs/hbs",
		json2                           : "libs/json2",
		i18nprecompile                  : "libs/i18nprecompile",
		"backbone.marionette.handlebars": "libs/backbone.marionette.handlebars",
		"juissi"						: "libs/juissi.swipe",
		"vent"							: "vent",
        "atmosphere"                    : "libs/jquery.atmosphere",
        "moment"                        : "libs/moment.min"
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
        handlebars: {
        	exports: "Handlebars"
        },
        "juissi": {
        	deps: ["jquery"],
        	exports: "Conmio"
        },
        atmosphere: {
            deps: ["jquery"],
            exports: "atmosphere"
        },
        moment: {
            exports: "moment"
        }
    },
    deps: ["backbone.marionette.handlebars", "juissi", "atmosphere", "moment"]
});