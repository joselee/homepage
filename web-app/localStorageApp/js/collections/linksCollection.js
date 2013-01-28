define(
	[
		"backbone",
		"backboneLocalstorage",
		"models/linkModel"
	],
	function(Backbone, Store, LinkModel){
		var linksCollection = Backbone.Collection.extend({
			model: LinkModel,
			localStorage: new Store("links")
		});
		
		return linksCollection;
	}
);