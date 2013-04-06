/* This is the outtermost layout of the page.
 This layout gets appended directly to the body. */

define(
    [
        "backbone.marionette",
        "hbs!templates/mainLayoutTemplate",
        "views/itemviews/headerView",
        "views/collectionviews/personsCollectionView",
        "views/collectionviews/profileCollectionView",
        "views/itemviews/bottomAdView",
		"vent"
    ],
    function MainLayout(
		Marionette,
		MainLayoutTemplate,
		HeaderView,
		PersonsCollectionView,
        ProfileCollectionView,
		BottomAdView,
		Vent
		) {
		"use strict";
		
        var MainLayout = Marionette.Layout.extend({
            template:MainLayoutTemplate,
            className: "mainLayout",
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
//                this.bottomAdRegion.show(new BottomAdView);
            },
			showHome: function(){
				this.mainContentRegion.show(new PersonsCollectionView);
			},
			showProfileCarousel: function(profileId){
                var profileCollectionView = new ProfileCollectionView({profileId:profileId});
                this.mainContentRegion.show(profileCollectionView);
			}
        });

        var mainLayout = new MainLayout();
		mainLayout.bindTo(Vent, "show:home", mainLayout.showHome);
		mainLayout.bindTo(Vent, "show:profile", mainLayout.showProfileCarousel);
		
        return mainLayout;
    }
);
