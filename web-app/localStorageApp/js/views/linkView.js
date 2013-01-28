define(
	[
		"underscore",
		"backbone",
		"jquery"
	],
	function(_, Backbone, $){
		// An individual Link's View
		var linkView = Backbone.View.extend({
			template: _.template($('#link-template').html()),
			initialize: function(){
				this.render();
			},
			render: function() {
				this.$el.html(this.template({
					cid:  this.model.cid,
					desc: this.model.get('desc'),
					url:  this.model.get('url')
				}));
			}
		});
		
		return linkView;
	}
);