/* This is the outtermost layout of the page.
 This layout gets appended directly to the body. */

define(
    [
        "backbone.marionette",
        "hbs!templates/mainLayoutTemplate",
        "views/itemviews/headerView",
        "views/collectionviews/personsCollectionView",
        "views/layouts/profileLayout",
        "views/itemviews/bottomAdView",
		"vent"
    ],
    function MainLayout(
		Marionette,
		MainLayoutTemplate,
		headerView,
		PersonsCollectionView,
        profileLayout,
		bottomAdView,
		Vent
		) {
		"use strict";
		
        var MainLayout = Marionette.Layout.extend({
            template:MainLayoutTemplate,
            regions:{
                headerRegion:"#headerRegion",
                mainContentRegion:"#mainContentRegion",
                bottomAdRegion:"#bottomAdRegion"
            },
			initialize: function(){
				_.bindAll(this);
			},
            onShow:function () {
                this.headerRegion.show(headerView);
                this.bottomAdRegion.show(bottomAdView);
            },
			showHome: function(){
				this.mainContentRegion.show(new PersonsCollectionView);
			},
			showProfile: function(profileId){
                console.info("mainLayout, " + profileId);
			}
        });

        var mainLayout = new MainLayout();
		mainLayout.bindTo(Vent, "show:home", mainLayout.showHome);
		mainLayout.bindTo(Vent, "show:profile", mainLayout.showProfile);
		
        return mainLayout;
    }
);
