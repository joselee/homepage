define(
	[
		"backbone.marionette",
		"hbs!templates/headerViewTemplate"
	],
	function HeaderView(Marionette, headerViewTemplate){
		var HeaderView = Marionette.ItemView.extend({
            className: "headerViewItemView",
			template: headerViewTemplate
		});
		
		var headerView = new HeaderView();
        return headerView;
	}
);