define(
	[
		"collections/linksCollection",
		"views/appView"
	],
	function(LinksCollection, AppView){
		var linksCollection = new LinksCollection();
		linksCollection.fetch();
		
		new AppView({
			el: '#app',
			collection: linksCollection
		});
	}
);
