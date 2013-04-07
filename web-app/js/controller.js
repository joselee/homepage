define(
    [
        "backbone",
		"vent"
    ],
    function(Backbone, Vent) {
        "use strict";

        var controller =
            _.bindAll({
                home: function() {
                    Vent.trigger("show:home");
                },
                profile: function(profileId) {
                    Vent.trigger("show:profile", Number(profileId));
				},
                chat: function(){
                    Vent.trigger("show:chat");
                }
            });
        _.extend(controller, Backbone.Events);

        return controller;
    }
);