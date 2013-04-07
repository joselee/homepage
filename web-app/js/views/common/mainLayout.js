/* This is the outtermost layout of the page.
 This layout gets appended directly to the body. */

define(
    [
        "backbone.marionette",
        "hbs!templates/mainLayoutTemplate",
        "views/header/headerView",
        "views/personlist/personsCollectionView",
        "views/profile/profileCollectionView",
        "views/chat/chatView",
		"vent"
    ],
    function MainLayout(
		Marionette,
		MainLayoutTemplate,
		HeaderView,
		PersonsCollectionView,
        ProfileCollectionView,
        ChatView,
		Vent
		) {
		"use strict";
		
        var MainLayout = Marionette.Layout.extend({
            template:MainLayoutTemplate,
            className: "mainLayout",
            regions:{
                headerRegion:"#headerRegion",
                mainContentRegion:"#mainContentRegion"
            },
			initialize: function(){
				_.bindAll(this);
			},
            onShow:function () {
                this.headerRegion.show(new HeaderView);
            },
			showHome: function(){
				this.mainContentRegion.show(new PersonsCollectionView);
			},
			showProfileCarousel: function(profileId){
                var profileCollectionView = new ProfileCollectionView({profileId:profileId});
                this.mainContentRegion.show(profileCollectionView);
			},
            showChat: function(){
                this.mainContentRegion.show(new ChatView);
            }
        });

        var mainLayout = new MainLayout();
		mainLayout.bindTo(Vent, "show:home", mainLayout.showHome);
		mainLayout.bindTo(Vent, "show:profile", mainLayout.showProfileCarousel);
		mainLayout.bindTo(Vent, "show:chat", mainLayout.showChat);

        return mainLayout;
    }
);
