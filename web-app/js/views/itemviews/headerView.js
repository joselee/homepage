define(
	[
		"backbone.marionette",
		"hbs!templates/headerViewTemplate"
	],
	function HeaderView(Marionette, headerViewTemplate){
		var HeaderView = Marionette.ItemView.extend({
            className: "headerView",
			template: headerViewTemplate,
			events: {
				"click .mobileMenuButton": "toggleMobileMenu"
			},
			toggleMobileMenu: function(){
				$(".headerLinksContainer", this.$el).slideToggle("150");
			}
		});

        return HeaderView;
	}
);