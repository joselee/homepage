define(
    [
        "backbone.marionette",
        "hbs!templates/profileLayoutTemplate",
        "collections/personsCollection"
    ],
    function MainLayout(
		Marionette,
		ProfileLayoutTemplate,
        personsCollection
		) {
		"use strict";
		
        var ProfileLayout = Marionette.Layout.extend({
            model: null,
            template:ProfileLayoutTemplate,
            regions:{
                photoRegion: ".photoRegion",
                infoRegion: ".infoRegion"
            },
			initialize: function(){
				_.bindAll(this);
                this.model = personsCollection.getPersonById(this.options.personId);
			},
            onShow:function () {
                //this.photoRegion.show();
                //this.infoRegion.show();
            }
        });
		
        return ProfileLayout;
    }
);
