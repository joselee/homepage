define(
	[
		"underscore",
		"backbone",
		"jquery",
		"views/linkView"
	],
	function(_, Backbone, $, LinkView){
		var appView = Backbone.View.extend({
			events: {
				"keypress input#link" : "keySave",
				"click button#btnSave" : "save",
				"click button#delete" : "destroy"
			},
			initialize: function() {
				this.render();
			},
			render: function() {
				this.collection.each(function(link){
					this.appendLink(link)
				}, this);
			},
			// Stolen from official 'todos' example.
			keySave: function(e) {
				if (e.keyCode === 13) {
					this.save();
				}
			},
			save: function(){
				// If the user removed the 'http://' make sure to add it back.
				var urlString = $("input#link").val();
				if(urlString.indexOf("http://") === -1){
					urlString = "http://" + urlString;
				}
			
				// Collection Manipulation...
				var link = this.collection.create({
					url:  urlString,
					desc: $("input#desc").val()
				});

				// Clean 'em out
				$("input#desc").val('');
				$("input#link").val('http://');

				// Now reflect in the view.
				this.appendLink(link);
			},
			appendLink: function(link) {
				var linkView = new LinkView({
					model: link
				});
				
				$("div#links", this.$el).append(linkView.el);
			},
			destroy: function(e) {
				// Collection Manipulation...
				var classes = e.currentTarget.className.split(/\s+/);
				var modelID = this.findModelID(classes);
				link = this.collection.getByCid(modelID);
				this.collection.localStorage.destroy(link);
				this.collection.remove(link);

				// Now reflect in the view.
				this.removeLink(modelID);
			},
			findModelID: function (classes) {
				return _.find(classes, function(className) { return className.match(/^c/); });
			},
			removeLink: function(linkID) {
				$('div#' + linkID).remove();
			}		
		});
		
		return appView;
	}
);