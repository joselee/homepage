define(
    [
        "backbone.marionette",
        "hbs!templates/profileLayoutTemplate",
		"vent"
    ],
    function MainLayout(
		Marionette,
		ProfileLayoutTemplate,
		Vent
		) {
		"use strict";
		
        var ProfileLayout = Marionette.Layout.extend({
            template:ProfileLayoutTemplate,
            regions:{
                photoRegion: ".photoRegion",
                infoRegion: ".infoRegion"
            },
			initialize: function(){
				_.bindAll(this);
			},
            onShow:function () {
                this.photoRegion.show();
                this.infoRegion.show();
            }
        });
		
        return ProfileLayout;
    }
);
