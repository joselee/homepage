define(
	[
		"backbone.marionette",
		"hbs!templates/headerViewTemplate"
	],
	function HeaderView(Marionette, headerViewTemplate){
		var HeaderView = Marionette.ItemView.extend({
            className: "headerView",
			template: headerViewTemplate
		});

        return HeaderView;
	}
);