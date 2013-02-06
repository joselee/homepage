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
		HeaderView,
		PersonsCollectionView,
        ProfileLayout,
		BottomAdView,
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
                this.headerRegion.show(new HeaderView);
                this.bottomAdRegion.show(new BottomAdView);
            },
			showHome: function(){
				this.mainContentRegion.show(new PersonsCollectionView);
			},
			showProfile: function(personId){
                var profileLayout = new ProfileLayout({personId:personId});
                this.mainContentRegion.show(profileLayout);
			}
        });

        var mainLayout = new MainLayout();
		mainLayout.bindTo(Vent, "show:home", mainLayout.showHome);
		mainLayout.bindTo(Vent, "show:profile", mainLayout.showProfile);
		
        return mainLayout;
    }
);
