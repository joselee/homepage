define(
    [
		"backbone.marionette",
		"controller"
	],
    function(Marionette, Controller) {
        "use strict";    
        
		var AppRouter = Marionette.AppRouter.extend({
            controller: Controller,
            appRoutes: {
                "": "home",
				"profile/:personid" : "profile"
            },
            start: function() {
                Backbone.history.start();
            }
        });
        return new AppRouter();
    }
);